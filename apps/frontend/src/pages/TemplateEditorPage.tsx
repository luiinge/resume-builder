import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CV_LANGUAGES, DEFAULT_CV_LANGUAGE, DEFAULT_TEMPLATE_CSS, PERSONAL_DATA_FIELD_KEYS, SECTION_IDS } from '@resume-builder/shared';
import type {
  CvLanguage,
  PersonalDataFieldKey,
  ProfileSummary,
  SectionId,
  Template,
  TemplateSectionConfig,
} from '@resume-builder/shared';
import { templatesApi } from '../api/templates';
import { profilesApi } from '../api/profiles';
import { cvApi } from '../api/cv';
import { ApiError } from '../api/client';
import { ErrorBanner } from '../components/ErrorBanner';
import { CssCodeEditor } from '../components/CssCodeEditor';

const SECTION_LABELS: Record<SectionId, string> = {
  'personal-data': 'Personal data',
  summary: 'Summary',
  skills: 'Skills',
  languages: 'Languages',
  education: 'Education',
  'work-experience': 'Work Experience',
  projects: 'Projects',
};

const PERSONAL_DATA_FIELD_LABELS: Record<PersonalDataFieldKey, string> = {
  title: 'Professional title',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  birthDate: 'Date of birth',
  photoUrl: 'Photo',
  linkedin: 'LinkedIn',
  website: 'Website',
};

function defaultSections(): TemplateSectionConfig[] {
  return SECTION_IDS.map((section, index) => ({ section, visible: true, column: 1, order: index + 1 }));
}

function allPersonalDataFieldsVisible(): Record<PersonalDataFieldKey, boolean> {
  return Object.fromEntries(PERSONAL_DATA_FIELD_KEYS.map((key) => [key, true])) as Record<PersonalDataFieldKey, boolean>;
}

