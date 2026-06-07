export function AlertBanner({ notice }: { notice: string }) {
  return (
    <div className="alert-banner" role="alert">
      <i className="ti ti-alert-triangle" aria-hidden="true" />
      <p>
        <strong>Canopy zone active.</strong> {notice}
      </p>
    </div>
  );
}
