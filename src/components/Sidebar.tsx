type ShellTone = 'near' | 'fruit' | 'early' | 'stagnant';
type ZoneId = 'ground-plot' | 'container-zone';

interface SidebarPlant {
  id: string;
  name: string;
  quantity: number;
  zoneId: ZoneId;
  statusTone: ShellTone;
  iconClass: string;
}

const zoneLabels: Record<ZoneId, string> = {
  'ground-plot': 'Ground Plot',
  'container-zone': 'Container Zone',
};

export function Sidebar({
  plants,
  selectedPlantId,
  onSelectPlant,
}: {
  plants: readonly SidebarPlant[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
}) {
  return (
    <aside className="sidebar" aria-label="Plant navigation" data-testid="sidebar">
      <nav aria-label="Plants by zone">
        {Object.entries(zoneLabels).map(([zoneId, zoneLabel]) => {
          const zonePlants = plants.filter((plant) => plant.zoneId === zoneId);

          return (
            <section key={zoneId} className="sidebar-section" aria-labelledby={`zone-${zoneId}`}>
              <h2 id={`zone-${zoneId}`} className="sidebar-section-label">
                {zoneLabel}
              </h2>

              <div className="sidebar-list">
                {zonePlants.map((plant) => {
                  const isActive = plant.id === selectedPlantId;

                  return (
                    <button
                      key={plant.id}
                      type="button"
                      className={`sidebar-item${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => onSelectPlant(plant.id)}
                    >
                      <i className={plant.iconClass} aria-hidden="true" />
                      <span className="sidebar-item-label">{plant.name}</span>
                      <span className="sidebar-quantity">x{plant.quantity}</span>
                      <span
                        className={`sidebar-status-dot sidebar-status-dot-${plant.statusTone}`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
