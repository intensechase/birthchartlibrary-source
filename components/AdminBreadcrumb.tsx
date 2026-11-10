import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  crumbs: Crumb[]
  className?: string
}

export default function AdminBreadcrumb({ crumbs, className = 'mb-6' }: Props) {
  return (
    <nav className={`text-xs text-slate-400 ${className}`}>
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">&rsaquo;</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-600 dark:text-slate-400">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
