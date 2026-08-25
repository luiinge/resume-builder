import { useState } from 'react';
import type { ReactNode } from 'react';
import { EntryList } from '../EntryList';
import { ApiError } from '../../api/client';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'url';
  required?: boolean;
}

// Los campos de fecha solo piden mes/año (input type="month", formato YYYY-MM).
function toMonthInputValue(value: string): string {
  return value.slice(0, 7);
}

type EntryValues = Record<string, string>;
export interface EntryItem {
  id: string;
  [key: string]: unknown;
}

interface Props {
  title: string;
  items: EntryItem[];
  fields: FieldDef[];
  renderSummary: (item: EntryItem) => ReactNode;
  onAdd: (data: EntryValues) => Promise<unknown>;
  onUpdate: (id: string, data: EntryValues) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
  onReorder: (orderedIds: string[]) => Promise<unknown>;
  onChange: () => void;
}

function emptyValues(fields: FieldDef[]): EntryValues {
  return Object.fromEntries(fields.map((f) => [f.key, '']));
}

function toApiPayload(values: EntryValues, fields: FieldDef[]): EntryValues {
  const payload: EntryValues = {};
  for (const field of fields) {
    const value = values[field.key];
    if (value) {
      payload[field.key] = field.type === 'date' ? new Date(`${value}-01`).toISOString() : value;
    }
  }
  return payload;
}

export function DetailedEntrySection({ title, items, fields, renderSummary, onAdd, onUpdate, onRemove, onReorder, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [values, setValues] = useState<EntryValues>(emptyValues(fields));
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setEditingId('new');
    setValues(emptyValues(fields));
  }

  function startEdit(item: EntryItem) {
    setEditingId(item.id);
    const next = emptyValues(fields);
    for (const field of fields) {
      const raw = item[field.key];
      const strValue = typeof raw === 'string' ? raw : '';
      next[field.key] = field.type === 'date' && strValue ? toMonthInputValue(strValue) : strValue;
    }
    setValues(next);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const payload = toApiPayload(values, fields);
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

  async function handleDelete(item: EntryItem) {
    try {
      await onRemove(item.id);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  }

  async function handleMove(item: EntryItem, direction: 'up' | 'down') {
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
      <EntryList items={items} renderSummary={renderSummary} onEdit={startEdit} onDelete={handleDelete} onMove={handleMove} />
      {editingId ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <div className="field-row">
            {fields
              .filter((field) => field.type !== 'textarea')
              .map((field) => (
                <div className="field" key={field.key}>
                  <label htmlFor={`${title}-${field.key}`}>{field.label}</label>
                  <input
                    id={`${title}-${field.key}`}
                    type={field.type === 'date' ? 'month' : field.type === 'url' ? 'url' : 'text'}
                    value={values[field.key] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    required={field.required}
                  />
                </div>
              ))}
          </div>
          {fields
            .filter((field) => field.type === 'textarea')
            .map((field) => (
              <div className="field" key={field.key}>
                <label htmlFor={`${title}-${field.key}`}>{field.label}</label>
                <textarea
                  id={`${title}-${field.key}`}
                  className="textarea-large"
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  required={field.required}
                />
              </div>
            ))}
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
