/** Idioma en el que se generan los literales fijos del CV (títulos de
 * sección como "Habilidades"/"Skills", "Presente"/"Present", formato de
 * fechas...). Es independiente del idioma de la interfaz de la aplicación. */
export const CV_LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const;

export type CvLanguage = (typeof CV_LANGUAGES)[number]['value'];

export const DEFAULT_CV_LANGUAGE: CvLanguage = 'es';
