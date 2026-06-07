import {
  JUNE_6_2026_GARDEN_SNAPSHOT,
  type GardenBacklogTask,
  type GardenLog,
  type GardenPlant,
  type GardenSeedSnapshot,
  type GardenZone,
  type PlantCareRules,
  type SunlightProfile,
} from '../domain';

const feet = (value: number) => value * 12;

const tomatoCareRules: PlantCareRules = {
  profile: 'tomato-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 1,
  wateringIntervalDaysNormal: 2,
  fertilizingIntervalWeeks: 2,
  idealSoilMoistureDepthInches: 2,
  daysToMaturityEstimate: 80,
};

const cucumberCareRules: PlantCareRules = {
  profile: 'cucumber-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 1,
  wateringIntervalDaysNormal: 2,
  fertilizingIntervalWeeks: 2,
  idealSoilMoistureDepthInches: 2,
  daysToMaturityEstimate: 60,
};

const squashCareRules: PlantCareRules = {
  profile: 'squash-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 1,
  wateringIntervalDaysNormal: 2,
  fertilizingIntervalWeeks: 2,
  idealSoilMoistureDepthInches: 2,
  daysToMaturityEstimate: 55,
};

const beanCareRules: PlantCareRules = {
  profile: 'bean-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 2,
  wateringIntervalDaysNormal: 3,
  fertilizingIntervalWeeks: 3,
  idealSoilMoistureDepthInches: 1,
  daysToMaturityEstimate: 55,
};

const melonCareRules: PlantCareRules = {
  profile: 'melon-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 1,
  wateringIntervalDaysNormal: 2,
  fertilizingIntervalWeeks: 2,
  idealSoilMoistureDepthInches: 2,
  daysToMaturityEstimate: 90,
};

const flowerCareRules: PlantCareRules = {
  profile: 'flower-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 2,
  wateringIntervalDaysNormal: 3,
  fertilizingIntervalWeeks: 4,
  idealSoilMoistureDepthInches: 1,
  daysToMaturityEstimate: 45,
};

const berryCareRules: PlantCareRules = {
  profile: 'berry-baseline',
  source: 'deterministic-baseline',
  wateringIntervalDaysDrySeason: 1,
  wateringIntervalDaysNormal: 2,
  fertilizingIntervalWeeks: 3,
  idealSoilMoistureDepthInches: 1,
  daysToMaturityEstimate: 75,
};

const seedSunlightProfiles: readonly SunlightProfile[] = [
  {
    id: 'ground-plot-canopy',
    label: 'Ground Plot canopy profile',
    hours: { min: 6, max: 7, unit: 'hours', display: '6-7 hours' },
    shadeStartsAt: '13:00',
    notes: [
      'Intense morning-to-midday sun before the overhanging tree takes over.',
      'Bird-dropping coverage is persistent across ground-plot leaves and soil.',
    ],
  },
  {
    id: 'downhill-high-sun-trellis',
    label: 'Downhill trellis high-sun exception',
    hours: { min: 8, max: 10, unit: 'hours', display: '8-10 hours' },
    notes: ['Uninterrupted sun exposure reserved for the downhill cantaloupe trellis section.'],
  },
  {
    id: 'container-zone-sun',
    label: 'Container zone sun profile',
    hours: { min: 6, max: 7, unit: 'hours', display: '6-7 hours' },
    notes: ['Container assets dry out faster and need accelerated watering awareness.'],
  },
];

const seedZones: readonly GardenZone[] = [
  {
    id: 'ground-plot',
    label: 'Ground Plot',
    plantingStyle: 'in-ground',
    defaultSunlightProfileId: 'ground-plot-canopy',
    dryoutRisk: 'normal',
    notes: ['Primary in-ground production bed.', 'Covered by the overhead canopy hygiene alert.'],
  },
  {
    id: 'container-zone',
    label: 'Container Zone',
    plantingStyle: 'container',
    defaultSunlightProfileId: 'container-zone-sun',
    dryoutRisk: 'accelerated',
    notes: ['All potted assets live here for the fixed prototype snapshot.'],
  },
];

