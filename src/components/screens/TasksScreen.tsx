import { useMemo, useState } from 'react'
import { addTask, toggleTask } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'

const CAT_COLOR = { work: '#3b82f6', personal: '#22c55e', shopping: '#f59e0b' } as const

type Filter = 'all' | 'active' | 'completed'

export function TasksScreen() {
  const s = useDemoStore()
  const [filter, setFilter] = useState<Filter>('all')

  const list = useMemo(() => {
    if (filter === 'active') return s.tasks.filter((t) => !t.completed)
    if (filter === 'completed') return s.tasks.filter((t) => t.completed)
    return s.tasks
  }, [s.tasks, filter])

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
                onClick={() => toggleTask(task.id)}
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
        <button
          type="button"
          className="btn"
          onClick={() => {
            const title = window.prompt('New task')
            if (title) addTask(title)
          }}
        >
          + New task
        </button>
      </div>
    </div>
  )
}
