import { describe, expect, it } from 'vitest';
import { gardenSeedSnapshot } from '../../src/data';
import { JUNE_6_2026_GARDEN_SNAPSHOT } from '../../src/domain';

describe('garden seed snapshot', () => {
  it('stays pinned to the June 6, 2026 prototype snapshot', () => {
    expect(gardenSeedSnapshot.snapshotDate).toBe(JUNE_6_2026_GARDEN_SNAPSHOT);
    expect(gardenSeedSnapshot.location).toBe('Columbia, TN');
    expect(gardenSeedSnapshot.plants).toHaveLength(12);
  });

  it('preserves the ground plot canopy hygiene context and downhill trellis sunlight exception', () => {
    expect(gardenSeedSnapshot.overheadCanopy).toMatchObject({
      zoneId: 'ground-plot',
      birdDroppingCoverage: 'heavy',
    });
    expect(gardenSeedSnapshot.overheadCanopy.hygieneNotice).toContain('exhaustive wash cycles');

    const cantaloupe = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cantaloupe');
    const highSunProfile = gardenSeedSnapshot.sunlightProfiles.find(
      (profile) => profile.id === 'downhill-high-sun-trellis',
    );

    expect(cantaloupe?.sunlightProfileId).toBe('downhill-high-sun-trellis');
    expect(highSunProfile?.hours.display).toBe('8-10 hours');
  });

  it('matches the fixed June 6 plant metrics for both zones', () => {
    const cherry = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cherry-tomatoes');
    const cucumbers = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cucumbers');
    const squash = gardenSeedSnapshot.plants.find((plant) => plant.id === 'squash');
    const cantaloupe = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cantaloupe');
    const blackTomato = gardenSeedSnapshot.plants.find((plant) => plant.id === 'black-tomato');
    const peppers = gardenSeedSnapshot.plants.find((plant) => plant.id === 'peppers');
    const strawberry = gardenSeedSnapshot.plants.find((plant) => plant.id === 'strawberry');

    expect(cherry).toMatchObject({
      quantity: 2,
      status: 'near-first-yield',
      heights: { maxInches: 72 },
    });
    expect(cucumbers?.currentMetrics).toMatchObject({
      manuallyPollinatedFruitCount: 2,
      unopenedBudCountMinimum: 5,
    });
    expect(squash?.currentMetrics).toMatchObject({
      totalHarvestCount: 1,
      approachingBloomCount: 2,
      recentHarvestLengthInches: 6,
    });
    expect(cantaloupe?.currentMetrics).toMatchObject({
      visibleBabyFruitSetCount: 0,
      supportPrepared: true,
    });
    expect(blackTomato?.currentMetrics.plantedLateByMonths).toBe(1);
    expect(peppers).toMatchObject({
      quantity: 2,
      status: 'seedling-vegetative',
      heights: { minInches: 3, maxInches: 4 },
    });
    expect(strawberry?.status).toBe('stagnant');
  });

  it('captures the seed logs and task states needed for later phases', () => {
    const pollinationLog = gardenSeedSnapshot.logs.find((log) => log.id === 'log-cucumber-pollination-2026-06-06');
    const squashHarvestLog = gardenSeedSnapshot.logs.find((log) => log.id === 'log-squash-harvest-2026-05-30');
    const hammockTask = gardenSeedSnapshot.backlogTasks.find(
      (task) => task.id === 'cantaloupe-hammock-support',
    );

    expect(pollinationLog?.metric).toBe('2 manually pollinated fruits');
    expect(squashHarvestLog?.detail).toContain('froze it');
    expect(hammockTask).toMatchObject({
      state: 'watching',
      triggerStage: 'active-sizing',
    });
  });
});
