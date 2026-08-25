import { Injectable, NotFoundException } from '@nestjs/common';
import { chromium } from 'playwright';
import { DEFAULT_CV_LANGUAGE } from '@resume-builder/shared';
import type { CvLanguage, Profile, Template } from '@resume-builder/shared';
import { PrismaService } from '../prisma/prisma.service';
import { toProfileDto } from '../profiles/profiles.mapper';
import { toTemplateDto } from '../templates/templates.mapper';
import { buildCvHtml } from './cv-html.builder';

const PROFILE_INCLUDE = {
  skills: true,
  languages: true,
  education: true,
  workExperience: true,
  projects: true,
} as const;

@Injectable()
export class RenderService {
  constructor(private readonly prisma: PrismaService) {}

  async renderHtml(
    profileId: string,
    templateId: string,
    language: CvLanguage = DEFAULT_CV_LANGUAGE,
  ): Promise<{ html: string; profile: Profile; template: Template }> {
    const [profile, template] = await Promise.all([
      this.getProfile(profileId),
      this.getTemplate(templateId),
    ]);
    const html = buildCvHtml(profile, template, language);
    return { html, profile, template };
  }

  async renderPdf(
    profileId: string,
    templateId: string,
    language: CvLanguage = DEFAULT_CV_LANGUAGE,
  ): Promise<Buffer> {
    const { html } = await this.renderHtml(profileId, templateId, language);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        // Solo margen arriba/abajo: evita que el contenido quede pegado al
        // borde en los saltos de página. Los laterales se dejan a 0 para no
        // perder el sangrado hasta el borde de fondos de columna (p. ej.
        // una barra lateral de color a toda la altura).
        margin: { top: '12mm', bottom: '12mm' },
      });
      return pdf;
    } finally {
      await browser.close();
    }
  }

  private async getProfile(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
    return toProfileDto(profile);
  }

  private async getTemplate(id: string): Promise<Template> {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template ${id} not found`);
    }
    return toTemplateDto(template);
  }
}