export default function TemplateEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [columns, setColumns] = useState(1);
  const [sections, setSections] = useState<TemplateSectionConfig[]>(defaultSections());
  const [personalDataFields, setPersonalDataFields] = useState<Record<PersonalDataFieldKey, boolean>>(allPersonalDataFieldsVisible());
  const [css, setCss] = useState(DEFAULT_TEMPLATE_CSS);
  const [isPredefined, setIsPredefined] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [previewProfileId, setPreviewProfileId] = useState('');
  const [previewLanguage, setPreviewLanguage] = useState<CvLanguage>(DEFAULT_CV_LANGUAGE);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const previewPdfUrlRef = useRef<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'css' | 'preview'>('general');
  const [draggedSection, setDraggedSection] = useState<SectionId | null>(null);

  useEffect(() => {
    profilesApi.list().then((list) => {
      setProfiles(list);
      if (list.length > 0) setPreviewProfileId(list[0].id);
    });
  }, []);

  useEffect(
    () => () => {
      if (previewPdfUrlRef.current) URL.revokeObjectURL(previewPdfUrlRef.current);
    },
    [],
  );

  useEffect(() => {
    if (isNew || !id) return;
    templatesApi
      .get(id)
      .then((template: Template) => {
        setTemplateId(template.id);
        setName(template.name);
        setDescription(template.description ?? '');
        setThumbnailUrl(template.thumbnailUrl ?? '');
        setColumns(template.layoutConfig.columns);
        setSections(template.layoutConfig.sections);
        const visibleFields = template.layoutConfig.visiblePersonalDataFields;
        setPersonalDataFields(
          visibleFields
            ? (Object.fromEntries(
                PERSONAL_DATA_FIELD_KEYS.map((key) => [key, visibleFields.includes(key)]),
              ) as Record<PersonalDataFieldKey, boolean>)
            : allPersonalDataFieldsVisible(),
        );
        setCss(template.css);
        setIsPredefined(template.isPredefined);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load the template'));
  }, [id, isNew]);

  function updateSection(section: SectionId, changes: Partial<TemplateSectionConfig>) {
    setSections((prev) => prev.map((s) => (s.section === section ? { ...s, ...changes } : s)));
  }

  /** Reconstruye columna y orden a partir de listas ordenadas por columna,
   * de modo que column/order siempre queden como 1..N consecutivos. */
  function rebuildSections(byColumn: Map<number, TemplateSectionConfig[]>, totalColumns: number): TemplateSectionConfig[] {
    const next: TemplateSectionConfig[] = [];
    for (let col = 1; col <= totalColumns; col++) {
      (byColumn.get(col) ?? []).forEach((section, index) => {
        next.push({ ...section, column: col, order: index + 1 });
      });
    }
    return next;
  }

  function moveSection(sectionId: SectionId, targetColumn: number, targetIndex: number) {
    setSections((prev) => {
      const bySection = new Map(prev.map((s) => [s.section, s]));
      const moved = bySection.get(sectionId);
      if (!moved) return prev;

      const byColumn = new Map<number, TemplateSectionConfig[]>();
      for (let col = 1; col <= columns; col++) byColumn.set(col, []);
      for (const section of [...prev].sort((a, b) => a.order - b.order)) {
        if (section.section === sectionId) continue;
        const col = Math.min(section.column, columns);
        byColumn.get(col)?.push(section);
      }

      const targetList = byColumn.get(targetColumn) ?? [];
      const insertAt = Math.max(0, Math.min(targetIndex, targetList.length));
      targetList.splice(insertAt, 0, moved);

      return rebuildSections(byColumn, columns);
    });
  }

  function handleColumnsChange(newColumns: number) {
    setColumns(newColumns);
    setSections((prev) => {
      const byColumn = new Map<number, TemplateSectionConfig[]>();
      for (let col = 1; col <= newColumns; col++) byColumn.set(col, []);
      for (const section of [...prev].sort((a, b) => a.order - b.order)) {
        const col = Math.min(section.column, newColumns);
        byColumn.get(col)?.push(section);
      }
      return rebuildSections(byColumn, newColumns);
    });
  }

  async function handleSave(): Promise<string | null> {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        name,
        description: description.trim() || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        layoutConfig: {
          columns,
          sections,
          visiblePersonalDataFields: PERSONAL_DATA_FIELD_KEYS.filter((key) => personalDataFields[key]),
        },
        css,
      };
      if (templateId) {
        const updated = await templatesApi.update(templateId, payload);
        return updated.id;
      }
      const created = await templatesApi.create(payload);
      setTemplateId(created.id);
      navigate(`/templates/${created.id}`, { replace: true });
      return created.id;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save the template');
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handlePreview() {
    if (!previewProfileId) {
      setError('Select a profile to preview');
      return;
    }
    setError(null);
    let currentId = templateId;
    if (!isPredefined) {
      currentId = await handleSave();
    }
    if (!currentId) return;
    setPreviewing(true);
    try {
      const url = await cvApi.previewPdfUrl(previewProfileId, currentId, previewLanguage);
      if (previewPdfUrlRef.current) URL.revokeObjectURL(previewPdfUrlRef.current);
      previewPdfUrlRef.current = url;
      // Oculta el panel lateral de miniaturas y ajusta el zoom al ancho, para
      // aprovechar todo el espacio disponible sin scroll horizontal.
      setPreviewPdfUrl(`${url}#navpanes=0&view=FitH`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to generate the preview');
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>{isNew ? 'New template' : name || 'Template'}</h2>
        {!isPredefined && (
          <button className="btn" onClick={handleSave} disabled={saving}>
            Save
          </button>
        )}
      </div>

      <ErrorBanner message={error} />
      {isPredefined && <p className="badge">Predefined template — read-only, duplicate it to edit</p>}

      <div className="tabs">
        <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')} type="button">
          General
        </button>
        <button className={activeTab === 'css' ? 'active' : ''} onClick={() => setActiveTab('css')} type="button">
          CSS
        </button>
        <button className={activeTab === 'preview' ? 'active' : ''} onClick={() => setActiveTab('preview')} type="button">
          Preview
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="card">
          <div className="field">
            <label htmlFor="tpl-name">Name</label>
            <input id="tpl-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPredefined} required />
          </div>
          <div className="field">
            <label htmlFor="tpl-desc">Description</label>
            <textarea id="tpl-desc" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isPredefined} />
          </div>
          <div className="field">
            <label htmlFor="tpl-thumb">Thumbnail URL</label>
            <input id="tpl-thumb" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled={isPredefined} />
          </div>
          <div className="field">
            <label htmlFor="tpl-columns">Number of columns</label>
            <input
              id="tpl-columns"
              type="number"
              min={1}
              max={4}
              value={columns}
              onChange={(e) => handleColumnsChange(Number(e.target.value))}
              disabled={isPredefined}
            />
          </div>

          <h3>Sections</h3>
          <p className="list-item-subtitle" style={{ marginTop: -8, marginBottom: 12 }}>
            Drag sections to move them between columns or reorder them. The checkbox controls whether they show on the CV.
          </p>
          <div className="dnd-board">
            {Array.from({ length: columns }, (_, i) => i + 1).map((columnNumber) => {
              const columnSections = sections.filter((s) => s.column === columnNumber).sort((a, b) => a.order - b.order);
              return (
                <div
                  key={columnNumber}
                  className="dnd-column"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSection) moveSection(draggedSection, columnNumber, columnSections.length);
                  }}
                >
                  <h4>Column {columnNumber}</h4>
                  {columnSections.map((section, index) => (
                    <div
                      key={section.section}
                      className={`dnd-card${draggedSection === section.section ? ' dragging' : ''}`}
                      draggable={!isPredefined}
                      onDragStart={() => setDraggedSection(section.section)}
                      onDragEnd={() => setDraggedSection(null)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedSection) moveSection(draggedSection, columnNumber, index);
                      }}
                    >
                      <span className="drag-handle">⠿</span>
                      <label style={{ marginBottom: 0, flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={section.visible}
                          disabled={isPredefined}
                          onChange={(e) => updateSection(section.section, { visible: e.target.checked })}
                        />{' '}
                        {SECTION_LABELS[section.section]}
                      </label>
                    </div>
                  ))}
                  {columnSections.length === 0 && <p className="dnd-empty">Drop a section here</p>}
                </div>
              );
            })}
          </div>

          <h3>Visible personal data</h3>
          <div className="field-row">
            {PERSONAL_DATA_FIELD_KEYS.map((key) => (
              <label key={key} style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={personalDataFields[key]}
                  disabled={isPredefined}
                  onChange={(e) => setPersonalDataFields((prev) => ({ ...prev, [key]: e.target.checked }))}
                />{' '}
                {PERSONAL_DATA_FIELD_LABELS[key]}
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'css' && (
        <div className="card">
          <CssCodeEditor value={css} onChange={setCss} readOnly={isPredefined} />
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="card">
          <div className="select-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="preview-profile">Preview profile</label>
              <select id="preview-profile" value={previewProfileId} onChange={(e) => setPreviewProfileId(e.target.value)}>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="preview-language">CV language</label>
              <select id="preview-language" value={previewLanguage} onChange={(e) => setPreviewLanguage(e.target.value as CvLanguage)}>
                {CV_LANGUAGES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" onClick={handlePreview} disabled={profiles.length === 0 || previewing}>
              {previewing ? 'Generating...' : 'Preview'}
            </button>
          </div>
          {previewPdfUrl ? (
            <div className="preview-stage">
              <iframe className="preview-frame" title="CV preview" src={previewPdfUrl} />
            </div>
          ) : (
            <p className="empty-state">Click "Preview" to see the CV with this template.</p>
          )}
        </div>
      )}
    </div>
  );
}
