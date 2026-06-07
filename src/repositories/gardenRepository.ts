import type { BacklogTaskState, GardenBacklogTask, GardenLog, GardenLogType, GardenPlant } from '../domain';

export const AI_CARE_PATCH_ALLOWED_FIELDS = [
  'watering_interval_days_dry_season',
  'watering_interval_days_normal',
  'fertilizing_interval_weeks',
  'ideal_soil_moisture_depth_inches',
  'days_to_maturity_estimate',
] as const;

export type AiCarePatchAllowedField = (typeof AI_CARE_PATCH_ALLOWED_FIELDS)[number];
export type PlantChatMessageRole = 'system' | 'user' | 'assistant';
export type GardenPlantUpdate = Partial<Omit<GardenPlant, 'id'>>;

export interface AppendGardenLogInput {
  id?: string;
  plantId: string;
  type: GardenLogType;
  occurredAt: string;
  metric: string;
  detail: string;
}

export interface RecordHarvestInput {
  plantId: string;
  harvestedCount: number;
  occurredAt: string;
  metric: string;
  detail: string;
}

export interface PlantChatMessage {
  id: string;
  plantId: string;
  role: PlantChatMessageRole;
  content: string;
  createdAt: string;
}

export interface AppendPlantChatMessageInput {
  id?: string;
  plantId: string;
  role: PlantChatMessageRole;
  content: string;
  createdAt: string;
}

export interface ApplyAiCarePatchInput {
  plantId: string;
  appliedAt: string;
  targetFields: Record<string, number>;
  userAlert?: string;
}

export interface HarvestMutationResult {
  plant: GardenPlant;
  log: GardenLog;
}

export interface AiCarePatchResult {
  plant: GardenPlant;
  appliedFields: readonly AiCarePatchAllowedField[];
  appliedAt: string;
  userAlert?: string;
}

export interface GardenRepository {
  listPlants(): Promise<readonly GardenPlant[]>;
  getPlantById(plantId: string): Promise<GardenPlant | undefined>;
  createPlant(plant: GardenPlant): Promise<GardenPlant>;
  updatePlant(plantId: string, updates: GardenPlantUpdate): Promise<GardenPlant>;
  deletePlant(plantId: string): Promise<void>;

  listGardenLogs(plantId?: string): Promise<readonly GardenLog[]>;
  appendGardenLog(input: AppendGardenLogInput): Promise<GardenLog>;
  recordHarvest(input: RecordHarvestInput): Promise<HarvestMutationResult>;

  listTasks(): Promise<readonly GardenBacklogTask[]>;
  setTaskState(taskId: string, state: BacklogTaskState): Promise<GardenBacklogTask>;

  listPlantChatMessages(plantId: string): Promise<readonly PlantChatMessage[]>;
  appendPlantChatMessage(input: AppendPlantChatMessageInput): Promise<PlantChatMessage>;

  applyAiCarePatch(input: ApplyAiCarePatchInput): Promise<AiCarePatchResult>;
}
