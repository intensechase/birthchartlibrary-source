import DashboardSidebar from '@/components/DashboardSidebar'
import EmailVerificationBanner from '@/components/EmailVerificationBanner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-0">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <EmailVerificationBanner />
        {children}
      </div>
    </div>
  )
}
