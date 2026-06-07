import type {
  GardenLog,
  GardenPlant,
  PlantStatus,
  SunlightProfile,
  WateringWarningState,
} from '../domain';
import { assessContainerDryoutRisk, getNextWateringState, getPollinationCountdown } from '../lib/gardenRules';

export type DashboardTone = 'near' | 'fruit' | 'early' | 'stagnant';
export type StatPillTone = 'g' | 'a' | 'b';
export type AlertChipTone = 'w' | 'i' | 'd';
export type QuickActionId = 'water' | 'harvest' | 'log' | 'pollinate' | 'sun';
export type DryoutFillClass = 'lo' | 'mid' | 'hi';

export interface DashboardStatPillModel {
  label: string;
  tone: StatPillTone;
}

export interface DashboardQuickActionModel {
  id: QuickActionId;
  label: string;
  iconClass: string;
  done?: boolean;
  iconOnly?: boolean;
}

export interface DashboardAlertChipModel {
  tone: AlertChipTone;
  iconClass: string;
  text: string;
}

export interface ContainerDryoutModel {
  percentage: number;
  fillClass: DryoutFillClass;
  label: string;
  labelTone: 'default' | 'warn' | 'danger';
  wateringState: WateringWarningState;
}

const STATUS_TONE_MAP: Record<PlantStatus, DashboardTone> = {
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

const SNAPSHOT_NOW = '2026-06-06T18:00:00-05:00';

export function getDashboardTone(status: PlantStatus): DashboardTone {
  return STATUS_TONE_MAP[status];
}

export function formatHeightLabel(plant: Pick<GardenPlant, 'heights'>): string {
  const { minInches, maxInches } = plant.heights;

  if (maxInches >= 12) {
    const minFeet = roundHeight(minInches / 12);
    const maxFeet = roundHeight(maxInches / 12);
    return minFeet === maxFeet ? `${minFeet} ft` : `${minFeet}-${maxFeet} ft`;
  }

  return minInches === maxInches ? `${maxInches} in` : `${minInches}-${maxInches} in`;
}

function roundHeight(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

function titleCaseWords(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatusLabel(plant: Pick<GardenPlant, 'status' | 'growthStage'>): string {
  switch (plant.status) {
    case 'near-first-yield':
      return 'Near yield';
    case 'fruiting':
      return 'Fruiting';
    case 'fruiting-and-blooming':
      return 'Pollinating';
    case 'high-production':
      return 'High yield';
    case 'early-bloom':
      return 'Bloom';
    case 'seedling-vegetative':
      return 'Seedling';
    case 'companion-blooming':
      return 'Companion bloom';
    default:
      return titleCaseWords(plant.growthStage);
  }
}

export function getPlantCardPills(plant: GardenPlant): DashboardStatPillModel[] {
  switch (plant.id) {
    case 'cherry-tomatoes':
      return [
        { label: formatHeightLabel(plant), tone: 'g' },
        { label: 'Near yield', tone: 'a' },
      ];
    case 'brandywine-tomato':
      return [
        { label: formatHeightLabel(plant), tone: 'g' },
        { label: 'Fruiting', tone: 'g' },
      ];
    case 'beefsteak-tomato':
      return [
        { label: formatHeightLabel(plant), tone: 'g' },
        { label: `${plant.currentMetrics.developingFruitCount ?? 0} fruits`, tone: 'g' },
      ];
    case 'cucumbers':
      return [
        { label: 'Pollinating', tone: 'b' },
        { label: formatHeightLabel(plant), tone: 'g' },
      ];
    case 'squash':
      return [
        { label: 'Fruiting', tone: 'g' },
        { label: `${plant.currentMetrics.totalHarvestCount} harvested`, tone: 'a' },
      ];
    case 'green-bean-bush':
      return [
        { label: 'High yield', tone: 'g' },
        { label: `${plant.currentMetrics.totalHarvestCount} harvested`, tone: 'a' },
      ];
    default:
      return [{ label: formatStatusLabel(plant), tone: 'b' }];
  }
}

export function getPlantRowPills(plant: GardenPlant): DashboardStatPillModel[] {
  if (plant.zoneId === 'container-zone') {
    return [{ label: `${formatHeightLabel(plant)} · ${formatStatusLabel(plant)}`, tone: 'b' }];
  }

  return [{ label: formatStatusLabel(plant), tone: 'b' }];
}

export function getQuickActions(
  plant: GardenPlant,
  logs: readonly GardenLog[] = [],
): readonly DashboardQuickActionModel[] {
  const waterAction = (
    label: string,
    options?: Pick<DashboardQuickActionModel, 'iconOnly'>,
  ): DashboardQuickActionModel => {
    const wateredToday = isWateredToday(plant, logs);

    return {
      id: 'water',
      label: wateredToday ? 'Watered' : label,
      iconClass: 'ti ti-droplet',
      done: wateredToday,
      ...options,
    };
  };

  switch (plant.id) {
    case 'cherry-tomatoes':
      return [
        { ...waterAction('Watered'), done: true, label: 'Watered' },
        { id: 'harvest', label: 'Harvest', iconClass: 'ti ti-basket' },
      ];
    case 'brandywine-tomato':
    case 'beefsteak-tomato':
      return [
        waterAction('Water'),
        { id: 'log', label: 'Log', iconClass: 'ti ti-note' },
      ];
    case 'cucumbers':
      return [
        { id: 'pollinate', label: 'Pollinate', iconClass: 'ti ti-seeding' },
        waterAction('Water'),
      ];
    case 'squash':
      return [
        { id: 'pollinate', label: 'Pollinate', iconClass: 'ti ti-seeding' },
        { id: 'harvest', label: 'Harvest', iconClass: 'ti ti-basket' },
      ];
    case 'green-bean-bush':
      return [
        { id: 'harvest', label: 'Harvest', iconClass: 'ti ti-basket' },
        waterAction('Water'),
      ];
    case 'cantaloupe':
      return [
        waterAction('Log watering', { iconOnly: true }),
        { id: 'log', label: 'Add log entry', iconClass: 'ti ti-note', iconOnly: true },
      ];
    case 'black-tomato':
      return [
        { id: 'sun', label: 'Sun exposure note', iconClass: 'ti ti-sun', iconOnly: true },
        waterAction('Log watering', { iconOnly: true }),
      ];
    default:
      return [waterAction('Log watering', { iconOnly: true })];
  }
}

function isWateredToday(plant: GardenPlant, logs: readonly GardenLog[]): boolean {
  const latestWateringLog = getLatestLogByType(logs, plant.id, 'watering');
  const lastWateredAt = latestWateringLog?.occurredAt ?? plant.currentMetrics.lastWateredAt;

  if (!lastWateredAt) {
    return false;
  }

  const today = new Date();
  const wateredAt = new Date(lastWateredAt);

  return (
    today.getFullYear() === wateredAt.getFullYear() &&
    today.getMonth() === wateredAt.getMonth() &&
    today.getDate() === wateredAt.getDate()
  );
}

export function getPlantAlertChip(
  plant: GardenPlant,
  logs: readonly GardenLog[],
): DashboardAlertChipModel | null {
  if (plant.id === 'cherry-tomatoes') {
    return {
      tone: 'w',
      iconClass: 'ti ti-alert-triangle',
      text: 'Verify bamboo anchors - >5 ft',
    };
  }

  if (plant.id === 'brandywine-tomato') {
    return {
      tone: 'w',
      iconClass: 'ti ti-alert-triangle',
      text: 'T-post recommended',
    };
  }

  if (plant.id === 'cucumbers') {
    const latestPollination = getLatestLogByType(logs, plant.id, 'pollination');

    if (latestPollination) {
      const countdown = getPollinationCountdown(latestPollination.occurredAt, SNAPSHOT_NOW);
      return {
        tone: countdown.state === 'within-48h-to-72h' ? 'w' : countdown.state === 'over-72h' ? 'd' : 'i',
        iconClass: countdown.state === 'over-72h' ? 'ti ti-alert-triangle' : 'ti ti-clock',
        text:
          countdown.state === 'under-48h'
            ? '72-hr check armed - verify fruit set'
            : countdown.state === 'within-48h-to-72h'
              ? 'Check for fruit drop - 48 hrs post-pollination'
              : 'Fruit drop risk - assess fruit set now',
      };
    }

    return {
      tone: 'i',
      iconClass: 'ti ti-clock',
      text: `${plant.currentMetrics.manuallyPollinatedFruitCount ?? 0} tracked - ${plant.currentMetrics.unopenedBudCountMinimum ?? 0}+ buds pending`,
    };
  }

  if (plant.id === 'squash') {
    return {
      tone: 'i',
      iconClass: 'ti ti-leaf',
      text: plant.currentMetrics.developingFruitCountRange?.display ?? 'Baby fruits active',
    };
  }

  if (plant.id === 'marigolds') {
    return {
      tone: 'i',
      iconClass: 'ti ti-flower',
      text: `${plant.currentMetrics.companionFlowerColor ?? 'Companion'} companions active`,
    };
  }

  return null;
}

function getLatestLogByType(
  logs: readonly GardenLog[],
  plantId: string,
  type: GardenLog['type'],
): GardenLog | undefined {
  return logs
    .filter((log) => log.plantId === plantId && log.type === type)
    .sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt))[0];
}

export function getPlantRowSubtitle(
  plant: GardenPlant,
  sunlightProfiles: readonly SunlightProfile[],
): string {
  const sunlightProfile = sunlightProfiles.find((profile) => profile.id === plant.sunlightProfileId);
  const sunlightLabel = sunlightProfile?.hours.display.replace('hours', 'hr sun') ?? 'Sun tracked';

  if (plant.id === 'cantaloupe') {
    return `Blooming · ${sunlightLabel} · Awaiting fruit set`;
  }

  if (plant.id === 'marigolds') {
    return `Companion bloom · ${plant.currentMetrics.companionFlowerColor ?? 'color tracked'} · Tactical corners`;
  }

  if (plant.id === 'strawberry') {
    return 'Stagnant · Fire pit moat · Isolated';
  }

  return `${formatStatusLabel(plant)} · ${sunlightLabel}`;
}

export function getContainerDryoutModel(plant: GardenPlant, logs: readonly GardenLog[]): ContainerDryoutModel | null {
  if (plant.zoneId !== 'container-zone') {
    return null;
  }

  const dryoutRisk = assessContainerDryoutRisk(plant);
  const latestWateringLog = getLatestLogByType(logs, plant.id, 'watering');
  const lastWateredAt = latestWateringLog?.occurredAt ?? plant.currentMetrics.lastWateredAt;

  if (!lastWateredAt) {
    return null;
  }

  const intervalMs = dryoutRisk.acceleratedIntervalDays * 86_400_000;
  const elapsedMs = Date.parse(SNAPSHOT_NOW) - Date.parse(lastWateredAt);
  const percentage = Math.max(0, Math.min(100, Math.round((elapsedMs / intervalMs) * 100)));
  const wateringState = getNextWateringState({
    lastWateredAt,
    now: SNAPSHOT_NOW,
    wateringIntervalDays: dryoutRisk.acceleratedIntervalDays,
  }).state;

  if (percentage >= 85) {
    return {
      percentage,
      fillClass: 'hi',
      label: 'Water now',
      labelTone: 'danger',
      wateringState,
    };
  }

  if (percentage >= 60) {
    const hoursRemaining = Math.max(0, Math.round((intervalMs - elapsedMs) / 3_600_000));
    return {
      percentage,
      fillClass: 'mid',
      label: `~${hoursRemaining} hrs`,
      labelTone: 'warn',
      wateringState,
    };
  }

  return {
    percentage,
    fillClass: 'lo',
    label: 'Adequate',
    labelTone: 'default',
    wateringState,
  };
}
