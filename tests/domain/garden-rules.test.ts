import { describe, expect, it } from 'vitest';
import { gardenSeedSnapshot } from '../../src/data';
import {
  applyHarvestTally,
  assessContainerDryoutRisk,
  getNextWateringState,
  getPollinationCountdown,
  getTomatoStakingWarning,
  updateCantaloupeHammockTaskState,
} from '../../src/lib/gardenRules';

describe('garden rules', () => {
  it('computes next watering state from injected time and care interval', () => {
    expect(
      getNextWateringState({
        lastWateredAt: '2026-06-06T08:00:00.000Z',
        now: '2026-06-07T12:00:00.000Z',
        wateringIntervalDays: 2,
      }),
    ).toMatchObject({
      nextWaterAt: '2026-06-08T08:00:00.000Z',
      state: 'due-soon',
    });

    expect(
      getNextWateringState({
        lastWateredAt: '2026-06-06T08:00:00.000Z',
        now: '2026-06-09T09:00:00.000Z',
        wateringIntervalDays: 2,
      }).state,
    ).toBe('due');
  });

  it('flags container dryout acceleration for container plants only', () => {
    const containerPlant = gardenSeedSnapshot.plants.find((plant) => plant.id === 'black-tomato');
    const groundPlant = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cherry-tomatoes');

    expect(containerPlant).toBeDefined();
    expect(groundPlant).toBeDefined();

    expect(assessContainerDryoutRisk(containerPlant!)).toMatchObject({
      accelerated: true,
      acceleratedIntervalDays: 1,
      risk: 'elevated',
    });
    expect(assessContainerDryoutRisk(groundPlant!)).toMatchObject({
      accelerated: false,
      acceleratedIntervalDays: 2,
      risk: 'normal',
    });
  });

  it('warns only tomatoes at or above 5 ft for secondary staking attention', () => {
    const cherry = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cherry-tomatoes');
    const brandywine = gardenSeedSnapshot.plants.find((plant) => plant.id === 'brandywine-tomato');
    const beefsteak = gardenSeedSnapshot.plants.find((plant) => plant.id === 'beefsteak-tomato');

    expect(cherry).toBeDefined();
    expect(brandywine).toBeDefined();
    expect(beefsteak).toBeDefined();

    expect(getTomatoStakingWarning(cherry!).shouldWarn).toBe(true);
    expect(getTomatoStakingWarning(brandywine!).shouldWarn).toBe(true);
    expect(getTomatoStakingWarning(beefsteak!)).toMatchObject({
      shouldWarn: false,
      currentMaxInches: 54,
    });
  });

  it('transitions pollination countdown state across the 48h and 72h boundaries', () => {
    const pollinatedAt = '2026-06-06T08:00:00.000Z';

    expect(getPollinationCountdown(pollinatedAt, '2026-06-08T07:59:00.000Z').state).toBe(
      'under-48h',
    );
    expect(getPollinationCountdown(pollinatedAt, '2026-06-08T08:00:00.000Z').state).toBe(
      'within-48h-to-72h',
    );
    expect(getPollinationCountdown(pollinatedAt, '2026-06-09T08:00:00.000Z').state).toBe(
      'within-48h-to-72h',
    );
    expect(getPollinationCountdown(pollinatedAt, '2026-06-09T08:01:00.000Z').state).toBe(
      'over-72h',
    );
  });

  it('updates harvest tallies immutably and appends a harvest log', () => {
    const updatedSnapshot = applyHarvestTally(gardenSeedSnapshot, {
      plantId: 'green-bean-bush',
      harvestedCount: 3,
      occurredAt: '2026-06-06T18:15:00-05:00',
      metric: '3 beans',
      detail: 'Quick follow-up harvest.',
    });

    const originalPlant = gardenSeedSnapshot.plants.find((plant) => plant.id === 'green-bean-bush');
    const updatedPlant = updatedSnapshot.plants.find((plant) => plant.id === 'green-bean-bush');

    expect(originalPlant?.currentMetrics.totalHarvestCount).toBe(0);
    expect(updatedPlant?.currentMetrics.totalHarvestCount).toBe(3);
    expect(updatedSnapshot.logs).toHaveLength(gardenSeedSnapshot.logs.length + 1);
    expect(updatedSnapshot.logs.at(-1)).toMatchObject({
      plantId: 'green-bean-bush',
      type: 'harvest',
    });
    expect(updatedSnapshot).not.toBe(gardenSeedSnapshot);
  });

  it('promotes the cantaloupe hammock task only when Baby Set becomes Active Sizing', () => {
    const unchangedTasks = updateCantaloupeHammockTaskState(
      gardenSeedSnapshot.backlogTasks,
      'blooming',
      'baby-set',
    );
    const updatedTasks = updateCantaloupeHammockTaskState(
      gardenSeedSnapshot.backlogTasks,
      'baby-set',
      'active-sizing',
    );

    const unchangedTask = unchangedTasks.find((task) => task.id === 'cantaloupe-hammock-support');
    const updatedTask = updatedTasks.find((task) => task.id === 'cantaloupe-hammock-support');

    expect(unchangedTask?.state).toBe('watching');
    expect(updatedTask?.state).toBe('ready');
    expect(updatedTask?.notes.at(-1)).toContain('Active Sizing');
  });
});
