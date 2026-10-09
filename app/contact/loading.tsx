export default function Loading() {
  return <main className="contact-page" aria-busy="true" aria-label="Loading contact details">
    <section className="contact-card">
      <div className="contact-portrait"><span className="is-skeleton" style={{ display: "block", aspectRatio: 2816 / 4008 }} /></div>
      <div className="contact-copy">
        <span className="skeleton-heading is-skeleton" />
        <div className="skeleton-lines">
          {[100, 96, 88, 98, 92, 70].map((width, index) => <span key={index} className="is-skeleton" style={{ width: `${width}%` }} />)}
        </div>
      </div>
    </section>
  </main>;
}
