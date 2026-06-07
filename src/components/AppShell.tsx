import { useEffect, useMemo, useState } from 'react';
import { gardenSeedSnapshot } from '../data';
import type { GardenPlant, PlantStatus, ZoneId } from '../domain';
import { createBrowserPersistenceStorage } from '../lib/persistence';
import { createLocalGardenRepository } from '../repositories';
import { AlertBanner } from './AlertBanner';
import { Dashboard } from './Dashboard';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

type ShellView = 'dashboard' | 'plant' | 'tasks';
type ShellTone = 'near' | 'fruit' | 'early' | 'stagnant';

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
  const [activeView, setActiveView] = useState<ShellView>('dashboard');
  const [selectedPlantId, setSelectedPlantId] = useState(gardenSeedSnapshot.plants[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const repository = createLocalGardenRepository({
      storage: createBrowserPersistenceStorage(window.localStorage),
    });

    void repository.listPlants().then((nextPlants) => {
      setPlants(nextPlants);
      setSelectedPlantId((currentPlantId) =>
        nextPlants.some((plant) => plant.id === currentPlantId)
          ? currentPlantId
          : (nextPlants[0]?.id ?? ''),
      );
    });
  }, []);

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

            {activeView === 'dashboard' ? (
              <Dashboard
                plants={plants}
                zones={gardenSeedSnapshot.zones}
                sunlightProfiles={gardenSeedSnapshot.sunlightProfiles}
                logs={gardenSeedSnapshot.logs}
                selectedPlantId={selectedPlantId}
                onOpenPlant={openPlant}
              />
            ) : null}
            {activeView === 'plant' ? <PlantPlaceholder plant={selectedPlant} /> : null}
            {activeView === 'tasks' ? <TasksPlaceholder /> : null}
          </section>
        </main>
      </div>
    </div>
  );
}

function PlantPlaceholder({ plant }: { plant: GardenPlant | null }) {
  if (!plant) {
    return (
      <section className="placeholder-band">
        <p className="placeholder-copy">No plant selected.</p>
      </section>
    );
  }

  const zone = gardenSeedSnapshot.zones.find((item) => item.id === plant.zoneId);
  const leadNote = plant.notes[0] ?? 'Plant detail content is reserved for a later phase.';

  return (
    <div className="placeholder-stack">
      <section className="placeholder-band" aria-labelledby="plant-placeholder-heading">
        <div className="placeholder-header">
          <div>
            <h2 id="plant-placeholder-heading" className="zone-title">
              {plant.name}
            </h2>
            <p className="zone-meta">
              {zone?.label ?? 'Garden'} · {plant.heights.display} · {plant.growthStage}
            </p>
          </div>
          <span className="inline-badge">x{plant.quantity}</span>
        </div>
        <p className="placeholder-copy">{leadNote}</p>
      </section>

      <section className="placeholder-band" aria-labelledby="plant-shell-heading">
        <div className="placeholder-header">
          <h2 id="plant-shell-heading" className="zone-title">
            Detail shell
          </h2>
          <span className={`status-accent status-accent-${STATUS_TONE_MAP[plant.status]}`}>
            {plant.status.replaceAll('-', ' ')}
          </span>
        </div>
        <p className="placeholder-copy">
          Care rules, AI diagnostics, log composition, and persistence controls are intentionally
          deferred. This phase only establishes the responsive shell and navigation landmarks.
        </p>
      </section>
    </div>
  );
}

function TasksPlaceholder() {
  const pendingCount = gardenSeedSnapshot.backlogTasks.filter((task) => task.state !== 'done').length;

  return (
    <div className="placeholder-stack">
      <section className="placeholder-band" aria-labelledby="tasks-placeholder-heading">
        <div className="placeholder-header">
          <div>
            <h2 id="tasks-placeholder-heading" className="zone-title">
              Work queue
            </h2>
            <p className="zone-meta">{pendingCount} open items in the snapshot backlog</p>
          </div>
          <span className="inline-badge">placeholder</span>
        </div>
        <p className="placeholder-copy">
          Task completion behavior, logging, and persistence remain out of scope. The shell keeps
          the view switcher and accessibility landmarks in place for later phases.
        </p>
      </section>
    </div>
  );
}
