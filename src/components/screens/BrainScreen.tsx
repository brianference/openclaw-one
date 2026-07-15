import { useMemo, useState } from 'react'
import { addNote, toggleNotePin } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import type { NoteCategory } from '../../data/seed'
import { Icon, type IconName } from '../icons'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'

const CAT: Record<NoteCategory, { label: string; icon: IconName; color: string }> = {
  idea: { label: 'Idea', icon: 'idea', color: '#f59e0b' },
  note: { label: 'Note', icon: 'note', color: '#3b82f6' },
  todo: { label: 'Todo', icon: 'todo', color: '#22c55e' },
  research: { label: 'Research', icon: 'research', color: '#8b5cf6' },
}

const FILTERS: { id: NoteCategory | 'all'; label: string; icon: IconName }[] = [
  { id: 'all', label: 'All', icon: 'all' },
  { id: 'idea', label: 'Ideas', icon: 'idea' },
  { id: 'note', label: 'Notes', icon: 'note' },
  { id: 'todo', label: 'Todos', icon: 'todo' },
  { id: 'research', label: 'Research', icon: 'research' },
]

export function BrainScreen() {
  const s = useDemoStore()
  const { toast } = useToast()
  const [filter, setFilter] = useState<NoteCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<NoteCategory>('note')

  const list = useMemo(() => {
    const base = filter === 'all' ? s.notes : s.notes.filter((n) => n.category === filter)
    const q = query.trim().toLowerCase()
    const searched = q
      ? base.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.category.includes(q),
        )
      : base
    return [...searched].sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [s.notes, filter, query])

  function submit() {
    if (!title.trim()) return
    addNote(title, content, category)
    toast('Note saved')
    setTitle('')
    setContent('')
    setCategory('note')
    setOpen(false)
  }

  return (
    <div className="screen">
      <p className="large-title">Brain</p>
      <p className="sub">Second brain · local notes only</p>

      <div className="pad" style={{ marginBottom: 8 }}>
        <label className="visually-hidden" htmlFor="brain-search">
          Search notes
        </label>
        <input
          id="brain-search"
          className="search-input"
          type="search"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="chips" role="tablist" aria-label="Note categories">
        {FILTERS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`chip chip-ico${filter === id ? ' is-on' : ''}`}
            onClick={() => setFilter(id)}
          >
            <Icon name={icon} size={14} strokeWidth={filter === id ? 2.1 : 1.75} />
            {label}
          </button>
        ))}
      </div>

      <div className="stack">
        {list.length === 0 ? (
          <p className="empty">{query ? 'No notes match your search.' : 'No notes here.'}</p>
        ) : null}
        {list.map((note) => {
          const cat = CAT[note.category]
          return (
            <article
              key={note.id}
              className="item"
              style={{ borderLeftColor: cat.color, flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="chip chip-ico is-on" style={{ minHeight: 28, padding: '2px 8px' }}>
                  <Icon name={cat.icon} size={12} strokeWidth={2} />
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
              <button
                type="button"
                className="chip"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => {
                  toggleNotePin(note.id)
                  toast(note.pinned ? 'Unpinned' : 'Pinned')
                }}
              >
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
            </article>
          )
        })}
      </div>

      <div className="fab-wrap">
        <button type="button" className="btn" onClick={() => setOpen(true)}>
          + New note
        </button>
      </div>

      <Modal
        open={open}
        title="New note"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn" onClick={submit} disabled={!title.trim()}>
              Save note
            </button>
          </>
        }
      >
        <div className="field">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="note-cat">Category</label>
          <select
            id="note-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as NoteCategory)}
          >
            <option value="note">Note</option>
            <option value="idea">Idea</option>
            <option value="todo">Todo</option>
            <option value="research">Research</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="note-body">Content</label>
          <textarea
            id="note-body"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Details…"
          />
        </div>
      </Modal>
    </div>
  )
}
