import type { ReactNode } from 'react';

interface EntryListProps<T extends { id: string }> {
  items: T[];
  renderSummary: (item: T) => ReactNode;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onMove: (item: T, direction: 'up' | 'down') => void;
}

export function EntryList<T extends { id: string }>({ items, renderSummary, onEdit, onDelete, onMove }: EntryListProps<T>) {
  if (items.length === 0) {
    return <p className="list-item-subtitle">No entries yet.</p>;
  }
  return (
    <div>
      {items.map((item, index) => (
        <div className="entry-item" key={item.id}>
          <div className="entry-item-header">
            <div>{renderSummary(item)}</div>
            <div className="btn-row">
              <button className="btn secondary small" disabled={index === 0} onClick={() => onMove(item, 'up')}>
                ↑
              </button>
              <button className="btn secondary small" disabled={index === items.length - 1} onClick={() => onMove(item, 'down')}>
                ↓
              </button>
              <button className="btn secondary small" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button className="btn danger small" onClick={() => onDelete(item)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
