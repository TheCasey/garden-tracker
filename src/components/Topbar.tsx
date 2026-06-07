type ShellView = 'dashboard' | 'plant' | 'tasks';

const tabs: ReadonlyArray<{ id: ShellView; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'plant', label: 'Plant' },
  { id: 'tasks', label: 'Tasks' },
];

export function Topbar({
  activeView,
  onChangeView,
}: {
  activeView: ShellView;
  onChangeView: (view: ShellView) => void;
}) {
  return (
    <>
      <div className="topbar-brand">
        <span className="logo-mark" aria-hidden="true" />
        <span className="logo-text">Garden Tracker</span>
      </div>

      <nav className="topbar-nav" aria-label="Primary views">
        <div className="nav-tabs" role="tablist" aria-label="Garden views">
          {tabs.map((tab) => {
            const isActive = tab.id === activeView;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`tab-button${isActive ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="main-content"
                data-view={tab.id}
                onClick={() => onChangeView(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="weather-chip" aria-label="Weather summary">
        <i className="ti ti-sun" aria-hidden="true" />
        <span>84°F · TN</span>
      </div>
    </>
  );
}
