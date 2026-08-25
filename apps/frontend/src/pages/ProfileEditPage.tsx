import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SKILL_LEVELS } from '@resume-builder/shared';
import type { Profile } from '@resume-builder/shared';
import { profilesApi } from '../api/profiles';
import { ApiError } from '../api/client';
import { ErrorBanner } from '../components/ErrorBanner';
import { SimpleNameLevelSection } from '../components/sections/SimpleNameLevelSection';
import { DetailedEntrySection } from '../components/sections/DetailedEntrySection';
import type { EntryItem } from '../components/sections/DetailedEntrySection';

export default function ProfileEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingPersonalData, setSavingPersonalData] = useState(false);

  function load() {
    if (!id) return;
    profilesApi
      .get(id)
      .then(setProfile)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load the profile'));
  }

  useEffect(load, [id]);

  async function handlePersonalDataSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !profile) return;
    setError(null);
    setSavingPersonalData(true);
    const form = new FormData(event.currentTarget);
    const optional = (key: string) => (String(form.get(key) || '').trim() ? String(form.get(key)) : undefined);
    try {
      await profilesApi.update(id, {
        personalData: {
          fullName: String(form.get('fullName')),
          title: optional('title'),
          email: String(form.get('email')),
          phone: optional('phone'),
          address: optional('address'),
          photoUrl: optional('photoUrl'),
          linkedin: optional('linkedin'),
          website: optional('website'),
          summary: optional('summary'),
        },
      });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save the personal data');
    } finally {
      setSavingPersonalData(false);
    }
  }

  async function handleDeleteProfile() {
    if (!id || !confirm('Delete this profile?')) return;
    await profilesApi.remove(id);
    navigate('/profiles');
  }

  if (error && !profile) return <ErrorBanner message={error} />;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h2>{profile.name}</h2>
        <button className="btn danger" onClick={handleDeleteProfile}>
          Delete profile
        </button>
      </div>

      <ErrorBanner message={error} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Personal data</h3>
        <form onSubmit={handlePersonalDataSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" defaultValue={profile.personalData.fullName} required />
            </div>
            <div className="field">
              <label htmlFor="title">Professional title</label>
              <input id="title" name="title" placeholder="e.g. Software Developer" defaultValue={profile.personalData.title ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={profile.personalData.email} required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" defaultValue={profile.personalData.phone ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" defaultValue={profile.personalData.address ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="linkedin">LinkedIn</label>
              <input id="linkedin" name="linkedin" type="url" defaultValue={profile.personalData.linkedin ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="url" defaultValue={profile.personalData.website ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="photoUrl">Photo URL</label>
              <input id="photoUrl" name="photoUrl" type="url" defaultValue={profile.personalData.photoUrl ?? ''} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" defaultValue={profile.personalData.summary ?? ''} />
          </div>
          <button className="btn" type="submit" disabled={savingPersonalData}>
            Save personal data
          </button>
        </form>

        <SimpleNameLevelSection
          title="Skills"
          items={profile.skills}
          levelOptions={SKILL_LEVELS.map((option) => ({ value: String(option.value), label: option.label }))}
          withDescription
          onAdd={(data) =>
            profilesApi.addSkill(profile.id, { name: data.name, level: data.level ? Number(data.level) : undefined, description: data.description })
          }
          onUpdate={(entryId, data) =>
            profilesApi.updateSkill(profile.id, entryId, {
              name: data.name,
              level: data.level ? Number(data.level) : undefined,
              description: data.description,
            })
          }
          onRemove={(entryId) => profilesApi.removeSkill(profile.id, entryId)}
          onReorder={(orderedIds) => profilesApi.reorderSkills(profile.id, orderedIds)}
          onChange={load}
        />

        <SimpleNameLevelSection
          title="Languages"
          items={profile.languages}
          onAdd={(data) => profilesApi.addLanguage(profile.id, data)}
          onUpdate={(entryId, data) => profilesApi.updateLanguage(profile.id, entryId, data)}
          onRemove={(entryId) => profilesApi.removeLanguage(profile.id, entryId)}
          onReorder={(orderedIds) => profilesApi.reorderLanguages(profile.id, orderedIds)}
          onChange={load}
        />

        <DetailedEntrySection
          title="Education"
          items={profile.education as unknown as EntryItem[]}
          fields={[
            { key: 'degree', label: 'Degree', required: true },
            { key: 'institution', label: 'Institution', required: true },
            { key: 'fieldOfStudy', label: 'Field of study' },
            { key: 'startDate', label: 'Start', type: 'date' },
            { key: 'endDate', label: 'End', type: 'date' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          renderSummary={(item) => (
            <span>
              <strong>{String(item.degree)}</strong> — {String(item.institution)}
            </span>
          )}
          onAdd={(data) => profilesApi.addEducation(profile.id, data as never)}
          onUpdate={(entryId, data) => profilesApi.updateEducation(profile.id, entryId, data as never)}
          onRemove={(entryId) => profilesApi.removeEducation(profile.id, entryId)}
          onReorder={(orderedIds) => profilesApi.reorderEducation(profile.id, orderedIds)}
          onChange={load}
        />

        <DetailedEntrySection
          title="Work Experience"
          items={profile.workExperience as unknown as EntryItem[]}
          fields={[
            { key: 'position', label: 'Position', required: true },
            { key: 'company', label: 'Company', required: true },
            { key: 'location', label: 'Location' },
            { key: 'startDate', label: 'Start', type: 'date' },
            { key: 'endDate', label: 'End', type: 'date' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          renderSummary={(item) => (
            <span>
              <strong>{String(item.position)}</strong> — {String(item.company)}
            </span>
          )}
          onAdd={(data) => profilesApi.addWorkExperience(profile.id, data as never)}
          onUpdate={(entryId, data) => profilesApi.updateWorkExperience(profile.id, entryId, data as never)}
          onRemove={(entryId) => profilesApi.removeWorkExperience(profile.id, entryId)}
          onReorder={(orderedIds) => profilesApi.reorderWorkExperience(profile.id, orderedIds)}
          onChange={load}
        />

        <DetailedEntrySection
          title="Projects"
          items={profile.projects as unknown as EntryItem[]}
          fields={[
            { key: 'name', label: 'Name', required: true },
            { key: 'url', label: 'URL', type: 'url' },
            { key: 'technologies', label: 'Technologies' },
            { key: 'startDate', label: 'Start', type: 'date' },
            { key: 'endDate', label: 'End', type: 'date' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          renderSummary={(item) => <strong>{String(item.name)}</strong>}
          onAdd={(data) => profilesApi.addProject(profile.id, data as never)}
          onUpdate={(entryId, data) => profilesApi.updateProject(profile.id, entryId, data as never)}
          onRemove={(entryId) => profilesApi.removeProject(profile.id, entryId)}
          onReorder={(orderedIds) => profilesApi.reorderProjects(profile.id, orderedIds)}
          onChange={load}
        />
      </div>
    </div>
  );
}
