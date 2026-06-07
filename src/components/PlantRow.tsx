import type { KeyboardEvent } from 'react';
import { QuickActionButton } from './QuickActionButton';
import { StatPill } from './StatPill';
import type {
  DashboardQuickActionModel,
  DashboardStatPillModel,
  DashboardTone,
} from './dashboardModel';

function handleKeyboardOpen(event: KeyboardEvent<HTMLElement>, onOpen: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onOpen();
  }
}

export function PlantRow({
  plantId,
  name,
  subtitle,
  tone,
  selected,
  pills,
  quickActions,
  onOpen,
  onQuickAction,
}: {
  plantId: string;
  name: string;
  subtitle?: string;
  tone: DashboardTone;
  selected: boolean;
  pills: readonly DashboardStatPillModel[];
  quickActions: readonly DashboardQuickActionModel[];
  onOpen: () => void;
  onQuickAction?: (actionId: DashboardQuickActionModel['id']) => void;
}) {
  return (
    <article
      className={`prow prow-${tone}${selected ? ' is-selected' : ''}`}
      data-testid={`plant-row-${plantId}`}
      data-selected={selected ? 'true' : 'false'}
      aria-label={name}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => handleKeyboardOpen(event, onOpen)}
    >
      <div className="prow-content">
        <div className="pname">{name}</div>
        {subtitle ? <div className="prow-sub">{subtitle}</div> : null}
      </div>

      <div className="pills pills-inline">
        {pills.map((pill) => (
          <StatPill key={`${plantId}-${pill.label}`} {...pill} />
        ))}
      </div>

      <div className="prow-actions">
        {quickActions.map((action) => (
          <QuickActionButton
            key={`${plantId}-${action.id}`}
            action={action}
            plantId={plantId}
            onClick={(event) => {
              event.stopPropagation();
              onQuickAction?.(action.id);
            }}
          />
        ))}
      </div>
    </article>
  );
}
