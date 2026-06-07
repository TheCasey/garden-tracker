import type { KeyboardEvent } from 'react';
import { AlertChip } from './AlertChip';
import { QuickActionButton } from './QuickActionButton';
import { StatPill } from './StatPill';
import type {
  DashboardAlertChipModel,
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

export function PlantCard({
  plantId,
  name,
  quantity,
  tone,
  selected,
  pills,
  quickActions,
  alertChip,
  onOpen,
  onQuickAction,
}: {
  plantId: string;
  name: string;
  quantity?: number;
  tone: DashboardTone;
  selected: boolean;
  pills: readonly DashboardStatPillModel[];
  quickActions: readonly DashboardQuickActionModel[];
  alertChip?: DashboardAlertChipModel | null;
  onOpen: () => void;
  onQuickAction?: (actionId: DashboardQuickActionModel['id']) => void;
}) {
  return (
    <article
      className={`pcard pcard-${tone}${selected ? ' is-selected' : ''}`}
      data-testid={`plant-card-${plantId}`}
      data-selected={selected ? 'true' : 'false'}
      aria-label={name}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => handleKeyboardOpen(event, onOpen)}
    >
      <div className="card-top">
        <div className="pname">{name}</div>
        {quantity ? <div className="qty">x{quantity}</div> : null}
      </div>

      <div className="pills">
        {pills.map((pill) => (
          <StatPill key={`${plantId}-${pill.label}`} {...pill} />
        ))}
      </div>

      <div className="qas">
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

      {alertChip ? <AlertChip {...alertChip} /> : null}
    </article>
  );
}
