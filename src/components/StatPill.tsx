import type { DashboardStatPillModel } from './dashboardModel';

export function StatPill({ label, tone }: DashboardStatPillModel) {
  return <span className={`pill pill-${tone}`}>{label}</span>;
}
