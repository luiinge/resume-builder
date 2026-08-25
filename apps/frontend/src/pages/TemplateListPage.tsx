import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { TemplateSummary } from '@resume-builder/shared';
import { templatesApi } from '../api/templates';
import { ApiError } from '../api/client';
import { ErrorBanner } from '../components/ErrorBanner';

export default function TemplateListPage() {
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function load() {
    templatesApi
      .list()
      .then(setTemplates)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load the templates'));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this template?')) return;
    try {
      await templatesApi.remove(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete the template');
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const copy = await templatesApi.duplicate(id);
      navigate(`/templates/${copy.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to duplicate the template');
    }
  }

  async function handleRename(template: TemplateSummary) {
    const newName = prompt('New template name:', template.name);
    if (!newName || !newName.trim() || newName === template.name) return;
    try {
      await templatesApi.update(template.id, { name: newName.trim() });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to rename the template');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Templates</h2>
        <Link className="btn" to="/templates/new">
          New template
        </Link>
      </div>

      <ErrorBanner message={error} />

      {templates === null ? (
        <p>Loading...</p>
      ) : (
        <ul className="list">
          {templates.map((template) => (
            <li key={template.id} className="list-item">
              <div>
                <div className="list-item-title">
                  {template.name} {template.isPredefined && <span className="badge">Predefined</span>}
                </div>
                <div className="list-item-subtitle">{template.description}</div>
              </div>
              <div className="btn-row">
                <Link className="btn secondary small" to={`/templates/${template.id}`}>
                  {template.isPredefined ? 'View' : 'Edit'}
                </Link>
                <button className="btn secondary small" disabled={template.isPredefined} onClick={() => handleRename(template)}>
                  Rename
                </button>
                <button className="btn secondary small" onClick={() => handleDuplicate(template.id)}>
                  Duplicate
                </button>
                <button className="btn danger small" disabled={template.isPredefined} onClick={() => handleDelete(template.id)}>
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
