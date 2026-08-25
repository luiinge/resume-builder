import type {
  Education,
  Language,
  Profile as PrismaProfile,
  Project,
  Skill,
  WorkExperience,
} from '@prisma/client';
import type {
  Profile,
  ProfileSummary,
  SkillLevel,
} from '@resume-builder/shared';

type ProfileWithSections = PrismaProfile & {
  skills: Skill[];
  languages: Language[];
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
};

function toIsoOrUndefined(date: Date | null): string | undefined {
  return date ? date.toISOString() : undefined;
}

export function toProfileDto(profile: ProfileWithSections): Profile {
  return {
    id: profile.id,
    name: profile.name,
    personalData: {
      fullName: profile.fullName,
      title: profile.title ?? undefined,
      email: profile.email,
      phone: profile.phone ?? undefined,
      address: profile.address ?? undefined,
      birthDate: toIsoOrUndefined(profile.birthDate),
      photoUrl: profile.photoUrl ?? undefined,
      summary: profile.summary ?? undefined,
      linkedin: profile.linkedin ?? undefined,
      website: profile.website ?? undefined,
    },
    skills: profile.skills
      .sort((a, b) => a.order - b.order)
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: (skill.level ?? undefined) as SkillLevel | undefined,
        description: skill.description ?? undefined,
        order: skill.order,
      })),
    languages: profile.languages
      .sort((a, b) => a.order - b.order)
      .map((language) => ({
        id: language.id,
        name: language.name,
        level: language.level ?? undefined,
        order: language.order,
      })),
    education: profile.education
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        id: entry.id,
        institution: entry.institution,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy ?? undefined,
        startDate: toIsoOrUndefined(entry.startDate),
        endDate: toIsoOrUndefined(entry.endDate),
        description: entry.description ?? undefined,
        order: entry.order,
      })),
    workExperience: profile.workExperience
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        id: entry.id,
        company: entry.company,
        position: entry.position,
        location: entry.location ?? undefined,
        startDate: toIsoOrUndefined(entry.startDate),
        endDate: toIsoOrUndefined(entry.endDate),
        description: entry.description ?? undefined,
        order: entry.order,
      })),
    projects: profile.projects
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        description: entry.description ?? undefined,
        url: entry.url ?? undefined,
        startDate: toIsoOrUndefined(entry.startDate),
        endDate: toIsoOrUndefined(entry.endDate),
        technologies: entry.technologies ?? undefined,
        order: entry.order,
      })),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function toProfileSummaryDto(profile: PrismaProfile): ProfileSummary {
  return {
    id: profile.id,
    name: profile.name,
    personalData: {
      fullName: profile.fullName,
      email: profile.email,
      photoUrl: profile.photoUrl ?? undefined,
    },
    updatedAt: profile.updatedAt.toISOString(),
  };
}
