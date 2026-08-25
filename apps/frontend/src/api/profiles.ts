import type {
  Education,
  Language,
  PersonalData,
  Profile,
  ProfileSummary,
  Project,
  Skill,
  WorkExperience,
} from '@resume-builder/shared';
import { api } from './client';

export interface ProfileImportPayload {
  name: string;
  personalData: PersonalData;
  skills?: Array<{ name: string; level?: number; description?: string }>;
  languages?: Array<{ name: string; level?: string }>;
  education?: Array<Omit<Education, 'id' | 'order'>>;
  workExperience?: Array<Omit<WorkExperience, 'id' | 'order'>>;
  projects?: Array<Omit<Project, 'id' | 'order'>>;
}

/** Deja un perfil (o un JSON previamente exportado con esta misma forma)
 * listo para exportar/importar: sin `id`/`order`, que el backend no acepta
 * en la creación y que de todos modos se regeneran al importar. */
export function toProfileImportPayload(profile: {
  name: string;
  personalData: PersonalData;
  skills?: Skill[];
  languages?: Language[];
  education?: Education[];
  workExperience?: WorkExperience[];
  projects?: Project[];
}): ProfileImportPayload {
  return {
    name: profile.name,
    personalData: profile.personalData,
    skills: (profile.skills ?? []).map(({ name, level, description }) => ({ name, level, description })),
    languages: (profile.languages ?? []).map(({ name, level }) => ({ name, level })),
    education: (profile.education ?? []).map(({ institution, degree, fieldOfStudy, startDate, endDate, description }) => ({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    })),
    workExperience: (profile.workExperience ?? []).map(({ company, position, location, startDate, endDate, description }) => ({
      company,
      position,
      location,
      startDate,
      endDate,
      description,
    })),
    projects: (profile.projects ?? []).map(({ name, description, url, startDate, endDate, technologies }) => ({
      name,
      description,
      url,
      startDate,
      endDate,
      technologies,
    })),
  };
}

export const profilesApi = {
  list: () => api.get<ProfileSummary[]>('/profiles'),
  get: (id: string) => api.get<Profile>(`/profiles/${id}`),
  create: (name: string, personalData: PersonalData) => api.post<Profile>('/profiles', { name, personalData }),
  update: (id: string, changes: { name?: string; personalData?: Partial<PersonalData> }) =>
    api.patch<Profile>(`/profiles/${id}`, changes),
  remove: (id: string) => api.delete<void>(`/profiles/${id}`),
  duplicate: (id: string) => api.post<Profile>(`/profiles/${id}/duplicate`),
  import: (data: ProfileImportPayload) => api.post<Profile>('/profiles/import', data),

  addSkill: (profileId: string, data: { name: string; level?: number; description?: string }) =>
    api.post<Skill>(`/profiles/${profileId}/skills`, data),
  updateSkill: (profileId: string, skillId: string, data: Partial<{ name: string; level?: number; description?: string }>) =>
    api.patch<Skill>(`/profiles/${profileId}/skills/${skillId}`, data),
  removeSkill: (profileId: string, skillId: string) => api.delete<void>(`/profiles/${profileId}/skills/${skillId}`),
  reorderSkills: (profileId: string, orderedIds: string[]) =>
    api.patch<void>(`/profiles/${profileId}/skills/reorder`, { orderedIds }),

  addLanguage: (profileId: string, data: { name: string; level?: string }) =>
    api.post<Language>(`/profiles/${profileId}/languages`, data),
  updateLanguage: (profileId: string, languageId: string, data: Partial<{ name: string; level?: string }>) =>
    api.patch<Language>(`/profiles/${profileId}/languages/${languageId}`, data),
  removeLanguage: (profileId: string, languageId: string) =>
    api.delete<void>(`/profiles/${profileId}/languages/${languageId}`),
  reorderLanguages: (profileId: string, orderedIds: string[]) =>
    api.patch<void>(`/profiles/${profileId}/languages/reorder`, { orderedIds }),

  addEducation: (profileId: string, data: Omit<Education, 'id' | 'order'>) =>
    api.post<Education>(`/profiles/${profileId}/education`, data),
  updateEducation: (profileId: string, educationId: string, data: Partial<Omit<Education, 'id' | 'order'>>) =>
    api.patch<Education>(`/profiles/${profileId}/education/${educationId}`, data),
  removeEducation: (profileId: string, educationId: string) =>
    api.delete<void>(`/profiles/${profileId}/education/${educationId}`),
  reorderEducation: (profileId: string, orderedIds: string[]) =>
    api.patch<void>(`/profiles/${profileId}/education/reorder`, { orderedIds }),

  addWorkExperience: (profileId: string, data: Omit<WorkExperience, 'id' | 'order'>) =>
    api.post<WorkExperience>(`/profiles/${profileId}/work-experience`, data),
  updateWorkExperience: (profileId: string, workExperienceId: string, data: Partial<Omit<WorkExperience, 'id' | 'order'>>) =>
    api.patch<WorkExperience>(`/profiles/${profileId}/work-experience/${workExperienceId}`, data),
  removeWorkExperience: (profileId: string, workExperienceId: string) =>
    api.delete<void>(`/profiles/${profileId}/work-experience/${workExperienceId}`),
  reorderWorkExperience: (profileId: string, orderedIds: string[]) =>
    api.patch<void>(`/profiles/${profileId}/work-experience/reorder`, { orderedIds }),

  addProject: (profileId: string, data: Omit<Project, 'id' | 'order'>) =>
    api.post<Project>(`/profiles/${profileId}/projects`, data),
  updateProject: (profileId: string, projectId: string, data: Partial<Omit<Project, 'id' | 'order'>>) =>
    api.patch<Project>(`/profiles/${profileId}/projects/${projectId}`, data),
  removeProject: (profileId: string, projectId: string) => api.delete<void>(`/profiles/${profileId}/projects/${projectId}`),
  reorderProjects: (profileId: string, orderedIds: string[]) =>
    api.patch<void>(`/profiles/${profileId}/projects/reorder`, { orderedIds }),
};
