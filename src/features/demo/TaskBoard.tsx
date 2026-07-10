import { DEMO } from '../../data/demo'

const COLS = ['todo', 'doing', 'done'] as const

export function TaskBoard() {
  return (
    <div className="kanban">
      {COLS.map((col) => (
        <div key={col} className="kanban-col">
          <h3>{col}</h3>
          {DEMO.tasks
            .filter((task) => task.col === col)
            .map((task) => (
              <div key={task.id} className="card card-slim">
                {task.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
