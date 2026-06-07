import { gardenSeedSnapshot } from '../data';
import type { BacklogTaskState, GardenBacklogTask, GardenLog, GardenPlant } from '../domain';
import {
  readJsonFromStorage,
  type PersistenceStorage,
  writeJsonToStorage,
} from '../lib/persistence';
import {
  AI_CARE_PATCH_ALLOWED_FIELDS,
  type AiCarePatchAllowedField,
  type AiCarePatchResult,
  type AppendGardenLogInput,
  type AppendPlantChatMessageInput,
  type GardenPlantUpdate,
  type GardenRepository,
  type HarvestMutationResult,
  type PlantChatMessage,
  type RecordHarvestInput,
} from './gardenRepository';

const AI_CARE_PATCH_FIELD_MAP = {
  watering_interval_days_dry_season: 'wateringIntervalDaysDrySeason',
  watering_interval_days_normal: 'wateringIntervalDaysNormal',
  fertilizing_interval_weeks: 'fertilizingIntervalWeeks',
  ideal_soil_moisture_depth_inches: 'idealSoilMoistureDepthInches',
  days_to_maturity_estimate: 'daysToMaturityEstimate',
} as const;

const LOCAL_GARDEN_REPOSITORY_VERSION = 1;

export const LOCAL_GARDEN_REPOSITORY_STORAGE_KEY = 'garden_repository_state';
export const GARDEN_TASKS_STATE_STORAGE_KEY = 'garden_tasks_state';

interface PersistedGardenRepositoryState {
  version: number;
  seededSnapshotDate: string;
  plants: GardenPlant[];
  logs: GardenLog[];
  chatHistoryByPlantId: Record<string, PlantChatMessage[]>;
}

interface PersistedGardenTaskState {
  version: number;
  seededSnapshotDate: string;
  taskStatesById: Record<string, BacklogTaskState>;
}

export class GardenRepositoryNotFoundError extends Error {
  constructor(entityType: 'plant' | 'task', entityId: string) {
    super(`Unknown ${entityType} id: ${entityId}`);
    this.name = 'GardenRepositoryNotFoundError';
  }
}

export class GardenRepositoryConflictError extends Error {
  constructor(entityType: 'plant', entityId: string) {
    super(`${entityType} already exists: ${entityId}`);
    this.name = 'GardenRepositoryConflictError';
  }
}

export class GardenRepositoryPatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GardenRepositoryPatchError';
  }
}

export interface LocalGardenRepositoryOptions {
  storage: PersistenceStorage;
}

export function createLocalGardenRepository({
  storage,
}: LocalGardenRepositoryOptions): GardenRepository {
  return new LocalGardenRepository(storage);
}

class LocalGardenRepository implements GardenRepository {
  constructor(private readonly storage: PersistenceStorage) {}

  listPlants(): Promise<readonly GardenPlant[]> {
    return this.execute(() => cloneValue(this.loadState().plants));
  }

  getPlantById(plantId: string): Promise<GardenPlant | undefined> {
    return this.execute(() => {
      const plant = this.loadState().plants.find((candidate) => candidate.id === plantId);
      return plant ? cloneValue(plant) : undefined;
    });
  }

  createPlant(plant: GardenPlant): Promise<GardenPlant> {
    return this.execute(() => {
      const state = this.loadState();

      if (state.plants.some((candidate) => candidate.id === plant.id)) {
        throw new GardenRepositoryConflictError('plant', plant.id);
      }

      state.plants.push(cloneValue(plant));
      this.saveState(state);

      return cloneValue(plant);
    });
  }

  updatePlant(plantId: string, updates: GardenPlantUpdate): Promise<GardenPlant> {
    return this.execute(() => {
      const state = this.loadState();
      const plantIndex = state.plants.findIndex((candidate) => candidate.id === plantId);

      if (plantIndex === -1) {
        throw new GardenRepositoryNotFoundError('plant', plantId);
      }

      const updatedPlant = {
        ...state.plants[plantIndex],
        ...cloneValue(updates),
        id: plantId,
      };

      state.plants[plantIndex] = updatedPlant;
      this.saveState(state);

      return cloneValue(updatedPlant);
    });
  }

  deletePlant(plantId: string): Promise<void> {
    return this.execute(() => {
      const state = this.loadState();
      const plantExists = state.plants.some((candidate) => candidate.id === plantId);

      if (!plantExists) {
        throw new GardenRepositoryNotFoundError('plant', plantId);
      }

      state.plants = state.plants.filter((candidate) => candidate.id !== plantId);
      state.logs = state.logs.filter((log) => log.plantId !== plantId);
      delete state.chatHistoryByPlantId[plantId];
      this.saveState(state);
    });
  }

