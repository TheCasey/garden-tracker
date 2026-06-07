import { gardenSeedSnapshot } from '../data';
import type {
  GardenLog,
  GardenPlant,
  GardenZone,
  PlantStatus,
  SunlightProfile,
} from '../domain';

type DetailTone = 'near' | 'fruit' | 'early' | 'stagnant';

interface PlantMilestone {
  phase: string;
  tip: string;
  tone: DetailTone;
}

const STATUS_LABELS: Record<PlantStatus, string> = {
  'near-first-yield': 'Near yield',
  fruiting: 'Fruiting',
  'fruiting-and-blooming': 'Fruiting and blooming',
  'high-production': 'High production',
  blooming: 'Blooming',
  'early-bloom': 'Early bloom',
  vegetative: 'Vegetative',
  'seedling-vegetative': 'Seedling / vegetative',
  stagnant: 'Stagnant',
  'companion-blooming': 'Companion blooming',
};

const STATUS_TONE_MAP: Record<PlantStatus, DetailTone> = {
  'near-first-yield': 'near',
  fruiting: 'fruit',
  'fruiting-and-blooming': 'fruit',
  'high-production': 'fruit',
  blooming: 'early',
  'early-bloom': 'early',
  vegetative: 'early',
  'seedling-vegetative': 'early',
  stagnant: 'stagnant',
  'companion-blooming': 'early',
};

const FALLBACK_MILESTONES: readonly PlantMilestone[] = [
  {
    phase: 'Current cycle',
    tip: 'Keep the root zone consistent and use the existing notes as the baseline for this plant.',
    tone: 'early',
  },
  {
    phase: 'Next check',
    tip: 'Use the care metrics below as the deterministic cadence until later AI phases are added.',
    tone: 'fruit',
  },
  {
    phase: 'End of season',
    tip: 'Preserve harvest notes and support changes so the next phase can build routine logging on top.',
    tone: 'stagnant',
  },
];

const PLANT_MILESTONES: Partial<Record<string, readonly PlantMilestone[]>> = {
  'cherry-tomatoes': [
    {
      phase: 'Fruit set',
      tip: 'Avoid overhead watering now that fruit is sizing under the canopy drop zone. Keep splash off clusters.',
      tone: 'near',
    },
    {
      phase: 'Ripening',
      tip: 'Shift attention to support tension and fruit color changes at the base before the first red turn.',
      tone: 'fruit',
    },
    {
      phase: 'End of season',
      tip: 'Plan a final October cleanup and remove stressed vines before cool-weather decline starts.',
      tone: 'early',
    },
  ],
  strawberry: [
    {
      phase: 'Recovery',
      tip: 'Hold the isolation setup steady and avoid crowding the crown while the plant breaks stagnation.',
      tone: 'stagnant',
    },
    {
      phase: 'Vegetative push',
      tip: 'Watch for fresh center growth before increasing expectations for bloom or fruit production.',
      tone: 'early',
    },
    {
      phase: 'Container reset',
      tip: 'If growth stays flat through the season, flag this plant for a later container and soil reset.',
      tone: 'fruit',
    },
  ],
};

function formatStatus(status: PlantStatus): string {
  return STATUS_LABELS[status];
}

function formatDate(occurredAt: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(occurredAt));
}

function formatIntervalUnit(value: number, singular: string, plural: string): string {
  return value === 1 ? singular : plural;
}

function getSunlightSummary(
  plant: GardenPlant,
  sunlightProfiles: readonly SunlightProfile[],
): string | null {
  const sunlightProfile = sunlightProfiles.find((profile) => profile.id === plant.sunlightProfileId);
  if (!sunlightProfile) {
    return null;
  }

  return `${sunlightProfile.hours.display} sun`;
}

function getPlantMilestones(plant: GardenPlant): readonly PlantMilestone[] {
  return PLANT_MILESTONES[plant.id] ?? FALLBACK_MILESTONES;
}

function getMilestoneToneClass(tone: DetailTone): string {
  return `milestone-dot milestone-dot-${tone}`;
}

