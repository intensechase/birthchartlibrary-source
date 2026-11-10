import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  href: string
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
}

export default function AdminListCard({ href, title, subtitle, meta }: Props) {
  return (
    <Link href={href} className="card block p-4 hover:border-slate-400 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">{title}</p>
          {subtitle && <p className="text-sm text-slate-500 truncate">{subtitle}</p>}
        </div>
        {meta && <div className="text-right text-xs text-slate-400 ml-4 shrink-0">{meta}</div>}
      </div>
    </Link>
  )
}
