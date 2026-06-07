import type { GardenLog, GardenPlant, GardenZone, SunlightProfile } from '../domain';
import { MoistureDryoutBar } from './MoistureDryoutBar';
import { PlantCard } from './PlantCard';
import { PlantRow } from './PlantRow';
import {
  type QuickActionId,
  getContainerDryoutModel,
  getDashboardTone,
  getPlantAlertChip,
  getPlantCardPills,
  getPlantRowPills,
  getPlantRowSubtitle,
  getQuickActions,
} from './dashboardModel';

function isGroundCardPlant(plant: GardenPlant): boolean {
  return plant.zoneId === 'ground-plot' && plant.id !== 'cantaloupe' && plant.id !== 'marigolds';
}

function getZoneSunlightLabel(zone: GardenZone, sunlightProfiles: readonly SunlightProfile[]): string {
  const sunlightProfile = sunlightProfiles.find((profile) => profile.id === zone.defaultSunlightProfileId);
  return sunlightProfile?.hours.display.replace('hours', 'hr sun') ?? 'Sun tracked';
}

export function Dashboard({
  plants,
  zones,
  sunlightProfiles,
  logs,
  selectedPlantId,
  onOpenPlant,
  onQuickAction,
}: {
  plants: readonly GardenPlant[];
  zones: readonly GardenZone[];
  sunlightProfiles: readonly SunlightProfile[];
  logs: readonly GardenLog[];
  selectedPlantId: string;
  onOpenPlant: (plantId: string) => void;
  onQuickAction: (plantId: string, actionId: QuickActionId) => void;
}) {
  const groundZone = zones.find((zone) => zone.id === 'ground-plot');
  const containerZone = zones.find((zone) => zone.id === 'container-zone');

  const groundPlants = plants.filter((plant) => plant.zoneId === 'ground-plot');
  const groundCards = groundPlants.filter(isGroundCardPlant);
  const groundRows = groundPlants.filter((plant) => !isGroundCardPlant(plant));
  const containerPlants = plants.filter((plant) => plant.zoneId === 'container-zone');

  return (
    <div className="dashboard-view" data-testid="dashboard-view">
      {groundZone ? (
        <section aria-labelledby="ground-plot-heading" data-testid="zone-ground-plot">
          <div className="zone-hd">
            <span id="ground-plot-heading" className="zone-title">
              {groundZone.label}
            </span>
            <span className="zone-sub">
              {groundPlants.length} plants · {getZoneSunlightLabel(groundZone, sunlightProfiles)} · Bird-drop zone
            </span>
          </div>

          <div className={`plant-grid${groundCards.length === 1 ? ' single' : ''}`}>
            {groundCards.map((plant) => (
              <PlantCard
                key={plant.id}
                plantId={plant.id}
                name={plant.name}
                quantity={plant.quantity}
                tone={getDashboardTone(plant.status)}
                selected={plant.id === selectedPlantId}
                pills={getPlantCardPills(plant)}
                quickActions={getQuickActions(plant, logs)}
                alertChip={getPlantAlertChip(plant, logs)}
                onOpen={() => onOpenPlant(plant.id)}
                onQuickAction={(actionId) => onQuickAction(plant.id, actionId)}
              />
            ))}
          </div>

          <div className="row-stack">
            {groundRows.map((plant) => (
              <div key={plant.id}>
                <PlantRow
                  plantId={plant.id}
                  name={plant.name}
                  subtitle={getPlantRowSubtitle(plant, sunlightProfiles)}
                  tone={getDashboardTone(plant.status)}
                  selected={plant.id === selectedPlantId}
                  pills={getPlantRowPills(plant)}
                  quickActions={getQuickActions(plant, logs)}
                  onOpen={() => onOpenPlant(plant.id)}
                  onQuickAction={(actionId) => onQuickAction(plant.id, actionId)}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="divider" />

      {containerZone ? (
        <section aria-labelledby="container-zone-heading" data-testid="zone-container-zone">
          <div className="zone-hd">
            <span id="container-zone-heading" className="zone-title">
              {containerZone.label}
            </span>
            <span className="zone-sub">Accelerated dryout monitoring</span>
          </div>

          <div className="row-stack">
            {containerPlants.map((plant) => {
              const dryout = getContainerDryoutModel(plant, logs);

              return (
                <div key={plant.id}>
                  <PlantRow
                    plantId={plant.id}
                    name={plant.name}
                    subtitle={plant.id === 'strawberry' ? getPlantRowSubtitle(plant, sunlightProfiles) : undefined}
                    tone={getDashboardTone(plant.status)}
                    selected={plant.id === selectedPlantId}
                    pills={getPlantRowPills(plant)}
                    quickActions={getQuickActions(plant, logs)}
                    onOpen={() => onOpenPlant(plant.id)}
                    onQuickAction={(actionId) => onQuickAction(plant.id, actionId)}
                  />
                  {dryout ? <MoistureDryoutBar plantId={plant.id} dryout={dryout} /> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
