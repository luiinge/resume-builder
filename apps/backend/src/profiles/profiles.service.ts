import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toProfileDto, toProfileSummaryDto } from './profiles.mapper';
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
import { ImportProfileDto } from './dto/import-profile.dto';

const PROFILE_INCLUDE = {
  skills: true,
  languages: true,
  education: true,
  workExperience: true,
  projects: true,
} as const;

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: {
        name: dto.name,
        fullName: dto.personalData.fullName,
        title: dto.personalData.title,
        email: dto.personalData.email,
        phone: dto.personalData.phone,
        address: dto.personalData.address,
        birthDate: dto.personalData.birthDate
          ? new Date(dto.personalData.birthDate)
          : null,
        photoUrl: dto.personalData.photoUrl,
        summary: dto.personalData.summary,
        linkedin: dto.personalData.linkedin,
        website: dto.personalData.website,
      },
      include: PROFILE_INCLUDE,
    });
    return toProfileDto(profile);
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return profiles.map(toProfileSummaryDto);
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
    return toProfileDto(profile);
  }

  async update(id: string, dto: UpdateProfileDto) {
    await this.assertProfileExists(id);
    const { personalData } = dto;
    const profile = await this.prisma.profile.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(personalData?.fullName !== undefined
          ? { fullName: personalData.fullName }
          : {}),
        ...(personalData?.title !== undefined
          ? { title: personalData.title }
          : {}),
        ...(personalData?.email !== undefined
          ? { email: personalData.email }
          : {}),
        ...(personalData?.phone !== undefined
          ? { phone: personalData.phone }
          : {}),
        ...(personalData?.address !== undefined
          ? { address: personalData.address }
          : {}),
        ...(personalData?.birthDate !== undefined
          ? {
              birthDate: personalData.birthDate
                ? new Date(personalData.birthDate)
                : null,
            }
          : {}),
        ...(personalData?.photoUrl !== undefined
          ? { photoUrl: personalData.photoUrl }
          : {}),
        ...(personalData?.summary !== undefined
          ? { summary: personalData.summary }
          : {}),
        ...(personalData?.linkedin !== undefined
          ? { linkedin: personalData.linkedin }
          : {}),
        ...(personalData?.website !== undefined
          ? { website: personalData.website }
          : {}),
      },
      include: PROFILE_INCLUDE,
    });
    return toProfileDto(profile);
  }

  async remove(id: string) {
    await this.assertProfileExists(id);
    await this.prisma.profile.delete({ where: { id } });
  }

  async duplicate(id: string) {
    const source = await this.prisma.profile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!source) {
      throw new NotFoundException(`Profile ${id} not found`);
    }

    const copy = await this.prisma.profile.create({
      data: {
        name: `${source.name} (copy)`,
        fullName: source.fullName,
        title: source.title,
        email: source.email,
        phone: source.phone,
        address: source.address,
        birthDate: source.birthDate,
        photoUrl: source.photoUrl,
        summary: source.summary,
        linkedin: source.linkedin,
        website: source.website,
        skills: {
          create: source.skills.map(({ name, level, description, order }) => ({
            name,
            level,
            description,
            order,
          })),
        },
        languages: {
          create: source.languages.map(({ name, level, order }) => ({
            name,
            level,
            order,
          })),
        },
        education: {
          create: source.education.map(
            ({
              institution,
              degree,
              fieldOfStudy,
              startDate,
              endDate,
              description,
              order,
            }) => ({
              institution,
              degree,
              fieldOfStudy,
              startDate,
              endDate,
              description,
              order,
            }),
          ),
        },
        workExperience: {
          create: source.workExperience.map(
            ({
              company,
              position,
              location,
              startDate,
              endDate,
              description,
              order,
            }) => ({
              company,
              position,
              location,
              startDate,
              endDate,
              description,
              order,
            }),
          ),
        },
        projects: {
          create: source.projects.map(
            ({
              name,
              description,
              url,
              startDate,
              endDate,
              technologies,
              order,
            }) => ({
              name,
              description,
              url,
              startDate,
              endDate,
              technologies,
              order,
            }),
          ),
        },
      },
      include: PROFILE_INCLUDE,
    });
    return toProfileDto(copy);
  }

  async importProfile(dto: ImportProfileDto) {
    const { personalData } = dto;
    const profile = await this.prisma.profile.create({
      data: {
        name: dto.name,
        fullName: personalData.fullName,
        title: personalData.title,
        email: personalData.email,
        phone: personalData.phone,
        address: personalData.address,
        birthDate: personalData.birthDate
          ? new Date(personalData.birthDate)
          : null,
        photoUrl: personalData.photoUrl,
        summary: personalData.summary,
        linkedin: personalData.linkedin,
        website: personalData.website,
        skills: {
          create: (dto.skills ?? []).map((skill, order) => ({
            ...skill,
            order,
          })),
        },
        languages: {
          create: (dto.languages ?? []).map((language, order) => ({
            ...language,
            order,
          })),
        },
        education: {
          create: (dto.education ?? []).map((entry, order) => ({
            institution: entry.institution,
            degree: entry.degree,
            fieldOfStudy: entry.fieldOfStudy,
            startDate: entry.startDate ? new Date(entry.startDate) : null,
            endDate: entry.endDate ? new Date(entry.endDate) : null,
            description: entry.description,
            order,
          })),
        },
        workExperience: {
          create: (dto.workExperience ?? []).map((entry, order) => ({
            company: entry.company,
            position: entry.position,
            location: entry.location,
            startDate: entry.startDate ? new Date(entry.startDate) : null,
            endDate: entry.endDate ? new Date(entry.endDate) : null,
            description: entry.description,
            order,
          })),
        },
        projects: {
          create: (dto.projects ?? []).map((entry, order) => ({
            name: entry.name,
            description: entry.description,
            url: entry.url,
            startDate: entry.startDate ? new Date(entry.startDate) : null,
            endDate: entry.endDate ? new Date(entry.endDate) : null,
            technologies: entry.technologies,
            order,
          })),
        },
      },
      include: PROFILE_INCLUDE,
    });
    return toProfileDto(profile);
  }

  private async assertProfileExists(id: string) {
    const exists = await this.prisma.profile.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
  }

  // --- Skills ---

  async addSkill(profileId: string, dto: CreateSkillDto) {
    await this.assertProfileExists(profileId);
    const count = await this.prisma.skill.count({ where: { profileId } });
    return this.prisma.skill.create({
      data: { ...dto, order: count, profileId },
    });
  }

  async updateSkill(profileId: string, skillId: string, dto: UpdateSkillDto) {
    await this.assertSectionItemExists('skill', skillId, profileId);
    return this.prisma.skill.update({ where: { id: skillId }, data: dto });
  }

  async removeSkill(profileId: string, skillId: string) {
    await this.assertSectionItemExists('skill', skillId, profileId);
    await this.prisma.skill.delete({ where: { id: skillId } });
  }

  async reorderSkills(profileId: string, orderedIds: string[]) {
    await this.assertProfileExists(profileId);
    await this.reorderItems('skill', profileId, orderedIds);
  }

  // --- Languages ---

  async addLanguage(profileId: string, dto: CreateLanguageDto) {
    await this.assertProfileExists(profileId);
    const count = await this.prisma.language.count({ where: { profileId } });
    return this.prisma.language.create({
      data: { ...dto, order: count, profileId },
    });
  }

  async updateLanguage(
    profileId: string,
    languageId: string,
    dto: UpdateLanguageDto,
  ) {
    await this.assertSectionItemExists('language', languageId, profileId);
    return this.prisma.language.update({
      where: { id: languageId },
      data: dto,
    });
  }

  async removeLanguage(profileId: string, languageId: string) {
    await this.assertSectionItemExists('language', languageId, profileId);
    await this.prisma.language.delete({ where: { id: languageId } });
  }

  async reorderLanguages(profileId: string, orderedIds: string[]) {
    await this.assertProfileExists(profileId);
    await this.reorderItems('language', profileId, orderedIds);
  }

  // --- Education ---

  async addEducation(profileId: string, dto: CreateEducationDto) {
    await this.assertProfileExists(profileId);
    const count = await this.prisma.education.count({ where: { profileId } });
    return this.prisma.education.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        order: count,
        profileId,
      },
    });
  }

  async updateEducation(
    profileId: string,
    educationId: string,
    dto: UpdateEducationDto,
  ) {
    await this.assertSectionItemExists('education', educationId, profileId);
    return this.prisma.education.update({
      where: { id: educationId },
      data: {
        ...dto,
        ...(dto.startDate !== undefined
          ? { startDate: dto.startDate ? new Date(dto.startDate) : null }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: dto.endDate ? new Date(dto.endDate) : null }
          : {}),
      },
    });
  }

  async removeEducation(profileId: string, educationId: string) {
    await this.assertSectionItemExists('education', educationId, profileId);
    await this.prisma.education.delete({ where: { id: educationId } });
  }

  async reorderEducation(profileId: string, orderedIds: string[]) {
    await this.assertProfileExists(profileId);
    await this.reorderItems('education', profileId, orderedIds);
  }

  // --- Work experience ---

  async addWorkExperience(profileId: string, dto: CreateWorkExperienceDto) {
    await this.assertProfileExists(profileId);
    const count = await this.prisma.workExperience.count({
      where: { profileId },
    });
    return this.prisma.workExperience.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        order: count,
        profileId,
      },
    });
  }

  async updateWorkExperience(
    profileId: string,
    workExperienceId: string,
    dto: UpdateWorkExperienceDto,
  ) {
    await this.assertSectionItemExists(
      'workExperience',
      workExperienceId,
      profileId,
    );
    return this.prisma.workExperience.update({
      where: { id: workExperienceId },
      data: {
        ...dto,
        ...(dto.startDate !== undefined
          ? { startDate: dto.startDate ? new Date(dto.startDate) : null }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: dto.endDate ? new Date(dto.endDate) : null }
          : {}),
      },
    });
  }

  async removeWorkExperience(profileId: string, workExperienceId: string) {
    await this.assertSectionItemExists(
      'workExperience',
      workExperienceId,
      profileId,
    );
    await this.prisma.workExperience.delete({
      where: { id: workExperienceId },
    });
  }

  async reorderWorkExperience(profileId: string, orderedIds: string[]) {
    await this.assertProfileExists(profileId);
    await this.reorderItems('workExperience', profileId, orderedIds);
  }

  // --- Projects ---

  async addProject(profileId: string, dto: CreateProjectDto) {
    await this.assertProfileExists(profileId);
    const count = await this.prisma.project.count({ where: { profileId } });
    return this.prisma.project.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        order: count,
        profileId,
      },
    });
  }

  async updateProject(
    profileId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    await this.assertSectionItemExists('project', projectId, profileId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...dto,
        ...(dto.startDate !== undefined
          ? { startDate: dto.startDate ? new Date(dto.startDate) : null }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: dto.endDate ? new Date(dto.endDate) : null }
          : {}),
      },
    });
  }

  async removeProject(profileId: string, projectId: string) {
    await this.assertSectionItemExists('project', projectId, profileId);
    await this.prisma.project.delete({ where: { id: projectId } });
  }

  async reorderProjects(profileId: string, orderedIds: string[]) {
    await this.assertProfileExists(profileId);
    await this.reorderItems('project', profileId, orderedIds);
  }

  // --- Shared helpers ---

  private async assertSectionItemExists(
    model: 'skill' | 'language' | 'education' | 'workExperience' | 'project',
    id: string,
    profileId: string,
  ) {
    const delegate = this.prisma[model] as unknown as {
      findUnique: (args: {
        where: { id: string };
        select: { profileId: true };
      }) => Promise<{ profileId: string } | null>;
    };
    const item = await delegate.findUnique({
      where: { id },
      select: { profileId: true },
    });
    if (!item || item.profileId !== profileId) {
      throw new NotFoundException(
        `${model} ${id} not found for profile ${profileId}`,
      );
    }
  }

  private async reorderItems(
    model: 'skill' | 'language' | 'education' | 'workExperience' | 'project',
    profileId: string,
    orderedIds: string[],
  ) {
    const delegate = this.prisma[model] as unknown as {
      findMany: (args: {
        where: { profileId: string };
        select: { id: true };
      }) => Promise<{ id: string }[]>;
      update: (args: {
        where: { id: string };
        data: { order: number };
      }) => Promise<unknown>;
    };
    const existing = await delegate.findMany({
      where: { profileId },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((item) => item.id));
    const providedIds = new Set(orderedIds);
    if (
      existingIds.size !== providedIds.size ||
      [...existingIds].some((id) => !providedIds.has(id))
    ) {
      throw new NotFoundException(
        `orderedIds must contain exactly the existing ${model} entries for this profile`,
      );
    }
    await Promise.all(
      orderedIds.map((id, index) =>
        delegate.update({ where: { id }, data: { order: index } }),
      ),
    );
  }
}
