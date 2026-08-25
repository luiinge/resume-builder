import { DEFAULT_CV_LANGUAGE } from '@resume-builder/shared';
import type {
  CvLanguage,
  PersonalDataFieldKey,
  Profile,
  SectionId,
  SkillLevel,
  Template,
} from '@resume-builder/shared';
import {
  DATE_LOCALE,
  PRESENT_LABEL,
  SECTION_TITLES,
  SKILL_LEVEL_LABELS,
} from './cv-i18n';

function skillLevelLabel(level: SkillLevel, language: CvLanguage): string {
  return SKILL_LEVEL_LABELS[language][level] ?? String(level);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMonthYear(value: string): string {
  const date = new Date(value);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${month}/${date.getUTCFullYear()}`;
}

function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  language: CvLanguage,
): string {
  if (!startDate) return '';
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : PRESENT_LABEL[language];
  return `${start} - ${end}`;
}

function formatBirthDate(
  value: string | undefined,
  language: CvLanguage,
): string | undefined {
  if (!value) return undefined;
  return new Date(value).toLocaleDateString(DATE_LOCALE[language]);
}

function isPersonalDataFieldVisible(
  template: Template,
  key: PersonalDataFieldKey,
): boolean {
  const { visiblePersonalDataFields } = template.layoutConfig;
  return !visiblePersonalDataFields || visiblePersonalDataFields.includes(key);
}

function renderPersonalData(
  profile: Profile,
  template: Template,
  language: CvLanguage,
): string {
  const { personalData } = profile;

  const contactFieldValues: Partial<
    Record<
      Exclude<PersonalDataFieldKey, 'photoUrl' | 'title'>,
      string | undefined
    >
  > = {
    email: personalData.email,
    phone: personalData.phone,
    address: personalData.address,
    birthDate: formatBirthDate(personalData.birthDate, language),
    linkedin: personalData.linkedin,
    website: personalData.website,
  };

  const contactParts = (
    ['email', 'phone', 'address', 'birthDate', 'linkedin', 'website'] as const
  )
    .filter((key) => isPersonalDataFieldVisible(template, key))
    .filter((key) => Boolean(contactFieldValues[key]))
    .map(
      (key) =>
        `<span class="contact-item contact-${key}">${escapeHtml(contactFieldValues[key] ?? '')}</span>`,
    );

  const showPhoto =
    isPersonalDataFieldVisible(template, 'photoUrl') &&
    Boolean(personalData.photoUrl);

  const showTitle =
    isPersonalDataFieldVisible(template, 'title') &&
    Boolean(personalData.title);

  return `
    <section class="cv-section" data-section="personal-data">
      ${showPhoto ? `<img class="photo" src="${escapeHtml(personalData.photoUrl ?? '')}" alt="" />` : ''}
      <h1>${escapeHtml(personalData.fullName)}</h1>
      ${showTitle ? `<p class="job-title">${escapeHtml(personalData.title ?? '')}</p>` : ''}
      <div class="contact">${contactParts.join('')}</div>
    </section>
  `;
}

function renderSummary(profile: Profile, language: CvLanguage): string | null {
  if (!profile.personalData.summary) return null;
  return `
    <section class="cv-section" data-section="summary">
      <h2>${SECTION_TITLES[language].summary}</h2>
      <p>${escapeHtml(profile.personalData.summary)}</p>
    </section>
  `;
}

function renderItemsSection(
  sectionId: Exclude<SectionId, 'personal-data' | 'summary'>,
  itemsHtml: string,
  language: CvLanguage,
): string {
  return `
    <section class="cv-section" data-section="${sectionId}">
      <h2>${SECTION_TITLES[language][sectionId]}</h2>
      ${itemsHtml}
    </section>
  `;
}

function renderSkills(profile: Profile, language: CvLanguage): string | null {
  if (profile.skills.length === 0) return null;
  const items = profile.skills
    .map(
      (skill) => `<div class="cv-item">
        <span class="item-title">${escapeHtml(skill.name)}</span>${skill.level ? ` <span class="item-subtitle">${escapeHtml(skillLevelLabel(skill.level, language))}</span>` : ''}
        ${skill.description ? `<p>${escapeHtml(skill.description)}</p>` : ''}
      </div>`,
    )
    .join('');
  return renderItemsSection('skills', items, language);
}

function renderLanguages(
  profile: Profile,
  language: CvLanguage,
): string | null {
  if (profile.languages.length === 0) return null;
  const items = profile.languages
    .map(
      (item) =>
        `<div class="cv-item"><span class="item-title">${escapeHtml(item.name)}</span>${item.level ? ` <span class="item-subtitle">${escapeHtml(item.level)}</span>` : ''}</div>`,
    )
    .join('');
  return renderItemsSection('languages', items, language);
}

function renderEducation(
  profile: Profile,
  language: CvLanguage,
): string | null {
  if (profile.education.length === 0) return null;
  const items = profile.education
    .map(
      (entry) => `
      <div class="cv-item">
        <span class="item-dates">${formatDateRange(entry.startDate, entry.endDate, language)}</span>
        <div class="item-title">${escapeHtml(entry.degree)}</div>
        <div class="item-subtitle">${escapeHtml(entry.institution)}${entry.fieldOfStudy ? ` &middot; ${escapeHtml(entry.fieldOfStudy)}` : ''}</div>
        ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ''}
      </div>`,
    )
    .join('');
  return renderItemsSection('education', items, language);
}

function renderWorkExperience(
  profile: Profile,
  language: CvLanguage,
): string | null {
  if (profile.workExperience.length === 0) return null;
  const items = profile.workExperience
    .map(
      (entry) => `
      <div class="cv-item">
        <span class="item-dates">${formatDateRange(entry.startDate, entry.endDate, language)}</span>
        <div class="item-title">${escapeHtml(entry.position)}</div>
        <div class="item-subtitle">${escapeHtml(entry.company)}${entry.location ? ` &middot; ${escapeHtml(entry.location)}` : ''}</div>
        ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ''}
      </div>`,
    )
    .join('');
  return renderItemsSection('work-experience', items, language);
}

function renderProjects(profile: Profile, language: CvLanguage): string | null {
  if (profile.projects.length === 0) return null;
  const items = profile.projects
    .map(
      (entry) => `
      <div class="cv-item">
        <span class="item-dates">${formatDateRange(entry.startDate, entry.endDate, language)}</span>
        <div class="item-title">${escapeHtml(entry.name)}${entry.url ? ` &middot; <a href="${escapeHtml(entry.url)}">${escapeHtml(entry.url)}</a>` : ''}</div>
        ${entry.technologies ? `<div class="item-subtitle">${escapeHtml(entry.technologies)}</div>` : ''}
        ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ''}
      </div>`,
    )
    .join('');
  return renderItemsSection('projects', items, language);
}

const SECTION_RENDERERS: Record<
  SectionId,
  (profile: Profile, template: Template, language: CvLanguage) => string | null
> = {
  'personal-data': renderPersonalData,
  summary: (profile, _template, language) => renderSummary(profile, language),
  skills: (profile, _template, language) => renderSkills(profile, language),
  languages: (profile, _template, language) =>
    renderLanguages(profile, language),
  education: (profile, _template, language) =>
    renderEducation(profile, language),
  'work-experience': (profile, _template, language) =>
    renderWorkExperience(profile, language),
  projects: (profile, _template, language) => renderProjects(profile, language),
};

/**
 * Genera el documento HTML completo combinando un perfil y una plantilla.
 * El marcado (data-section, cv-section, cv-item...) es el contrato estable
 * contra el que se escribe el CSS de cualquier plantilla (ver design.md).
 * `language` controla el idioma de los literales fijos del documento
 * (títulos de sección, "Presente"/"Present", formato de fechas), no el de
 * los datos del perfil en sí.
 */
export function buildCvHtml(
  profile: Profile,
  template: Template,
  language: CvLanguage = DEFAULT_CV_LANGUAGE,
): string {
  const visibleSections = template.layoutConfig.sections
    .filter((config) => config.visible)
    .sort((a, b) => a.order - b.order);

  const columns = new Map<number, string[]>();
  for (const config of visibleSections) {
    const html = SECTION_RENDERERS[config.section](profile, template, language);
    if (!html) continue;
    const columnHtml = columns.get(config.column) ?? [];
    columnHtml.push(html);
    columns.set(config.column, columnHtml);
  }

  const columnsHtml = Array.from(
    { length: template.layoutConfig.columns },
    (_, index) => index + 1,
  )
    .map(
      (columnNumber) =>
        `<div class="cv-column cv-column-${columnNumber}">${(columns.get(columnNumber) ?? []).join('')}</div>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.personalData.fullName)} - CV</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; }
      /* Layout base derivado de layoutConfig.columns: coloca las columnas
         una al lado de otra aunque la plantilla no defina su propio grid.
         El CSS de la plantilla se carga después y puede sobreescribirlo. */
      .cv-root {
        display: grid;
        grid-template-columns: repeat(${template.layoutConfig.columns}, 1fr);
        gap: 24px;
        align-items: start;
      }
      .cv-column {
        min-width: 0;
      }
      /* Separador por defecto entre datos de contacto; cualquier plantilla
         puede sobreescribirlo (p. ej. para poner cada dato en su propia
         línea con un icono en su lugar). */
      .contact-item:not(:last-child)::after {
        content: ' \\00b7 ';
      }
      /* Respeta los saltos de línea que el usuario escribió en el resumen y
         en las descripciones (por defecto el navegador los colapsaría). */
      .cv-section p {
        white-space: pre-line;
      }
      /* Evita cortar una entrada (una habilidad, un puesto...) o los datos
         personales a mitad entre dos páginas al exportar a PDF: si no caben
         enteros en lo que queda de página, pasan a la siguiente. Para forzar
         un salto de página antes de una sección concreta, la propia
         plantilla puede añadir p. ej.
         [data-section="education"] { break-before: page; } */
      .cv-item,
      [data-section="personal-data"],
      [data-section="summary"] {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      h2 {
        break-after: avoid;
        page-break-after: avoid;
      }
      ${template.css}
    </style>
  </head>
  <body>
    <div class="cv-root">${columnsHtml}</div>
  </body>
</html>`;
}
