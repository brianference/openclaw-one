import { useMemo, useState } from 'react'
import { addNote, toggleNotePin } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import type { NoteCategory } from '../../data/seed'

const CAT: Record<NoteCategory, { label: string; emoji: string; color: string }> = {
  idea: { label: 'Idea', emoji: '💡', color: '#f59e0b' },
  note: { label: 'Note', emoji: '📝', color: '#3b82f6' },
  todo: { label: 'Todo', emoji: '✅', color: '#22c55e' },
  research: { label: 'Research', emoji: '🔬', color: '#8b5cf6' },
}

export function BrainScreen() {
  const s = useDemoStore()
  const [filter, setFilter] = useState<NoteCategory | 'all'>('all')

  const list = useMemo(() => {
    const base = filter === 'all' ? s.notes : s.notes.filter((n) => n.category === filter)
    return [...base].sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [s.notes, filter])

  return (
    <div className="screen">
      <p className="large-title">Brain</p>
      <p className="sub">Second brain · local notes only</p>

      <div className="chips">
        {(
          [
            ['all', '🧠 All'],
            ['idea', '💡 Ideas'],
            ['note', '📝 Notes'],
            ['todo', '✅ Todos'],
            ['research', '🔬 Research'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip${filter === id ? ' is-on' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="stack">
        {list.map((note) => {
          const cat = CAT[note.category]
          return (
            <article key={note.id} className="item" style={{ borderLeftColor: cat.color, flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span>{cat.emoji}</span>
                <span className="chip is-on" style={{ minHeight: 28, padding: '2px 8px' }}>
                  {cat.label}
                </span>
                {note.pinned ? <span className="muted">Pinned</span> : null}
                <span className="muted" style={{ marginLeft: 'auto' }}>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ margin: '6px 0 0', fontSize: 15 }}>{note.title}</h3>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                {note.content}
              </p>
              <button type="button" className="chip" style={{ alignSelf: 'flex-start' }} onClick={() => toggleNotePin(note.id)}>
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
            </article>
          )
        })}
      </div>

      <div className="fab-wrap">
        <button
          type="button"
          className="btn"
          onClick={() => {
            const title = window.prompt('Note title')
            if (!title) return
            const content = window.prompt('Note content') || ''
            addNote(title, content, 'note')
          }}
        >
          + New note
        </button>
      </div>
    </div>
  )
}
