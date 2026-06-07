import { describe, expect, it } from 'vitest';
import { gardenSeedSnapshot } from '../../src/data';
import {
  getContainerDryoutModel,
  getPlantAlertChip,
  getPlantCardPills,
  getQuickActions,
} from '../../src/components/dashboardModel';

describe('plant card presentation', () => {
  it('derives deterministic low, mid, and high container dryout states for the June 6 snapshot', () => {
    const blackTomato = gardenSeedSnapshot.plants.find((plant) => plant.id === 'black-tomato');
    const watermelon = gardenSeedSnapshot.plants.find((plant) => plant.id === 'watermelon');
    const peppers = gardenSeedSnapshot.plants.find((plant) => plant.id === 'peppers');

    expect(getContainerDryoutModel(blackTomato!, gardenSeedSnapshot.logs)).toMatchObject({
      fillClass: 'mid',
      label: '~6 hrs',
    });
    expect(getContainerDryoutModel(watermelon!, gardenSeedSnapshot.logs)).toMatchObject({
      fillClass: 'hi',
      label: 'Water now',
    });
    expect(getContainerDryoutModel(peppers!, gardenSeedSnapshot.logs)).toMatchObject({
      fillClass: 'lo',
      label: 'Adequate',
    });
  });

  it('maps the cherry tomato dashboard card content from the seed snapshot', () => {
    const cherry = gardenSeedSnapshot.plants.find((plant) => plant.id === 'cherry-tomatoes');

    expect(cherry).toBeDefined();

    expect(getPlantCardPills(cherry!)).toEqual([
      { label: '6 ft', tone: 'g' },
      { label: 'Near yield', tone: 'a' },
    ]);
    expect(getQuickActions(cherry!)).toEqual([
      { id: 'water', label: 'Watered', iconClass: 'ti ti-droplet', done: true },
      { id: 'harvest', label: 'Harvest', iconClass: 'ti ti-basket' },
    ]);
    expect(getPlantAlertChip(cherry!, gardenSeedSnapshot.logs)).toMatchObject({
      tone: 'w',
      text: 'Verify bamboo anchors - >5 ft',
    });
  });
});