  listGardenLogs(plantId?: string): Promise<readonly GardenLog[]> {
    return this.execute(() => {
      const logs = this.loadState().logs;
      const filteredLogs = plantId ? logs.filter((log) => log.plantId === plantId) : logs;
      return cloneValue(filteredLogs);
    });
  }

  appendGardenLog(input: AppendGardenLogInput): Promise<GardenLog> {
    return this.execute(() => {
      const state = this.loadState();
      this.getRequiredPlant(state.plants, input.plantId);

      const log: GardenLog = {
        id: input.id ?? buildLogId(input.plantId, input.type, input.occurredAt),
        plantId: input.plantId,
        type: input.type,
        occurredAt: input.occurredAt,
        metric: input.metric,
        detail: input.detail,
      };

      state.logs.push(log);
      if (input.type === 'watering') {
        state.plants = state.plants.map((plant) =>
          plant.id === input.plantId
            ? {
                ...plant,
                currentMetrics: {
                  ...plant.currentMetrics,
                  lastWateredAt: input.occurredAt,
                },
              }
            : plant,
        );
      }
      this.saveState(state);

      return cloneValue(log);
    });
  }

  recordHarvest(input: RecordHarvestInput): Promise<HarvestMutationResult> {
    return this.execute(() => {
      if (!Number.isInteger(input.harvestedCount) || input.harvestedCount <= 0) {
        throw new RangeError('harvestedCount must be a positive integer.');
      }

      const state = this.loadState();
      const plant = this.getRequiredPlant(state.plants, input.plantId);

      const updatedPlant: GardenPlant = {
        ...plant,
        currentMetrics: {
          ...plant.currentMetrics,
          totalHarvestCount: plant.currentMetrics.totalHarvestCount + input.harvestedCount,
        },
      };

      const log: GardenLog = {
        id: buildLogId(input.plantId, 'harvest', input.occurredAt),
        plantId: input.plantId,
        type: 'harvest',
        occurredAt: input.occurredAt,
        metric: input.metric,
        detail: input.detail,
      };

      state.plants = state.plants.map((candidate) =>
        candidate.id === input.plantId ? updatedPlant : candidate,
      );
      state.logs.push(log);
      this.saveState(state);

      return {
        plant: cloneValue(updatedPlant),
        log: cloneValue(log),
      };
    });
  }

  listTasks(): Promise<readonly GardenBacklogTask[]> {
    return this.execute(() => {
      const persistedTaskState = this.loadTaskState();
      const tasks = gardenSeedSnapshot.backlogTasks.map((task) => ({
        ...task,
        state: persistedTaskState.taskStatesById[task.id] ?? task.state,
      }));

      return cloneValue(tasks);
    });
  }

  setTaskState(taskId: string, state: BacklogTaskState): Promise<GardenBacklogTask> {
    return this.execute(() => {
      const taskDefinition = gardenSeedSnapshot.backlogTasks.find((task) => task.id === taskId);

      if (!taskDefinition) {
        throw new GardenRepositoryNotFoundError('task', taskId);
      }

      const persistedTaskState = this.loadTaskState();
      persistedTaskState.taskStatesById[taskId] = state;
      this.saveTaskState(persistedTaskState);

      return cloneValue({
        ...taskDefinition,
        state,
      });
    });
  }

  listPlantChatMessages(plantId: string): Promise<readonly PlantChatMessage[]> {
    return this.execute(() => {
      const state = this.loadState();
      this.getRequiredPlant(state.plants, plantId);
      return cloneValue(state.chatHistoryByPlantId[plantId] ?? []);
    });
  }

  appendPlantChatMessage(input: AppendPlantChatMessageInput): Promise<PlantChatMessage> {
    return this.execute(() => {
      const state = this.loadState();
      this.getRequiredPlant(state.plants, input.plantId);

      const message: PlantChatMessage = {
        id: input.id ?? buildChatMessageId(input.plantId, input.role, input.createdAt),
        plantId: input.plantId,
        role: input.role,
        content: input.content,
        createdAt: input.createdAt,
      };

      const existingMessages = state.chatHistoryByPlantId[input.plantId] ?? [];
      state.chatHistoryByPlantId[input.plantId] = [...existingMessages, message];
      this.saveState(state);

      return cloneValue(message);
    });
  }

