import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto, UpdateSkillDto } from './dto/skill.dto';
import { CreateLanguageDto, UpdateLanguageDto } from './dto/language.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
} from './dto/work-experience.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ReorderDto } from './dto/reorder.dto';
import { ImportProfileDto } from './dto/import-profile.dto';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profilesService.create(dto);
  }

  @Post('import')
  importProfile(@Body() dto: ImportProfileDto) {
    return this.profilesService.importProfile(dto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.profilesService.duplicate(id);
  }

  // --- Skills ---

  @Post(':id/skills')
  addSkill(@Param('id') id: string, @Body() dto: CreateSkillDto) {
    return this.profilesService.addSkill(id, dto);
  }

  @Patch(':id/skills/reorder')
  reorderSkills(@Param('id') id: string, @Body() dto: ReorderDto) {
    return this.profilesService.reorderSkills(id, dto.orderedIds);
  }

  @Patch(':id/skills/:skillId')
  updateSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.profilesService.updateSkill(id, skillId, dto);
  }

  @Delete(':id/skills/:skillId')
  removeSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.profilesService.removeSkill(id, skillId);
  }

  // --- Languages ---

  @Post(':id/languages')
  addLanguage(@Param('id') id: string, @Body() dto: CreateLanguageDto) {
    return this.profilesService.addLanguage(id, dto);
  }

  @Patch(':id/languages/reorder')
  reorderLanguages(@Param('id') id: string, @Body() dto: ReorderDto) {
    return this.profilesService.reorderLanguages(id, dto.orderedIds);
  }

  @Patch(':id/languages/:languageId')
  updateLanguage(
    @Param('id') id: string,
    @Param('languageId') languageId: string,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.profilesService.updateLanguage(id, languageId, dto);
  }

  @Delete(':id/languages/:languageId')
  removeLanguage(
    @Param('id') id: string,
    @Param('languageId') languageId: string,
  ) {
    return this.profilesService.removeLanguage(id, languageId);
  }

  // --- Education ---

  @Post(':id/education')
  addEducation(@Param('id') id: string, @Body() dto: CreateEducationDto) {
    return this.profilesService.addEducation(id, dto);
  }

  @Patch(':id/education/reorder')
  reorderEducation(@Param('id') id: string, @Body() dto: ReorderDto) {
    return this.profilesService.reorderEducation(id, dto.orderedIds);
  }

  @Patch(':id/education/:educationId')
  updateEducation(
    @Param('id') id: string,
    @Param('educationId') educationId: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.profilesService.updateEducation(id, educationId, dto);
  }

  @Delete(':id/education/:educationId')
  removeEducation(
    @Param('id') id: string,
    @Param('educationId') educationId: string,
  ) {
    return this.profilesService.removeEducation(id, educationId);
  }

  // --- Work experience ---

  @Post(':id/work-experience')
  addWorkExperience(
    @Param('id') id: string,
    @Body() dto: CreateWorkExperienceDto,
  ) {
    return this.profilesService.addWorkExperience(id, dto);
  }

  @Patch(':id/work-experience/reorder')
  reorderWorkExperience(@Param('id') id: string, @Body() dto: ReorderDto) {
    return this.profilesService.reorderWorkExperience(id, dto.orderedIds);
  }

  @Patch(':id/work-experience/:workExperienceId')
  updateWorkExperience(
    @Param('id') id: string,
    @Param('workExperienceId') workExperienceId: string,
    @Body() dto: UpdateWorkExperienceDto,
  ) {
    return this.profilesService.updateWorkExperience(id, workExperienceId, dto);
  }

  @Delete(':id/work-experience/:workExperienceId')
  removeWorkExperience(
    @Param('id') id: string,
    @Param('workExperienceId') workExperienceId: string,
  ) {
    return this.profilesService.removeWorkExperience(id, workExperienceId);
  }

  // --- Projects ---

  @Post(':id/projects')
  addProject(@Param('id') id: string, @Body() dto: CreateProjectDto) {
    return this.profilesService.addProject(id, dto);
  }

  @Patch(':id/projects/reorder')
  reorderProjects(@Param('id') id: string, @Body() dto: ReorderDto) {
    return this.profilesService.reorderProjects(id, dto.orderedIds);
  }

  @Patch(':id/projects/:projectId')
  updateProject(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.profilesService.updateProject(id, projectId, dto);
  }

  @Delete(':id/projects/:projectId')
  removeProject(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    return this.profilesService.removeProject(id, projectId);
  }
}