const seedPlants: readonly GardenPlant[] = [
  {
    id: 'cherry-tomatoes',
    name: 'Cherry Tomatoes',
    quantity: 2,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'near-first-yield',
    growthStage: 'ripening',
    heights: {
      display: '~6 ft',
      approximate: true,
      minInches: feet(6),
      maxInches: feet(6),
      notes: ['Dual main split veins.'],
    },
    supports: [
      { type: 'hybrid-metal-ring-cage', label: 'Hybrid metal ring cage' },
      { type: 'heavy-bamboo-stakes', label: 'Heavy bamboo stakes' },
    ],
    careRules: tomatoCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      supportPrepared: true,
    },
    notes: [
      'Fruit at the base is fully sized and waiting to turn red.',
      'Heavily clustered with green fruit.',
      'Under the intense bird-dropping drop zone.',
    ],
  },
  {
    id: 'brandywine-tomato',
    name: 'Brandywine Tomato',
    quantity: 1,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'fruiting',
    growthStage: 'baby-set',
    heights: {
      display: '~5 ft',
      approximate: true,
      minInches: feet(5),
      maxInches: feet(5),
      notes: ['Dual main split veins.'],
    },
    supports: [{ type: 'bamboo-stakes', label: 'Bamboo stakes' }],
    careRules: tomatoCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
    },
    notes: ['Several small fruit clusters are present and far from mature size.'],
  },
  {
    id: 'beefsteak-tomato',
    name: 'Beefsteak Tomato',
    quantity: 1,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'fruiting',
    growthStage: 'baby-set',
    heights: {
      display: '~4-4.5 ft',
      approximate: true,
      minInches: feet(4),
      maxInches: feet(4.5),
    },
    supports: [{ type: 'bamboo-stakes', label: 'Bamboo stakes' }],
    careRules: tomatoCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      developingFruitCount: 2,
    },
    notes: ['Exactly 2 tomatoes are developing steadily.'],
  },
  {
    id: 'cucumbers',
    name: 'Cucumbers',
    quantity: 2,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'fruiting-and-blooming',
    growthStage: 'baby-set',
    heights: {
      display: '~5 ft climbing vines',
      approximate: true,
      minInches: feet(5),
      maxInches: feet(5),
    },
    supports: [
      { type: 'white-accordion-lattice-trellis', label: 'White accordion lattice trellis' },
      { type: 'vertical-bamboo-poles', label: 'Vertical bamboo poles' },
    ],
    careRules: cucumberCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      manuallyPollinatedFruitCount: 2,
      unopenedBudCountMinimum: 5,
    },
    notes: ['Two manually pollinated fruits are being tracked closely.', '5+ unopened buds present.'],
  },
  {
    id: 'squash',
    name: 'Squash',
    quantity: 1,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'fruiting-and-blooming',
    growthStage: 'baby-set',
    heights: {
      display: 'Large robust bush',
      approximate: true,
      minInches: 24,
      maxInches: 30,
    },
    supports: [{ type: 'center-bamboo-anchor', label: 'Center bamboo anchor pole' }],
    careRules: squashCareRules,
    currentMetrics: {
      totalHarvestCount: 1,
      developingFruitCountRange: { min: 5, max: 6, unit: 'count', display: '5-6 baby fruits' },
      approachingBloomCount: 2,
      recentHarvestLengthInches: 6,
      recentHarvestStored: true,
    },
    notes: [
      'One 6-inch squash was successfully harvested and frozen last week.',
      'Leaves are heavily covered in bird droppings confirmed benign and non-pathological.',
    ],
  },
  {
    id: 'green-bean-bush',
    name: 'Green Bean Bush',
    quantity: 1,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground',
    status: 'high-production',
    growthStage: 'harvesting',
    heights: {
      display: 'Compact lush bush',
      approximate: true,
      minInches: 12,
      maxInches: 18,
    },
    supports: [],
    careRules: beanCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      recentHarvestCountRange: { min: 20, max: 25, unit: 'count', display: '20-25 beans' },
    },
    notes: [
      'Positioned along the front edge of the ground plot border.',
      'Stored in the refrigerator with paper towels.',
      'Continuous rapid flowering.',
    ],
  },
  {
    id: 'cantaloupe',
    name: 'Cantaloupe',
    quantity: 1,
    zoneId: 'ground-plot',
    sunlightProfileId: 'downhill-high-sun-trellis',
    plantingMedium: 'In-ground downhill high-sun trellis section',
    status: 'blooming',
    growthStage: 'blooming',
    heights: {
      display: 'One 3 ft vine and one 1 ft vine',
      approximate: true,
      minInches: feet(1),
      maxInches: feet(3),
      segments: [
        { label: 'Primary vine', inches: feet(3), display: '3 ft' },
        { label: 'Secondary vine', inches: feet(1), display: '1 ft' },
      ],
    },
    supports: [
      {
        type: 'bamboo-chicken-wire-trellis',
        label: '7 ft bamboo and chicken-wire tombstone trellis',
      },
    ],
    careRules: melonCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      vineLengthsInches: [feet(3), feet(1)],
      visibleBabyFruitSetCount: 0,
      supportPrepared: true,
    },
    notes: [
      'Planted downhill in the high-sun section with 8-10 hours of uninterrupted daily sun.',
      'Awaiting plant maturity; no baby fruit sets are visible yet.',
      'Mesh fruit support hammocks are prepped.',
    ],
  },
  {
    id: 'marigolds',
    name: 'Marigolds',
    quantity: 4,
    zoneId: 'ground-plot',
    sunlightProfileId: 'ground-plot-canopy',
    plantingMedium: 'In-ground companion flowers',
    status: 'companion-blooming',
    growthStage: 'blooming',
    heights: {
      display: 'Companion flowers',
      approximate: true,
      minInches: 8,
      maxInches: 18,
    },
    supports: [{ type: 'companion-planting', label: 'Interplanted pest deterrent companions' }],
    careRules: flowerCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      companionFlowerColor: 'bright orange',
    },
    notes: ['Interplanted at tactical corners and plant bases, especially near squash and tomatoes.'],
  },
  {
    id: 'black-tomato',
    name: 'Black Tomato',
    quantity: 1,
    zoneId: 'container-zone',
    sunlightProfileId: 'container-zone-sun',
    plantingMedium: 'Large white textured pot',
    status: 'early-bloom',
    growthStage: 'blooming',
    heights: {
      display: '~1 ft',
      approximate: true,
      minInches: feet(1),
      maxInches: feet(1),
    },
    supports: [{ type: 'wooden-split-rail-stake', label: 'Wooden split-rail structural stake' }],
    careRules: tomatoCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      plantedLateByMonths: 1,
    },
    notes: [
      'Planted 1 month late.',
      'Recently repotted out of the ground plot to correct shallow surface-level planting.',
      'Repotting is intended to promote a deeper root network.',
    ],
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    quantity: 1,
    zoneId: 'container-zone',
    sunlightProfileId: 'container-zone-sun',
    plantingMedium: 'Medium black nursery pot',
    status: 'vegetative',
    growthStage: 'vegetative',
    heights: {
      display: '~6 in climbing vine',
      approximate: true,
      minInches: 6,
      maxInches: 6,
    },
    supports: [],
    careRules: melonCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      plantedLateByMonths: 1,
    },
    notes: [
      'Recently repotted out of the ground plot to correct a shallow root depth issue.',
      'Planted 1 month late.',
    ],
  },
  {
    id: 'peppers',
    name: 'Peppers',
    quantity: 2,
    zoneId: 'container-zone',
    sunlightProfileId: 'container-zone-sun',
    plantingMedium: 'Small grey starter pots',
    status: 'seedling-vegetative',
    growthStage: 'seedling',
    heights: {
      display: '~3-4 in seedlings',
      approximate: true,
      minInches: 3,
      maxInches: 4,
    },
    supports: [{ type: 'protective-multi-planter', label: 'Pink clover-shaped multi-planter base' }],
    careRules: flowerCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
      plantedLateByMonths: 1,
    },
    notes: [
      'Nested safely inside a protective pink clover-shaped multi-planter base unit.',
      'Rescued out of the ground plot due to shallow rooting issues.',
    ],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    quantity: 1,
    zoneId: 'container-zone',
    sunlightProfileId: 'container-zone-sun',
    plantingMedium: 'Pink clover multi-planter module',
    status: 'stagnant',
    growthStage: 'vegetative',
    heights: {
      display: 'Stagnant container plant',
      approximate: true,
      minInches: 4,
      maxInches: 8,
    },
    supports: [
      { type: 'protective-multi-planter', label: 'Pink clover multi-planter module' },
      { type: 'fire-pit-moat-platform', label: 'Covered fire pit moat barrier platform' },
    ],
    careRules: berryCareRules,
    currentMetrics: {
      totalHarvestCount: 0,
    },
    notes: [
      'Placed dead-center on top of a covered backyard fire pit as a critter moat barrier.',
      'High-security isolation setup to prevent ground critter consumption.',
    ],
  },
];

