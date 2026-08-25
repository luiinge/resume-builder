export const SECTION_IDS = [
  'personal-data',
  'summary',
  'skills',
  'languages',
  'education',
  'work-experience',
  'projects',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface TemplateSectionConfig {
  section: SectionId;
  visible: boolean;
  column: number;
  order: number;
}

/**
 * Datos personales que se pueden mostrar u ocultar de forma independiente
 * dentro de la sección `personal-data`. `fullName` no está aquí porque
 * siempre se muestra (es el título del CV); `summary` tampoco, porque ahora
 * es una sección propia e independiente (ver `SECTION_IDS`).
 */
export const PERSONAL_DATA_FIELD_KEYS = [
  'title',
  'email',
  'phone',
  'address',
  'birthDate',
  'photoUrl',
  'linkedin',
  'website',
] as const;

export type PersonalDataFieldKey = (typeof PERSONAL_DATA_FIELD_KEYS)[number];

export interface TemplateLayoutConfig {
  columns: number;
  sections: TemplateSectionConfig[];
  /**
   * Campos de datos personales visibles. Si se omite, se consideran todos
   * visibles (compatibilidad con plantillas creadas antes de esta opción).
   */
  visiblePersonalDataFields?: PersonalDataFieldKey[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  isPredefined: boolean;
  layoutConfig: TemplateLayoutConfig;
  css: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  isPredefined: boolean;
  updatedAt: string;
}

/**
 * CSS de partida para una plantilla nueva. Cubre todos los selectores del
 * contrato HTML que genera el motor de renderizado (ver
 * apps/backend/src/render/cv-html.builder.ts): el contenedor general, cada
 * columna, los datos personales, el bloque común de cualquier sección y,
 * opcionalmente, cada sección concreta por separado.
 */
export const DEFAULT_TEMPLATE_CSS = `/* Contenedor general del CV. El número de columnas de layoutConfig ya
   coloca las columnas en una rejilla automáticamente; aquí puedes ajustar
   tipografía, color y espaciado general. */
.cv-root {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #1a1a1a;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
}

/* Cada columna (cv-column-1, cv-column-2...) definida por layoutConfig */
.cv-column {
}

/* --- Datos personales (nombre, foto y datos de contacto que hayas
   marcado como visibles) --- */
[data-section="personal-data"] h1 {
  font-size: 26px;
  margin: 0 0 4px;
}
[data-section="personal-data"] .job-title {
  font-size: 15px;
  font-weight: 500;
  color: #555;
  margin: 0 0 12px;
}
[data-section="personal-data"] .photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}
[data-section="personal-data"] .contact {
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
}
/* Cada dato de contacto visible es un .contact-item con una clase propia
   (.contact-email, .contact-phone, .contact-address, .contact-birthDate,
   .contact-linkedin, .contact-website), separados por " · " por defecto.
   Puedes darle a cada uno su propia línea, icono, etc. Ejemplo:
   [data-section="personal-data"] .contact-item { display: block; }
   [data-section="personal-data"] .contact-email::before { content: '✉ '; } */

/* --- Resumen: ahora es una sección independiente de los datos personales,
   con su propia visibilidad y posición --- */
[data-section="summary"] h2 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

/* --- Estilo común a cualquier sección (resumen, habilidades, idiomas,
   estudios, carrera laboral, proyectos) --- */
.cv-section {
  margin-bottom: 20px;
}
.cv-section h2 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
  margin-bottom: 10px;
}
.cv-section p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* Cada entrada dentro de una sección (una habilidad, un idioma, un puesto...) */
.cv-item {
  margin-bottom: 10px;
}
.item-title {
  font-weight: 600;
}
.item-subtitle {
  color: #555;
  font-size: 13px;
}
.item-dates {
  float: right;
  color: #888;
  font-size: 12px;
}

/* --- Ajustes opcionales por sección concreta, si quieres diferenciarlas --- */
[data-section="summary"] {
}
[data-section="skills"] {
}
[data-section="languages"] {
}
[data-section="education"] {
}
[data-section="work-experience"] {
}
[data-section="projects"] {
}
`;
