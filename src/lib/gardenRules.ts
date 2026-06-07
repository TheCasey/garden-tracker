import type {
  BacklogTaskState,
  GardenBacklogTask,
  GardenLog,
  GardenPlant,
  GardenSeedSnapshot,
  PlantGrowthStage,
  PollinationCountdownState,
  WateringWarningState,
} from '../domain';

const DAY_IN_MS = 86_400_000;
const POLLINATION_WINDOW_48_HOURS = 48 * 60 * 60 * 1000;
const POLLINATION_WINDOW_72_HOURS = 72 * 60 * 60 * 1000;
const TOMATO_STAKING_WARNING_THRESHOLD_INCHES = 60;

type TimeInput = Date | string | number;

export interface NextWateringStateInput {
  lastWateredAt: TimeInput;
  now: TimeInput;
  wateringIntervalDays: number;
  warningWindowMs?: number;
}

export interface NextWateringState {
  nextWaterAt: string;
  state: WateringWarningState;
  msUntilDue: number;
}

export interface ContainerDryoutAssessment {
  accelerated: boolean;
  acceleratedIntervalDays: number;
  reductionDays: number;
  risk: 'normal' | 'elevated';
}

export interface TomatoStakingWarning {
  shouldWarn: boolean;
  thresholdInches: number;
  currentMaxInches: number;
  state: BacklogTaskState;
}

export interface PollinationCountdown {
  state: PollinationCountdownState;
  hoursSincePollination: number;
}

export interface HarvestUpdate {
  plantId: string;
  harvestedCount: number;
  occurredAt: string;
  detail: string;
  metric: string;
}

function toTimestamp(input: TimeInput): number {
  const timestamp = input instanceof Date ? input.getTime() : new Date(input).getTime();

  if (Number.isNaN(timestamp)) {
    throw new TypeError(`Invalid time input: ${String(input)}`);
  }

  return timestamp;
}

function assertPositiveIntervalDays(value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError('wateringIntervalDays must be greater than 0.');
  }
}

export function getNextWateringState({
  lastWateredAt,
  now,
  wateringIntervalDays,
  warningWindowMs = DAY_IN_MS,
}: NextWateringStateInput): NextWateringState {
  assertPositiveIntervalDays(wateringIntervalDays);

  const lastWateredAtMs = toTimestamp(lastWateredAt);
  const nowMs = toTimestamp(now);
  const nextWaterAtMs = lastWateredAtMs + wateringIntervalDays * DAY_IN_MS;
  const msUntilDue = nextWaterAtMs - nowMs;

  let state: WateringWarningState = 'ok';

  if (msUntilDue <= 0) {
    state = 'due';
  } else if (msUntilDue <= warningWindowMs) {
    state = 'due-soon';
  }

  return {
    nextWaterAt: new Date(nextWaterAtMs).toISOString(),
    state,
    msUntilDue,
  };
}

export function assessContainerDryoutRisk(
  plant: Pick<GardenPlant, 'zoneId' | 'careRules'>,
): ContainerDryoutAssessment {
  const accelerated = plant.zoneId === 'container-zone';
  const reductionDays = accelerated ? 1 : 0;
  const acceleratedIntervalDays = accelerated
    ? Math.max(1, plant.careRules.wateringIntervalDaysNormal - reductionDays)
    : plant.careRules.wateringIntervalDaysNormal;

  return {
    accelerated,
    acceleratedIntervalDays,
    reductionDays,
    risk: accelerated ? 'elevated' : 'normal',
  };
}

export function getTomatoStakingWarning(
  plant: Pick<GardenPlant, 'name' | 'heights'>,
): TomatoStakingWarning {
  const shouldWarn =
    plant.name.toLowerCase().includes('tomato') &&
    plant.heights.maxInches >= TOMATO_STAKING_WARNING_THRESHOLD_INCHES;

  return {
    shouldWarn,
    thresholdInches: TOMATO_STAKING_WARNING_THRESHOLD_INCHES,
    currentMaxInches: plant.heights.maxInches,
    state: shouldWarn ? 'ready' : 'watching',
  };
}

export function getPollinationCountdown(
  pollinatedAt: TimeInput,
  now: TimeInput,
): PollinationCountdown {
  const elapsedMs = toTimestamp(now) - toTimestamp(pollinatedAt);
  const hoursSincePollination = elapsedMs / (60 * 60 * 1000);

  if (elapsedMs < POLLINATION_WINDOW_48_HOURS) {
    return { state: 'under-48h', hoursSincePollination };
  }

  if (elapsedMs <= POLLINATION_WINDOW_72_HOURS) {
    return { state: 'within-48h-to-72h', hoursSincePollination };
  }

  return { state: 'over-72h', hoursSincePollination };
}

export function applyHarvestTally(
  snapshot: GardenSeedSnapshot,
  update: HarvestUpdate,
): GardenSeedSnapshot {
  const targetPlant = snapshot.plants.find((plant) => plant.id === update.plantId);

  if (!targetPlant) {
    throw new Error(`Unknown plant id: ${update.plantId}`);
  }

  const updatedPlants = snapshot.plants.map((plant) =>
    plant.id === update.plantId
      ? {
          ...plant,
          currentMetrics: {
            ...plant.currentMetrics,
            totalHarvestCount: plant.currentMetrics.totalHarvestCount + update.harvestedCount,
          },
        }
      : plant,
  );

  const newLog: GardenLog = {
    id: `harvest-${update.plantId}-${update.occurredAt}`,
    plantId: update.plantId,
    type: 'harvest',
    occurredAt: update.occurredAt,
    metric: update.metric,
    detail: update.detail,
  };

  return {
    ...snapshot,
    plants: updatedPlants,
    logs: [...snapshot.logs, newLog],
  };
}

export function updateCantaloupeHammockTaskState(
  tasks: readonly GardenBacklogTask[],
  previousStage: PlantGrowthStage,
  nextStage: PlantGrowthStage,
): readonly GardenBacklogTask[] {
  if (!(previousStage === 'baby-set' && nextStage === 'active-sizing')) {
    return tasks;
  }

  return tasks.map((task) =>
    task.id === 'cantaloupe-hammock-support'
      ? {
          ...task,
          state: 'ready',
          notes: [...task.notes, 'Promoted to ready after fruit entered Active Sizing.'],
        }
      : task,
  );
}
