import { BadRequestException } from '@nestjs/common';

const IMPORT_RULE = /@import\b/i;
const REMOTE_URL_RULE = /url\(\s*['"]?\s*(https?:)?\/\//i;

/**
 * Bloquea construcciones que harían que el navegador cargue recursos remotos
 * no confiables al renderizar el CSS de una plantilla (ver design.md, riesgo
 * de CSS-como-código en la vista previa/exportación).
 */
export function assertSafeTemplateCss(css: string): void {
  if (IMPORT_RULE.test(css)) {
    throw new BadRequestException('Template CSS cannot contain @import rules');
  }
  if (REMOTE_URL_RULE.test(css)) {
    throw new BadRequestException(
      'Template CSS cannot reference url() from a remote origin',
    );
  }
}
