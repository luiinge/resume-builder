import type { Template as PrismaTemplate } from '@prisma/client';
import type {
  Template,
  TemplateLayoutConfig,
  TemplateSummary,
} from '@resume-builder/shared';

export function toTemplateDto(template: PrismaTemplate): Template {
  return {
    id: template.id,
    name: template.name,
    description: template.description ?? undefined,
    thumbnailUrl: template.thumbnailUrl ?? undefined,
    isPredefined: template.isPredefined,
    layoutConfig: template.layoutConfig as unknown as TemplateLayoutConfig,
    css: template.css,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };
}

export function toTemplateSummaryDto(
  template: PrismaTemplate,
): TemplateSummary {
  return {
    id: template.id,
    name: template.name,
    description: template.description ?? undefined,
    thumbnailUrl: template.thumbnailUrl ?? undefined,
    isPredefined: template.isPredefined,
    updatedAt: template.updatedAt.toISOString(),
  };
}
