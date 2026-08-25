import { useEffect, useRef, useState } from 'react';
import { CV_LANGUAGES, DEFAULT_CV_LANGUAGE } from '@resume-builder/shared';
import type { CvLanguage, ProfileSummary, TemplateSummary } from '@resume-builder/shared';
import { profilesApi } from '../api/profiles';
import { templatesApi } from '../api/templates';
import { cvApi } from '../api/cv';
import { ApiError } from '../api/client';
import { ErrorBanner } from '../components/ErrorBanner';

export default function GeneratePage() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [profileId, setProfileId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [language, setLanguage] = useState<CvLanguage>(DEFAULT_CV_LANGUAGE);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    profilesApi.list().then((list) => {
      setProfiles(list);
      if (list.length > 0) setProfileId(list[0].id);
    });
    templatesApi.list().then((list) => {
      setTemplates(list);
      if (list.length > 0) setTemplateId(list[0].id);
    });
  }, []);

  useEffect(
    () => () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    },
    [],
  );

  async function handlePreview() {
    if (!profileId || !templateId) return;
    setError(null);
    setPreviewing(true);
    try {
      const url = await cvApi.previewPdfUrl(profileId, templateId, language);
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = url;
      // Oculta el panel lateral de miniaturas y ajusta el zoom al ancho, para
      // aprovechar todo el espacio disponible sin scroll horizontal.
      setPdfUrl(`${url}#navpanes=0&view=FitH`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to generate the preview');
    } finally {
      setPreviewing(false);
    }
  }

  async function handleExport() {
    if (!profileId || !templateId) return;
    setError(null);
    setExporting(true);
    try {
      await cvApi.exportPdf(profileId, templateId, language);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to export to PDF');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Generate CV</h2>
      </div>

      <ErrorBanner message={error} />

      <div className="card">
        <div className="select-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="gen-profile">Profile</label>
            <select id="gen-profile" value={profileId} onChange={(e) => setProfileId(e.target.value)}>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="gen-template">Template</label>
            <select id="gen-template" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="gen-language">CV language</label>
            <select id="gen-language" value={language} onChange={(e) => setLanguage(e.target.value as CvLanguage)}>
              {CV_LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={handlePreview} disabled={!profileId || !templateId || previewing}>
            {previewing ? 'Generating...' : 'Preview'}
          </button>
        </div>

        <div className="btn-row" style={{ marginBottom: 16 }}>
          <button className="btn secondary" onClick={handleExport} disabled={!profileId || !templateId || exporting}>
            {exporting ? 'Generating PDF...' : 'Export to PDF'}
          </button>
        </div>

        {pdfUrl ? (
          <div className="preview-stage">
            <iframe className="preview-frame" title="CV preview" src={pdfUrl} />
          </div>
        ) : (
          <p className="empty-state">Select a profile and a template, then click "Preview".</p>
        )}
      </div>
    </div>
  );
}
