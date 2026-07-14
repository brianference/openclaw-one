import { useMemo, useState } from 'react'
import { addTask, toggleTask } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'
import type { TaskCategory } from '../../data/seed'

const CAT_COLOR = { work: '#3b82f6', personal: '#22c55e', shopping: '#f59e0b' } as const

type Filter = 'all' | 'active' | 'completed'

export function TasksScreen() {
  const s = useDemoStore()
  const { toast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>('personal')

  const list = useMemo(() => {
    if (filter === 'active') return s.tasks.filter((t) => !t.completed)
    if (filter === 'completed') return s.tasks.filter((t) => t.completed)
    return s.tasks
  }, [s.tasks, filter])

  function submit() {
    if (!title.trim()) return
    addTask(title, category)
    toast('Task added')
    setTitle('')
    setCategory('personal')
    setOpen(false)
  }

  return (
    <div className="screen">
      <p className="large-title">Tasks</p>
      <p className="sub">{s.tasks.filter((t) => !t.completed).length} open · demo list</p>

      <div className="chips" role="tablist" aria-label="Task filters">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`chip${filter === f ? ' is-on' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>

      <div className="stack">
        {list.length === 0 ? <p className="empty">No tasks here.</p> : null}
        {list.map((task) => {
          const color = CAT_COLOR[task.category]
          const overdue =
            task.dueAt && !task.completed && new Date(task.dueAt).getTime() < Date.now()
          return (
            <div key={task.id} className="item" style={{ borderLeftColor: color }}>
              <button
                type="button"
                className={`check${task.completed ? ' on' : ''}`}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                onClick={() => {
                  toggleTask(task.id)
                  toast(task.completed ? 'Marked active' : 'Task completed')
                }}
                style={task.completed ? { background: color, borderColor: color } : undefined}
              >
                {task.completed ? '✓' : ''}
              </button>
              <div>
                <p className={task.completed ? 'strike' : ''} style={{ margin: 0, fontWeight: 600 }}>
                  {task.title}
                </p>
                <p className="muted" style={{ margin: '6px 0 0' }}>
                  {task.category}
                  {task.dueAt
                    ? ` · ${overdue ? 'Overdue' : new Date(task.dueAt).toLocaleDateString()}`
                    : ''}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="fab-wrap">
        <button type="button" className="btn" onClick={() => setOpen(true)}>
          + New task
        </button>
      </div>

      <Modal
        open={open}
        title="New task"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn" onClick={submit} disabled={!title.trim()}>
              Add task
            </button>
          </>
        }
      >
        <div className="field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="task-cat">Category</label>
          <select
            id="task-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>
      </Modal>
    </div>
  )
}
