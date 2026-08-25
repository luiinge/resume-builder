import { useState } from 'react';
import { EntryList } from '../EntryList';
import { ApiError } from '../../api/client';

interface NameLevelItem {
  id: string;
  name: string;
  level?: string | number;
  description?: string;
  order: number;
}

interface LevelOption {
  value: string;
  label: string;
}

interface Props {
  title: string;
  items: NameLevelItem[];
  levelOptions?: LevelOption[];
  withDescription?: boolean;
  onAdd: (data: { name: string; level?: string; description?: string }) => Promise<unknown>;
  onUpdate: (id: string, data: { name: string; level?: string; description?: string }) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
  onReorder: (orderedIds: string[]) => Promise<unknown>;
  onChange: () => void;
}

export function SimpleNameLevelSection({
  title,
  items,
  levelOptions,
  withDescription,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  onChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  function levelLabel(value: string | number | undefined): string {
    if (value === undefined || value === '') return '';
    if (!levelOptions) return String(value);
    return levelOptions.find((option) => option.value === String(value))?.label ?? String(value);
  }

  function startNew() {
    setEditingId('new');
    setName('');
    setLevel('');
    setDescription('');
  }

  function startEdit(item: NameLevelItem) {
    setEditingId(item.id);
    setName(item.name);
    setLevel(item.level !== undefined ? String(item.level) : '');
    setDescription(item.description ?? '');
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const payload = { name, level: level || undefined, description: withDescription ? description || undefined : undefined };
      if (editingId === 'new') {
        await onAdd(payload);
      } else if (editingId) {
        await onUpdate(editingId, payload);
      }
      setEditingId(null);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save');
    }
  }

  async function handleDelete(item: NameLevelItem) {
    try {
      await onRemove(item.id);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  }

  async function handleMove(item: NameLevelItem, direction: 'up' | 'down') {
    const index = items.findIndex((i) => i.id === item.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    try {
      await onReorder(reordered.map((i) => i.id));
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to reorder');
    }
  }

  return (
    <div className="section-block">
      <h3>{title}</h3>
      {error && <div className="error-banner">{error}</div>}
      <EntryList
        items={items}
        renderSummary={(item) => (
          <span>
            <strong>{item.name}</strong>
            {item.level !== undefined ? ` — ${levelLabel(item.level)}` : ''}
            {item.description ? <div className="list-item-subtitle">{item.description}</div> : null}
          </span>
        )}
        onEdit={startEdit}
        onDelete={handleDelete}
        onMove={handleMove}
      />
      {editingId ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <div className="field-row">
            <div className="field">
              <label htmlFor={`${title}-name`}>Name</label>
              <input id={`${title}-name`} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor={`${title}-level`}>Level</label>
              {levelOptions ? (
                <select id={`${title}-level`} value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">Not specified</option>
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input id={`${title}-level`} value={level} onChange={(e) => setLevel(e.target.value)} />
              )}
            </div>
          </div>
          {withDescription && (
            <div className="field">
              <label htmlFor={`${title}-description`}>Description</label>
              <textarea
                id={`${title}-description`}
                className="textarea-large"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}
          <div className="btn-row">
            <button className="btn small" type="submit">
              Save
            </button>
            <button className="btn secondary small" type="button" onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn secondary small" onClick={startNew}>
          + Add
        </button>
      )}
    </div>
  );
}
