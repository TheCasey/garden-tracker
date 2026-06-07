export const JUNE_6_2026_GARDEN_SNAPSHOT = '2026-06-06' as const;

export type ZoneId = 'ground-plot' | 'container-zone';
export type SunlightProfileId =
  | 'ground-plot-canopy'
  | 'downhill-high-sun-trellis'
  | 'container-zone-sun';
export type PlantStatus =
  | 'near-first-yield'
  | 'fruiting'
  | 'fruiting-and-blooming'
  | 'high-production'
  | 'blooming'
  | 'early-bloom'
  | 'vegetative'
  | 'seedling-vegetative'
  | 'stagnant'
  | 'companion-blooming';
export type PlantGrowthStage =
  | 'seedling'
  | 'vegetative'
  | 'blooming'
  | 'baby-set'
  | 'active-sizing'
  | 'ripening'
  | 'harvesting';
export type SupportType =
  | 'hybrid-metal-ring-cage'
  | 'heavy-bamboo-stakes'
  | 'bamboo-stakes'
  | 'white-accordion-lattice-trellis'
  | 'vertical-bamboo-poles'
  | 'center-bamboo-anchor'
  | 'bamboo-chicken-wire-trellis'
  | 'wooden-split-rail-stake'
  | 'protective-multi-planter'
  | 'fire-pit-moat-platform'
  | 'companion-planting';
export type GardenLogType =
  | 'observation'
  | 'harvest'
  | 'pollination'
  | 'transplant'
  | 'support'
  | 'watering';
export type BacklogTaskState = 'pending' | 'watching' | 'ready' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type WateringWarningState = 'ok' | 'due-soon' | 'due';
export type PollinationCountdownState = 'under-48h' | 'within-48h-to-72h' | 'over-72h';
export type ContainerDryoutRisk = 'normal' | 'accelerated';

export interface NumericRange {
  min: number;
  max: number;
  unit: 'count' | 'inches' | 'hours';
  display: string;
}

export interface HeightSegment {
  label: string;
  inches: number;
  display: string;
}

export interface HeightSnapshot {
  display: string;
  approximate: boolean;
  minInches: number;
  maxInches: number;
  segments?: readonly HeightSegment[];
  notes?: readonly string[];
}

export interface PlantSupport {
  type: SupportType;
  label: string;
  notes?: readonly string[];
}

export interface PlantCareRules {
  profile: string;
  source: 'deterministic-baseline';
  wateringIntervalDaysDrySeason: number;
  wateringIntervalDaysNormal: number;
  fertilizingIntervalWeeks: number;
  idealSoilMoistureDepthInches: number;
  daysToMaturityEstimate: number;
}

export interface PlantCurrentMetrics {
  totalHarvestCount: number;
  developingFruitCount?: number;
  developingFruitCountRange?: NumericRange;
  manuallyPollinatedFruitCount?: number;
  unopenedBudCountMinimum?: number;
  approachingBloomCount?: number;
  visibleBabyFruitSetCount?: number;
  vineLengthsInches?: readonly number[];
  plantedLateByMonths?: number;
  supportPrepared?: boolean;
  recentHarvestLengthInches?: number;
  recentHarvestStored?: boolean;
  recentHarvestCountRange?: NumericRange;
  companionFlowerColor?: string;
}

export interface GardenPlant {
  id: string;
  name: string;
  quantity: number;
  variety?: string;
  zoneId: ZoneId;
  sunlightProfileId: SunlightProfileId;
  plantingMedium: string;
  status: PlantStatus;
  growthStage: PlantGrowthStage;
  heights: HeightSnapshot;
  supports: readonly PlantSupport[];
  careRules: PlantCareRules;
  currentMetrics: PlantCurrentMetrics;
  notes: readonly string[];
}

export interface GardenLog {
  id: string;
  plantId: string;
  type: GardenLogType;
  occurredAt: string;
  metric: string;
  detail: string;
}

export interface OverheadCanopyContext {
  zoneId: 'ground-plot';
  birdDroppingCoverage: 'heavy';
  fertilizerEffect: string;
  hygieneNotice: string;
  notes: readonly string[];
}

export interface SunlightProfile {
  id: SunlightProfileId;
  label: string;
  hours: NumericRange;
  shadeStartsAt?: string;
  notes: readonly string[];
}

export interface GardenZone {
  id: ZoneId;
  label: string;
  plantingStyle: 'in-ground' | 'container';
  defaultSunlightProfileId: SunlightProfileId;
  dryoutRisk: ContainerDryoutRisk;
  notes: readonly string[];
}

export interface GardenBacklogTask {
  id: string;
  title: string;
  plantId?: string;
  priority: TaskPriority;
  state: BacklogTaskState;
  notes: readonly string[];
  triggerStage?: PlantGrowthStage;
}

export interface GardenSeedSnapshot {
  snapshotDate: typeof JUNE_6_2026_GARDEN_SNAPSHOT;
  location: string;
  zones: readonly GardenZone[];
  sunlightProfiles: readonly SunlightProfile[];
  overheadCanopy: OverheadCanopyContext;
  plants: readonly GardenPlant[];
  logs: readonly GardenLog[];
  backlogTasks: readonly GardenBacklogTask[];
}
