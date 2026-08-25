import type { CvLanguage, SectionId, SkillLevel } from '@resume-builder/shared';

/** Literales fijos del documento (títulos de sección, "Presente"...) por
 * idioma. Independiente del idioma de la interfaz de la aplicación. */
export const SECTION_TITLES: Record<
  CvLanguage,
  Record<Exclude<SectionId, 'personal-data'>, string>
> = {
  es: {
    summary: 'Resumen',
    skills: 'Habilidades',
    languages: 'Idiomas',
    education: 'Estudios',
    'work-experience': 'Carrera laboral',
    projects: 'Proyectos',
  },
  en: {
    summary: 'Summary',
    skills: 'Skills',
    languages: 'Languages',
    education: 'Education',
    'work-experience': 'Work Experience',
    projects: 'Projects',
  },
};

export const SKILL_LEVEL_LABELS: Record<
  CvLanguage,
  Record<SkillLevel, string>
> = {
  es: {
    1: 'Básico',
    2: 'Intermedio',
    3: 'Competente',
    4: 'Avanzado',
    5: 'Experto',
  },
  en: {
    1: 'Basic',
    2: 'Intermediate',
    3: 'Competent',
    4: 'Advanced',
    5: 'Expert',
  },
};

export const PRESENT_LABEL: Record<CvLanguage, string> = {
  es: 'Presente',
  en: 'Present',
};

/** Locale usado para formatear la fecha de nacimiento con Intl/Date. */
export const DATE_LOCALE: Record<CvLanguage, string> = {
  es: 'es-ES',
  en: 'en-US',
};
