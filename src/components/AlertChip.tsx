import type { DashboardAlertChipModel } from './dashboardModel';

export function AlertChip({ tone, iconClass, text }: DashboardAlertChipModel) {
  return (
    <div className={`chip chip-${tone}`}>
      <i className={iconClass} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
