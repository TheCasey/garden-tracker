import { describe, expect, it } from 'vitest';
import { createMemoryPersistenceStorage, readJsonFromStorage } from '../../src/lib/persistence';
import {
  createLocalGardenRepository,
  GARDEN_TASKS_STATE_STORAGE_KEY,
  GardenRepositoryPatchError,
} from '../../src/repositories';

describe('local garden repository', () => {
  it('adds a watering log that persists and rehydrates for a single plant', async () => {
    const storage = createMemoryPersistenceStorage();
    const repository = createLocalGardenRepository({ storage });

    await repository.appendGardenLog({
      id: 'log-cherry-tomatoes-watering-2026-06-06',
      plantId: 'cherry-tomatoes',
      type: 'watering',
      occurredAt: '2026-06-06T19:00:00-05:00',
      metric: 'deep watering',
      detail: 'Watered after the canopy shade settled in.',
    });

    const rehydratedRepository = createLocalGardenRepository({ storage });
    const rehydratedPlant = await rehydratedRepository.getPlantById('cherry-tomatoes');
    const cherryLogs = await rehydratedRepository.listGardenLogs('cherry-tomatoes');
    const unrelatedLogs = await rehydratedRepository.listGardenLogs('black-tomato');

    expect(rehydratedPlant?.currentMetrics.lastWateredAt).toBe('2026-06-06T19:00:00-05:00');
    expect(cherryLogs.at(-1)).toMatchObject({
      plantId: 'cherry-tomatoes',
      type: 'watering',
      metric: 'deep watering',
    });
    expect(
      cherryLogs.filter((log) => log.id === 'log-cherry-tomatoes-watering-2026-06-06'),
    ).toHaveLength(1);
    expect(unrelatedLogs.every((log) => log.plantId === 'black-tomato')).toBe(true);
  });

  it('increments harvest count atomically with a matching garden log entry', async () => {
    const storage = createMemoryPersistenceStorage();
    const repository = createLocalGardenRepository({ storage });

    const result = await repository.recordHarvest({
      plantId: 'green-bean-bush',
      harvestedCount: 4,
      occurredAt: '2026-06-06T18:15:00-05:00',
      metric: '4 beans',
      detail: 'Quick evening harvest pass.',
    });

    expect(result.plant.currentMetrics.totalHarvestCount).toBe(4);
    expect(result.log).toMatchObject({
      plantId: 'green-bean-bush',
      type: 'harvest',
      metric: '4 beans',
    });

    const rehydratedRepository = createLocalGardenRepository({ storage });
    const rehydratedPlant = await rehydratedRepository.getPlantById('green-bean-bush');
    const harvestLogs = await rehydratedRepository.listGardenLogs('green-bean-bush');

    expect(rehydratedPlant?.currentMetrics.totalHarvestCount).toBe(4);
    expect(harvestLogs.at(-1)).toMatchObject({
      plantId: 'green-bean-bush',
      type: 'harvest',
      detail: 'Quick evening harvest pass.',
    });

    await expect(
      rehydratedRepository.recordHarvest({
        plantId: 'green-bean-bush',
        harvestedCount: 0,
        occurredAt: '2026-06-06T18:20:00-05:00',
        metric: '0 beans',
        detail: 'Invalid empty harvest.',
      }),
    ).rejects.toThrow('harvestedCount must be a positive integer.');
  });

  it('persists task checkbox state under garden_tasks_state', async () => {
    const storage = createMemoryPersistenceStorage();
    const repository = createLocalGardenRepository({ storage });

    await repository.setTaskState('cantaloupe-hammock-support', 'done');

    const rawTaskState = readJsonFromStorage<{
      taskStatesById: Record<string, string>;
    }>(storage, GARDEN_TASKS_STATE_STORAGE_KEY);

    expect(rawTaskState?.taskStatesById['cantaloupe-hammock-support']).toBe('done');

    const rehydratedRepository = createLocalGardenRepository({ storage });
    const tasks = await rehydratedRepository.listTasks();
    const cantaloupeTask = tasks.find((task) => task.id === 'cantaloupe-hammock-support');

    expect(cantaloupeTask?.state).toBe('done');
  });

  it('stores chat history per plant and rehydrates without cross-plant leakage', async () => {
    const storage = createMemoryPersistenceStorage();
    const repository = createLocalGardenRepository({ storage });

    await repository.appendPlantChatMessage({
      id: 'chat-black-tomato-user-2026-06-06',
      plantId: 'black-tomato',
      role: 'user',
      content: 'Leaves look better after the repot.',
      createdAt: '2026-06-06T20:10:00-05:00',
    });
    await repository.appendPlantChatMessage({
      id: 'chat-cherry-tomatoes-assistant-2026-06-06',
      plantId: 'cherry-tomatoes',
      role: 'assistant',
      content: 'Watch for ripening at the base clusters.',
      createdAt: '2026-06-06T20:12:00-05:00',
    });

    const rehydratedRepository = createLocalGardenRepository({ storage });
    const blackTomatoMessages = await rehydratedRepository.listPlantChatMessages('black-tomato');
    const cherryMessages = await rehydratedRepository.listPlantChatMessages('cherry-tomatoes');

    expect(blackTomatoMessages).toHaveLength(1);
    expect(blackTomatoMessages[0]).toMatchObject({
      plantId: 'black-tomato',
      role: 'user',
    });
    expect(cherryMessages).toHaveLength(1);
    expect(cherryMessages[0]).toMatchObject({
      plantId: 'cherry-tomatoes',
      role: 'assistant',
    });
  });

  it('applies approved AI care-rule patches and rejects unknown fields', async () => {
    const storage = createMemoryPersistenceStorage();
    const repository = createLocalGardenRepository({ storage });

    const patchResult = await repository.applyAiCarePatch({
      plantId: 'black-tomato',
      appliedAt: '2026-06-06T21:00:00-05:00',
      targetFields: {
        watering_interval_days_normal: 3,
        fertilizing_interval_weeks: 4,
      },
      userAlert: 'Container heat is running higher than expected.',
    });

    expect(patchResult.appliedFields).toEqual([
      'watering_interval_days_normal',
      'fertilizing_interval_weeks',
    ]);
    expect(patchResult.plant.careRules).toMatchObject({
      wateringIntervalDaysNormal: 3,
      fertilizingIntervalWeeks: 4,
    });

    const rehydratedRepository = createLocalGardenRepository({ storage });
    const patchedPlant = await rehydratedRepository.getPlantById('black-tomato');

    expect(patchedPlant?.careRules).toMatchObject({
      wateringIntervalDaysNormal: 3,
      fertilizingIntervalWeeks: 4,
    });

    await expect(
      rehydratedRepository.applyAiCarePatch({
        plantId: 'black-tomato',
        appliedAt: '2026-06-06T21:05:00-05:00',
        targetFields: {
          unknown_field: 99,
        },
      }),
    ).rejects.toBeInstanceOf(GardenRepositoryPatchError);

    const unchangedPlant = await rehydratedRepository.getPlantById('black-tomato');
    expect(unchangedPlant?.careRules).toMatchObject({
      wateringIntervalDaysNormal: 3,
      fertilizingIntervalWeeks: 4,
    });
  });
});