const seedLogs: readonly GardenLog[] = [
  {
    id: 'log-cucumber-pollination-2026-06-06',
    plantId: 'cucumbers',
    type: 'pollination',
    occurredAt: '2026-06-06T08:00:00-05:00',
    metric: '2 manually pollinated fruits',
    detail: 'Two cucumber fruits are being tracked after manual pollination.',
  },
  {
    id: 'log-squash-harvest-2026-05-30',
    plantId: 'squash',
    type: 'harvest',
    occurredAt: '2026-05-30T18:00:00-05:00',
    metric: '1 squash at 6 in',
    detail: 'Harvested one 6-inch squash and froze it.',
  },
  {
    id: 'log-green-bean-harvest-2026-06-05',
    plantId: 'green-bean-bush',
    type: 'harvest',
    occurredAt: '2026-06-05T19:00:00-05:00',
    metric: '20-25 beans',
    detail: 'Stored in the refrigerator with paper towels.',
  },
  {
    id: 'log-black-tomato-transplant-2026-06-04',
    plantId: 'black-tomato',
    type: 'transplant',
    occurredAt: '2026-06-04T17:30:00-05:00',
    metric: 'repotted',
    detail: 'Moved into the large white textured pot to correct shallow planting depth.',
  },
  {
    id: 'log-cantaloupe-support-2026-06-06',
    plantId: 'cantaloupe',
    type: 'support',
    occurredAt: '2026-06-06T09:30:00-05:00',
    metric: 'hammocks prepped',
    detail: 'Mesh fruit support hammocks are prepped ahead of active fruit sizing.',
  },
];

