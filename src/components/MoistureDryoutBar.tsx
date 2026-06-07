import type { ContainerDryoutModel } from './dashboardModel';

export function MoistureDryoutBar({
  plantId,
  dryout,
}: {
  plantId: string;
  dryout: ContainerDryoutModel;
}) {
  return (
    <div
      className="dryrow"
      data-testid={`moisture-bar-${plantId}`}
      data-dryout-state={dryout.fillClass}
    >
      <span className="dry-lbl">Moisture</span>
      <div
        className="dry-track"
        role="progressbar"
        aria-label={`Moisture level ${dryout.percentage}%`}
        aria-valuenow={dryout.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`dry-fill dry-fill-${dryout.fillClass}`}
          style={{ width: `${dryout.percentage}%` }}
        />
      </div>
      <span className={`dry-lbl dry-lbl-${dryout.labelTone}`}>{dryout.label}</span>
    </div>
  );
}
