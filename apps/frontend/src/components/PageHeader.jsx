export default function PageHeader({ title, description }) {
  return (
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <p className="page-desc">{description}</p>
    </div>
  )
}
