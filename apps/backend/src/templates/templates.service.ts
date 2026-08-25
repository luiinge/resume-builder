import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toTemplateDto, toTemplateSummaryDto } from './templates.mapper';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { assertSafeTemplateCss } from './css-sanitizer';
import type { TemplateLayoutConfigDto } from './dto/template-layout-config.dto';

function toJsonValue(layoutConfig: TemplateLayoutConfigDto): object {
  return JSON.parse(JSON.stringify(layoutConfig)) as object;
}

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTemplateDto) {
    assertSafeTemplateCss(dto.css);
    const template = await this.prisma.template.create({
      data: {
        name: dto.name,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        layoutConfig: toJsonValue(dto.layoutConfig),
        css: dto.css,
        isPredefined: false,
      },
    });
    return toTemplateDto(template);
  }

  async findAll() {
    const templates = await this.prisma.template.findMany({
      orderBy: [{ isPredefined: 'desc' }, { updatedAt: 'desc' }],
    });
    return templates.map(toTemplateSummaryDto);
  }

  async findOne(id: string) {
    const template = await this.findOrThrow(id);
    return toTemplateDto(template);
  }

  async update(id: string, dto: UpdateTemplateDto) {
    const existing = await this.findOrThrow(id);
    if (existing.isPredefined) {
      throw new BadRequestException(
        'Predefined templates are not editable; duplicate it to create your own version',
      );
    }
    if (dto.css !== undefined) {
      assertSafeTemplateCss(dto.css);
    }
    const template = await this.prisma.template.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.thumbnailUrl !== undefined
          ? { thumbnailUrl: dto.thumbnailUrl }
          : {}),
        ...(dto.layoutConfig !== undefined
          ? { layoutConfig: toJsonValue(dto.layoutConfig) }
          : {}),
        ...(dto.css !== undefined ? { css: dto.css } : {}),
      },
    });
    return toTemplateDto(template);
  }

  async remove(id: string) {
    const existing = await this.findOrThrow(id);
    if (existing.isPredefined) {
      throw new BadRequestException('Predefined templates cannot be deleted');
    }
    await this.prisma.template.delete({ where: { id } });
  }

  async duplicate(id: string) {
    const source = await this.findOrThrow(id);
    const copy = await this.prisma.template.create({
      data: {
        name: `${source.name} (copy)`,
        description: source.description,
        thumbnailUrl: source.thumbnailUrl,
        layoutConfig: source.layoutConfig as object,
        css: source.css,
        isPredefined: false,
      },
    });
    return toTemplateDto(copy);
  }

  private async findOrThrow(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template ${id} not found`);
    }
    return template;
  }
}
