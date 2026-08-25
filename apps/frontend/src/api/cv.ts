import type { CvLanguage } from '@resume-builder/shared';
import { downloadFile, fetchObjectUrl } from './client';

export const cvApi = {
  exportPdf: (profileId: string, templateId: string, language: CvLanguage, filename = 'cv.pdf') =>
    downloadFile('/cv/export/pdf', { profileId, templateId, language }, filename),
  /** URL de blob del PDF, para mostrarlo en un <iframe> con la paginación
   * real (saltos de página) tal como saldría el fichero exportado. */
  previewPdfUrl: (profileId: string, templateId: string, language: CvLanguage) =>
    fetchObjectUrl('/cv/export/pdf', { profileId, templateId, language }),
};