export function PlantDetail({
  plant,
  zones,
  sunlightProfiles,
  logs,
  onBack,
}: {
  plant: GardenPlant | null;
  zones: readonly GardenZone[];
  sunlightProfiles: readonly SunlightProfile[];
  logs: readonly GardenLog[];
  onBack: () => void;
}) {
  if (!plant) {
    return (
      <section className="placeholder-band">
        <p className="placeholder-copy">No plant selected.</p>
      </section>
    );
  }

  const zone = zones.find((item) => item.id === plant.zoneId);
  const plantLogs = logs
    .filter((entry) => entry.plantId === plant.id)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const sunlightSummary = getSunlightSummary(plant, sunlightProfiles);
  const statusToneClass = `status-accent status-accent-${STATUS_TONE_MAP[plant.status]}`;
  const subtitleParts = [
    zone?.label ?? 'Garden',
    plant.heights.display.replace('~', ''),
    formatStatus(plant.status),
    `x${plant.quantity}`,
  ];

  return (
    <div className="plant-detail-view" data-testid="plant-detail-view">
      <section className="plant-detail-card" aria-labelledby="plant-detail-name">
        <div className="plant-detail-header">
          <button
            type="button"
            className="plant-detail-back"
            aria-label="Back to dashboard"
            onClick={onBack}
          >
            <i className="ti ti-arrow-left" aria-hidden="true" />
          </button>

          <div className="plant-detail-heading">
            <div className="plant-detail-title-row">
              <div>
                <h2 id="plant-detail-name" className="plant-detail-name">
                  {plant.name}
                </h2>
                <p className="plant-detail-subtitle" data-testid="plant-detail-subtitle">
                  {subtitleParts.join(' · ')}
                </p>
              </div>
              <span className={statusToneClass}>{formatStatus(plant.status)}</span>
            </div>

            <div className="plant-detail-meta-list">
              <div className="plant-detail-meta">
                <span className="plant-detail-meta-label">Zone</span>
                <span>{zone?.label ?? 'Garden'}</span>
              </div>
              <div className="plant-detail-meta">
                <span className="plant-detail-meta-label">Height</span>
                <span>{plant.heights.display.replace('~', '')}</span>
              </div>
              <div className="plant-detail-meta">
                <span className="plant-detail-meta-label">Quantity</span>
                <span>{plant.quantity}</span>
              </div>
              {sunlightSummary ? (
                <div className="plant-detail-meta">
                  <span className="plant-detail-meta-label">Sun</span>
                  <span>{sunlightSummary}</span>
                </div>
              ) : null}
            </div>

            {plant.supports.length ? (
              <div className="detail-chip-list" aria-label="Supports">
                {plant.supports.map((support) => (
                  <span key={`${plant.id}-${support.type}`} className="detail-chip">
                    {support.label}
                  </span>
                ))}
              </div>
            ) : null}

            {plant.notes.length ? (
              <ul className="detail-note-list">
                {plant.notes.map((note) => (
                  <li key={`${plant.id}-${note}`}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="care-grid" aria-labelledby="care-grid-heading">
        <div className="panel-heading">
          <h3 id="care-grid-heading">Care metrics</h3>
        </div>
        <div className="care-row care-row-three">
          <div className="care-cell">
            <div className="care-label">Water (normal)</div>
            <div className="care-value" data-testid="care-normal-watering">
              {plant.careRules.wateringIntervalDaysNormal}{' '}
              <span className="care-unit">
                {formatIntervalUnit(plant.careRules.wateringIntervalDaysNormal, 'day', 'days')}
              </span>
            </div>
          </div>
          <div className="care-cell">
            <div className="care-label">Water (dry)</div>
            <div className="care-value" data-testid="care-dry-watering">
              {plant.careRules.wateringIntervalDaysDrySeason}{' '}
              <span className="care-unit">
                {formatIntervalUnit(plant.careRules.wateringIntervalDaysDrySeason, 'day', 'days')}
              </span>
            </div>
          </div>
          <div className="care-cell">
            <div className="care-label">Fertilize</div>
            <div className="care-value" data-testid="care-fertilizing">
              {plant.careRules.fertilizingIntervalWeeks}{' '}
              <span className="care-unit">
                {formatIntervalUnit(plant.careRules.fertilizingIntervalWeeks, 'wk', 'wks')}
              </span>
            </div>
          </div>
        </div>
        <div className="care-row care-row-two">
          <div className="care-cell">
            <div className="care-label">Moisture depth</div>
            <div className="care-value" data-testid="care-moisture-depth">
              {plant.careRules.idealSoilMoistureDepthInches} <span className="care-unit">in</span>
            </div>
          </div>
          <div className="care-cell">
            <div className="care-label">Days to maturity</div>
            <div className="care-value" data-testid="care-days-to-maturity">
              {plant.careRules.daysToMaturityEstimate} <span className="care-unit">days</span>
            </div>
          </div>
        </div>
      </section>

      <section className="milestone-panel" aria-labelledby="milestone-heading">
        <div className="panel-heading panel-heading-mono">
          <h3 id="milestone-heading">AI milestones</h3>
        </div>
        <div className="milestone-list">
          {getPlantMilestones(plant).map((milestone) => (
            <article key={`${plant.id}-${milestone.phase}`} className="milestone-item">
              <span className={getMilestoneToneClass(milestone.tone)} aria-hidden="true" />
              <div>
                <p className="milestone-copy">{milestone.tip}</p>
                <p className="milestone-phase">{milestone.phase}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="log-summary-panel" aria-labelledby="log-summary-heading">
        <div className="panel-heading">
          <h3 id="log-summary-heading">Plant log summary</h3>
          <span className="inline-badge">{plantLogs.length} entries</span>
        </div>
        {plantLogs.length ? (
          <div className="log-summary-list">
            {plantLogs.map((entry) => (
              <article key={entry.id} className="log-summary-item">
                <div className="log-summary-topline">
                  <span className="log-summary-type">{entry.type}</span>
                  <span className="log-summary-date">{formatDate(entry.occurredAt)}</span>
                </div>
                <p className="log-summary-metric">{entry.metric}</p>
                <p className="log-summary-detail">{entry.detail}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="placeholder-copy">
            No log entries are in the June 6 snapshot for this plant yet.
          </p>
        )}
      </section>

      <section className="plant-detail-context" aria-labelledby="context-heading">
        <div className="panel-heading">
          <h3 id="context-heading">Snapshot context</h3>
        </div>
        <p className="placeholder-copy">
          Source snapshot: {gardenSeedSnapshot.snapshotDate} · {gardenSeedSnapshot.location} ·{' '}
          {zone?.plantingStyle === 'container' ? 'container monitoring' : 'ground-plot canopy care'}.
        </p>
      </section>
    </div>
  );
}
