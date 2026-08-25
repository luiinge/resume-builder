export interface PersonalData {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  photoUrl?: string;
  summary?: string;
  linkedin?: string;
  website?: string;
}

export const SKILL_LEVELS = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Competent' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number]['value'];

export interface Skill {
  id: string;
  name: string;
  level?: SkillLevel;
  description?: string;
  order: number;
}

export interface Language {
  id: string;
  name: string;
  level?: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  order: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string;
  order: number;
}

export interface Profile {
  id: string;
  name: string;
  personalData: PersonalData;
  skills: Skill[];
  languages: Language[];
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSummary {
  id: string;
  name: string;
  personalData: Pick<PersonalData, 'fullName' | 'email' | 'photoUrl'>;
  updatedAt: string;
}