const backlogTasks: readonly GardenBacklogTask[] = [
  {
    id: 'ground-plot-hygiene-alert',
    title: 'Ground-plot canopy hygiene alert',
    priority: 'high',
    state: 'ready',
    notes: ['All open-air ground-plot fruit requires exhaustive wash cycles before consumption.'],
  },
  {
    id: 'secondary-t-post-support',
    title: 'Source secondary tomato T-post supports',
    priority: 'medium',
    state: 'ready',
    notes: ['Cherry Tomatoes and Brandywine Tomato are already at the staking warning threshold.'],
  },
  {
    id: 'cantaloupe-hammock-support',
    title: 'Install cantaloupe support hammocks',
    plantId: 'cantaloupe',
    priority: 'low',
    state: 'watching',
    triggerStage: 'active-sizing',
    notes: ['Transition from Baby Set to Active Sizing should promote this task to ready.'],
  },
];

export const gardenSeedSnapshot: GardenSeedSnapshot = {
  snapshotDate: JUNE_6_2026_GARDEN_SNAPSHOT,
  location: 'Columbia, TN',
  zones: seedZones,
  sunlightProfiles: seedSunlightProfiles,
  overheadCanopy: {
    zoneId: 'ground-plot',
    birdDroppingCoverage: 'heavy',
    fertilizerEffect: 'High-nitrogen/phosphorus sky fertilizer effect from the canopy tree.',
    hygieneNotice: 'All ground-plot fruit requires exhaustive wash cycles before consumption.',
    notes: [
      'Daytime bird pressure is persistent because berries and seeds keep the canopy occupied.',
      'Bird droppings are confirmed benign on the squash leaves but still require strict hygiene.',
    ],
  },
  plants: seedPlants,
  logs: seedLogs,
  backlogTasks,
};
