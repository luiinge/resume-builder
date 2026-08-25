import type { Template, TemplateLayoutConfig, TemplateSummary } from '@resume-builder/shared';
import { api } from './client';

export interface TemplateInput {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  layoutConfig: TemplateLayoutConfig;
  css: string;
}

/** Deja una plantilla (o un JSON previamente exportado con esta misma forma)
 * lista para exportar/importar: sin `id`/`isPredefined`/timestamps. */
export function toTemplateImportPayload(template: {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  layoutConfig: TemplateLayoutConfig;
  css: string;
}): TemplateInput {
  return {
    name: template.name,
    description: template.description,
    thumbnailUrl: template.thumbnailUrl,
    layoutConfig: template.layoutConfig,
    css: template.css,
  };
}

export const templatesApi = {
  list: () => api.get<TemplateSummary[]>('/templates'),
  get: (id: string) => api.get<Template>(`/templates/${id}`),
  create: (data: TemplateInput) => api.post<Template>('/templates', data),
  update: (id: string, data: Partial<TemplateInput>) => api.patch<Template>(`/templates/${id}`, data),
  remove: (id: string) => api.delete<void>(`/templates/${id}`),
  duplicate: (id: string) => api.post<Template>(`/templates/${id}/duplicate`),
};
