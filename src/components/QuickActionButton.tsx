import type { MouseEventHandler } from 'react';
import type { DashboardQuickActionModel } from './dashboardModel';

export function QuickActionButton({
  action,
  plantId,
  onClick,
}: {
  action: DashboardQuickActionModel;
  plantId: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={`qa${action.done ? ' is-done' : ''}${action.iconOnly ? ' is-icon-only' : ''}`}
      aria-label={action.label}
      data-testid={`quick-action-${plantId}-${action.id}`}
      onClick={onClick}
    >
      <i className={action.iconClass} aria-hidden="true" />
      {action.iconOnly ? null : <span>{action.label}</span>}
    </button>
  );
}
