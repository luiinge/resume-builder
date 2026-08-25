import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ProfileSummary } from '@resume-builder/shared';
import { profilesApi } from '../api/profiles';
import { ApiError } from '../api/client';
import { ErrorBanner } from '../components/ErrorBanner';

export default function ProfileListPage() {
  const [profiles, setProfiles] = useState<ProfileSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  function load() {
    profilesApi
      .list()
      .then(setProfiles)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load profiles'));
  }

  useEffect(load, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const profile = await profilesApi.create(name, { fullName, email });
      navigate(`/profiles/${profile.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create the profile');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this profile? This action cannot be undone.')) return;
    try {
      await profilesApi.remove(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete the profile');
    }
  }

  async function handleDuplicate(id: string) {
    try {
      await profilesApi.duplicate(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to duplicate the profile');
    }
  }

  async function handleRename(profile: ProfileSummary) {
    const newName = prompt('New profile name:', profile.name);
    if (!newName || !newName.trim() || newName === profile.name) return;
    try {
      await profilesApi.update(profile.id, { name: newName.trim() });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to rename the profile');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Profiles</h2>
        <button className="btn" onClick={() => setCreating((v) => !v)}>
          {creating ? 'Cancel' : 'New profile'}
        </button>
      </div>

      <ErrorBanner message={error} />

      {creating && (
        <form className="card" onSubmit={handleCreate}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Profile name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <button className="btn" type="submit">
            Create profile
          </button>
        </form>
      )}

      {profiles === null ? (
        <p>Loading...</p>
      ) : profiles.length === 0 ? (
        <div className="empty-state">No profiles yet. Create the first one.</div>
      ) : (
        <ul className="list">
          {profiles.map((profile) => (
            <li key={profile.id} className="list-item">
              <div>
                <div className="list-item-title">{profile.name}</div>
                <div className="list-item-subtitle">
                  {profile.personalData.fullName} &middot; {profile.personalData.email}
                </div>
              </div>
              <div className="btn-row">
                <Link className="btn secondary small" to={`/profiles/${profile.id}`}>
                  Edit
                </Link>
                <button className="btn secondary small" onClick={() => handleRename(profile)}>
                  Rename
                </button>
                <button className="btn secondary small" onClick={() => handleDuplicate(profile.id)}>
                  Duplicate
                </button>
                <button className="btn danger small" onClick={() => handleDelete(profile.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
