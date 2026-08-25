import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { RenderService } from './render.service';
import { RenderCvDto } from './dto/render-cv.dto';

@ApiTags('cv')
@Controller('cv')
export class RenderController {
  constructor(private readonly renderService: RenderService) {}

  @Post('render')
  async render(@Body() dto: RenderCvDto) {
    const { html } = await this.renderService.renderHtml(
      dto.profileId,
      dto.templateId,
      dto.language,
    );
    return { html };
  }

  @Post('export/pdf')
  async exportPdf(@Body() dto: RenderCvDto, @Res() res: Response) {
    const pdf = await this.renderService.renderPdf(
      dto.profileId,
      dto.templateId,
      dto.language,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv.pdf"',
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  }
}
