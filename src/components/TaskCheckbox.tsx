import type { GardenBacklogTask } from '../domain';

const PRIORITY_LABELS: Record<GardenBacklogTask['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const STATE_LABELS: Record<GardenBacklogTask['state'], string> = {
  pending: 'Pending',
  watching: 'Watching',
  ready: 'Ready',
  done: 'Done',
};

export function TaskCheckbox({
  task,
  onToggle,
}: {
  task: GardenBacklogTask;
  onToggle: () => void;
}) {
  const checkboxId = `task-checkbox-${task.id}`;

  return (
    <article className="task-item" data-testid={`task-item-${task.id}`} data-state={task.state}>
      <label className="task-check" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={task.state === 'done'}
          onChange={onToggle}
          data-testid={`task-checkbox-${task.id}`}
        />
        <span className="task-copy">
          <span className="task-title">{task.title}</span>
          <span className="task-meta">
            {PRIORITY_LABELS[task.priority]} priority · {STATE_LABELS[task.state]}
          </span>
        </span>
      </label>
      {task.notes.length ? <p className="task-note">{task.notes[0]}</p> : null}
    </article>
  );
}
