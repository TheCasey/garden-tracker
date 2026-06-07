import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { gardenSeedSnapshot } from '../data';
import type { BacklogTaskState, GardenBacklogTask, GardenLog, GardenPlant, PlantStatus, ZoneId } from '../domain';
import { createBrowserPersistenceStorage } from '../lib/persistence';
import { type GardenRepository, createLocalGardenRepository } from '../repositories';
import { AlertBanner } from './AlertBanner';
import { Dashboard } from './Dashboard';
import { PlantDetail } from './PlantDetail';
import { TaskCheckbox } from './TaskCheckbox';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { QuickActionId } from './dashboardModel';

type ShellView = 'dashboard' | 'plant' | 'tasks';
type ShellTone = 'near' | 'fruit' | 'early' | 'stagnant';
type RoutineActionMode = 'harvest' | 'log';

interface RoutineActionDraft {
  mode: RoutineActionMode;
  plantId: string;
}

interface SidebarPlant {
  id: string;
  name: string;
  quantity: number;
  zoneId: ZoneId;
  statusTone: ShellTone;
  iconClass: string;
}

const VIEW_TITLES: Record<ShellView, string> = {
  dashboard: 'Dashboard',
  plant: 'Plant',
  tasks: 'Tasks',
};

const STATUS_TONE_MAP: Record<PlantStatus, ShellTone> = {
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

export function AppShell() {
  const [plants, setPlants] = useState<readonly GardenPlant[]>(gardenSeedSnapshot.plants);
  const [logs, setLogs] = useState<readonly GardenLog[]>(gardenSeedSnapshot.logs);
  const [tasks, setTasks] = useState<readonly GardenBacklogTask[]>(gardenSeedSnapshot.backlogTasks);
  const [activeView, setActiveView] = useState<ShellView>('dashboard');
  const [selectedPlantId, setSelectedPlantId] = useState(gardenSeedSnapshot.plants[0]?.id ?? '');
  const [routineActionDraft, setRoutineActionDraft] = useState<RoutineActionDraft | null>(null);
  const [repositoryError, setRepositoryError] = useState<string | null>(null);

  const repository = useMemo<GardenRepository | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return createLocalGardenRepository({
      storage: createBrowserPersistenceStorage(window.localStorage),
    });
  }, []);

  const refreshGardenState = useCallback(async () => {
    if (!repository) {
      return;
    }

    const [nextPlants, nextLogs, nextTasks] = await Promise.all([
      repository.listPlants(),
      repository.listGardenLogs(),
      repository.listTasks(),
    ]);

    setPlants(nextPlants);
    setLogs(nextLogs);
    setTasks(nextTasks);
    setSelectedPlantId((currentPlantId) =>
      nextPlants.some((plant) => plant.id === currentPlantId)
        ? currentPlantId
        : (nextPlants[0]?.id ?? ''),
    );
  }, [repository]);

  useEffect(() => {
    if (!repository) {
      return;
    }

    void Promise.all([
      repository.listPlants(),
      repository.listGardenLogs(),
      repository.listTasks(),
    ])
      .then(([nextPlants, nextLogs, nextTasks]) => {
        setPlants(nextPlants);
        setLogs(nextLogs);
        setTasks(nextTasks);
        setSelectedPlantId((currentPlantId) =>
          nextPlants.some((plant) => plant.id === currentPlantId)
            ? currentPlantId
            : (nextPlants[0]?.id ?? ''),
        );
      })
      .catch((error: unknown) => {
        setRepositoryError(error instanceof Error ? error.message : 'Could not load garden state.');
      });
  }, [repository]);

  const plantsForSidebar = useMemo<readonly SidebarPlant[]>(
    () =>
      plants.map((plant) => ({
        id: plant.id,
        name: plant.name,
        quantity: plant.quantity,
        zoneId: plant.zoneId,
        statusTone: STATUS_TONE_MAP[plant.status],
        iconClass: plant.zoneId === 'container-zone' ? 'ti ti-box' : 'ti ti-plant-2',
      })),
    [plants],
  );

  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.id === selectedPlantId) ?? null,
    [plants, selectedPlantId],
  );

  const openPlant = (plantId: string) => {
    setSelectedPlantId(plantId);
    setActiveView('plant');
  };

  const returnToDashboard = () => {
    setActiveView('dashboard');
  };

  const handleQuickAction = (plantId: string, actionId: QuickActionId) => {
    setRepositoryError(null);
    setSelectedPlantId(plantId);

    if (!repository) {
      setRepositoryError('Local garden storage is not available.');
      return;
    }

    if (actionId === 'water') {
      const occurredAt = new Date().toISOString();

      void repository
        .appendGardenLog({
          plantId,
          type: 'watering',
          occurredAt,
          metric: 'watered today',
          detail: 'Routine watering logged from the dashboard.',
        })
        .then(refreshGardenState)
        .catch((error: unknown) => {
          setRepositoryError(error instanceof Error ? error.message : 'Could not log watering.');
        });
      return;
    }

    if (actionId === 'harvest') {
      setRoutineActionDraft({ mode: 'harvest', plantId });
      return;
    }

    if (actionId === 'log' || actionId === 'sun') {
      setRoutineActionDraft({ mode: 'log', plantId });
    }
  };

  const handleHarvestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!repository || routineActionDraft?.mode !== 'harvest') {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const harvestedCount = Number(formData.get('harvest-count'));
    const detail = getStringFormValue(formData, 'harvest-note').trim();

    if (!Number.isInteger(harvestedCount) || harvestedCount <= 0) {
      setRepositoryError('Harvest count must be a positive whole number.');
      return;
    }

    void repository
      .recordHarvest({
        plantId: routineActionDraft.plantId,
        harvestedCount,
        occurredAt: new Date().toISOString(),
        metric: `${harvestedCount} harvested`,
        detail: detail || `Harvested ${harvestedCount}.`,
      })
      .then(async () => {
        setRoutineActionDraft(null);
        await refreshGardenState();
      })
      .catch((error: unknown) => {
        setRepositoryError(error instanceof Error ? error.message : 'Could not save harvest.');
      });
  };

  const handleLogSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!repository || routineActionDraft?.mode !== 'log') {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const detail = getStringFormValue(formData, 'log-note').trim();

    if (!detail) {
      setRepositoryError('Log note is required.');
      return;
    }

    void repository
      .appendGardenLog({
        plantId: routineActionDraft.plantId,
        type: 'observation',
        occurredAt: new Date().toISOString(),
        metric: 'manual note',
        detail,
      })
      .then(async () => {
        setRoutineActionDraft(null);
        setActiveView('plant');
        await refreshGardenState();
      })
      .catch((error: unknown) => {
        setRepositoryError(error instanceof Error ? error.message : 'Could not save log note.');
      });
  };

  const handleTaskToggle = (task: GardenBacklogTask) => {
    if (!repository) {
      setRepositoryError('Local garden storage is not available.');
      return;
    }

    const seedTask = gardenSeedSnapshot.backlogTasks.find((candidate) => candidate.id === task.id);
    const nextState: BacklogTaskState = task.state === 'done' ? (seedTask?.state ?? 'pending') : 'done';

    void repository
      .setTaskState(task.id, nextState)
      .then((updatedTask) => {
        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            currentTask.id === updatedTask.id ? updatedTask : currentTask,
          ),
        );
      })
      .catch((error: unknown) => {
        setRepositoryError(error instanceof Error ? error.message : 'Could not update task.');
      });
  };

  const actionPlant = routineActionDraft
    ? plants.find((plant) => plant.id === routineActionDraft.plantId)
    : null;

  return (
    <div className="app-shell">
      <header className="topbar" role="banner">
        <Topbar activeView={activeView} onChangeView={setActiveView} />
      </header>

      <AlertBanner notice={gardenSeedSnapshot.overheadCanopy.hygieneNotice} />

      <div className="shell-layout">
        <Sidebar
          plants={plantsForSidebar}
          selectedPlantId={selectedPlantId}
          onSelectPlant={openPlant}
        />

        <main className="shell-main" id="main-content" tabIndex={-1}>
          <section
            className="view-panel"
            aria-labelledby="view-heading"
            data-active-view={activeView}
            data-testid={`view-${activeView}`}
          >
            <div className="view-header">
              <div>
                <p className="section-kicker">Garden shell</p>
                <h1 id="view-heading">{VIEW_TITLES[activeView]}</h1>
              </div>
              <p className="view-meta">
                Snapshot {gardenSeedSnapshot.snapshotDate} · {gardenSeedSnapshot.location}
              </p>
            </div>

            {repositoryError ? (
              <p className="routine-error" role="alert">
                {repositoryError}
              </p>
            ) : null}

            {routineActionDraft && actionPlant ? (
              <RoutineActionPanel
                draft={routineActionDraft}
                plantName={actionPlant.name}
                onHarvestSubmit={handleHarvestSubmit}
                onLogSubmit={handleLogSubmit}
                onCancel={() => setRoutineActionDraft(null)}
              />
            ) : null}

            {activeView === 'dashboard' ? (
              <Dashboard
                plants={plants}
                zones={gardenSeedSnapshot.zones}
                sunlightProfiles={gardenSeedSnapshot.sunlightProfiles}
                logs={logs}
                selectedPlantId={selectedPlantId}
                onOpenPlant={openPlant}
                onQuickAction={handleQuickAction}
              />
            ) : null}
            {activeView === 'plant' ? (
              <PlantDetail
                plant={selectedPlant}
                zones={gardenSeedSnapshot.zones}
                sunlightProfiles={gardenSeedSnapshot.sunlightProfiles}
                logs={logs}
                onBack={returnToDashboard}
              />
            ) : null}
            {activeView === 'tasks' ? (
              <TaskList tasks={tasks} onToggleTask={handleTaskToggle} />
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

function RoutineActionPanel({
  draft,
  plantName,
  onHarvestSubmit,
  onLogSubmit,
  onCancel,
}: {
  draft: RoutineActionDraft;
  plantName: string;
  onHarvestSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  if (draft.mode === 'harvest') {
    return (
      <section className="routine-panel" aria-labelledby="routine-action-heading" data-testid="harvest-panel">
        <div className="placeholder-header">
          <div>
            <h2 id="routine-action-heading" className="zone-title">
              Record harvest
            </h2>
            <p className="zone-meta">{plantName}</p>
          </div>
          <button type="button" className="routine-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
        <form className="routine-form" onSubmit={onHarvestSubmit}>
          <label className="routine-field">
            <span>Count</span>
            <input
              name="harvest-count"
              type="number"
              min="1"
              step="1"
              required
              inputMode="numeric"
              data-testid="harvest-count-input"
            />
          </label>
          <label className="routine-field routine-field-wide">
            <span>Note</span>
            <input
              name="harvest-note"
              type="text"
              placeholder="Optional harvest context"
              data-testid="harvest-note-input"
            />
          </label>
          <button type="submit" className="routine-primary" data-testid="harvest-submit">
            Save harvest
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="routine-panel" aria-labelledby="routine-action-heading" data-testid="log-panel">
      <div className="placeholder-header">
        <div>
          <h2 id="routine-action-heading" className="zone-title">
            Add log note
          </h2>
          <p className="zone-meta">{plantName}</p>
        </div>
        <button type="button" className="routine-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <form className="routine-form routine-form-note" onSubmit={onLogSubmit}>
        <label className="routine-field routine-field-wide">
          <span>Note</span>
          <textarea
            name="log-note"
            required
            rows={3}
            data-testid="log-note-input"
          />
        </label>
        <button type="submit" className="routine-primary" data-testid="log-submit">
          Save log
        </button>
      </form>
    </section>
  );
}

function TaskList({
  tasks,
  onToggleTask,
}: {
  tasks: readonly GardenBacklogTask[];
  onToggleTask: (task: GardenBacklogTask) => void;
}) {
  const pendingCount = tasks.filter((task) => task.state !== 'done').length;

  return (
    <section className="task-panel" aria-labelledby="tasks-heading" data-testid="task-list">
      <div className="placeholder-header">
        <div>
          <h2 id="tasks-heading" className="zone-title">
            Work queue
          </h2>
          <p className="zone-meta">{pendingCount} open items in the local backlog</p>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCheckbox key={task.id} task={task} onToggle={() => onToggleTask(task)} />
        ))}
      </div>
    </section>
  );
}

function getStringFormValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}