  applyAiCarePatch(input: {
    plantId: string;
    appliedAt: string;
    targetFields: Record<string, number>;
    userAlert?: string;
  }): Promise<AiCarePatchResult> {
    return this.execute(() => {
      const state = this.loadState();
      const plant = this.getRequiredPlant(state.plants, input.plantId);
      const targetFieldEntries = Object.entries(input.targetFields);

      if (targetFieldEntries.length === 0) {
        throw new GardenRepositoryPatchError(
          'AI care patch must include at least one target field.',
        );
      }

      const unknownFields = targetFieldEntries
        .map(([fieldName]) => fieldName)
        .filter(
          (fieldName) => !AI_CARE_PATCH_ALLOWED_FIELDS.includes(fieldName as AiCarePatchAllowedField),
        );

      if (unknownFields.length > 0) {
        throw new GardenRepositoryPatchError(
          `Unsupported AI care patch field(s): ${unknownFields.join(', ')}`,
        );
      }

      const nextCareRules = { ...plant.careRules };

      for (const [fieldName, fieldValue] of targetFieldEntries) {
        if (!Number.isInteger(fieldValue) || fieldValue <= 0) {
          throw new GardenRepositoryPatchError(
            `AI care patch field ${fieldName} must be a positive integer.`,
          );
        }

        const careRuleFieldName = AI_CARE_PATCH_FIELD_MAP[fieldName as AiCarePatchAllowedField];
        nextCareRules[careRuleFieldName] = fieldValue;
      }

      const updatedPlant: GardenPlant = {
        ...plant,
        careRules: nextCareRules,
      };

      state.plants = state.plants.map((candidate) =>
        candidate.id === input.plantId ? updatedPlant : candidate,
      );
      this.saveState(state);

      return {
        plant: cloneValue(updatedPlant),
        appliedFields: targetFieldEntries.map(
          ([fieldName]) => fieldName as AiCarePatchAllowedField,
        ),
        appliedAt: input.appliedAt,
        userAlert: input.userAlert,
      };
    });
  }

  private loadState(): PersistedGardenRepositoryState {
    const persistedState = readJsonFromStorage<PersistedGardenRepositoryState>(
      this.storage,
      LOCAL_GARDEN_REPOSITORY_STORAGE_KEY,
    );

    if (persistedState) {
      return persistedState;
    }

    const seededState = createSeededGardenRepositoryState();
    this.saveState(seededState);
    return seededState;
  }

  private saveState(state: PersistedGardenRepositoryState): void {
    writeJsonToStorage(this.storage, LOCAL_GARDEN_REPOSITORY_STORAGE_KEY, state);
  }

  private loadTaskState(): PersistedGardenTaskState {
    const persistedTaskState = readJsonFromStorage<PersistedGardenTaskState>(
      this.storage,
      GARDEN_TASKS_STATE_STORAGE_KEY,
    );

    if (persistedTaskState) {
      return persistedTaskState;
    }

    const seededTaskState = createSeededGardenTaskState();
    this.saveTaskState(seededTaskState);
    return seededTaskState;
  }

  private saveTaskState(state: PersistedGardenTaskState): void {
    writeJsonToStorage(this.storage, GARDEN_TASKS_STATE_STORAGE_KEY, state);
  }

  private execute<T>(operation: () => T): Promise<T> {
    return Promise.resolve().then(operation);
  }

  private getRequiredPlant(plants: readonly GardenPlant[], plantId: string): GardenPlant {
    const plant = plants.find((candidate) => candidate.id === plantId);

    if (!plant) {
      throw new GardenRepositoryNotFoundError('plant', plantId);
    }

    return plant;
  }
}

function createSeededGardenRepositoryState(): PersistedGardenRepositoryState {
  return {
    version: LOCAL_GARDEN_REPOSITORY_VERSION,
    seededSnapshotDate: gardenSeedSnapshot.snapshotDate,
    plants: gardenSeedSnapshot.plants.map((plant) => cloneValue(plant)),
    logs: gardenSeedSnapshot.logs.map((log) => cloneValue(log)),
    chatHistoryByPlantId: {},
  };
}

function createSeededGardenTaskState(): PersistedGardenTaskState {
  return {
    version: LOCAL_GARDEN_REPOSITORY_VERSION,
    seededSnapshotDate: gardenSeedSnapshot.snapshotDate,
    taskStatesById: Object.fromEntries(
      gardenSeedSnapshot.backlogTasks.map((task) => [task.id, task.state]),
    ),
  };
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function buildLogId(plantId: string, type: GardenLog['type'], occurredAt: string): string {
  return `log-${plantId}-${type}-${occurredAt}`;
}

function buildChatMessageId(
  plantId: string,
  role: PlantChatMessage['role'],
  createdAt: string,
): string {
  return `chat-${plantId}-${role}-${createdAt}`;
}
