import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LangProvider } from '@/lib/i18n/context'
import { getLang } from '@/lib/i18n/server'
import { AnalyticsTracker } from '@/components/analytics/tracker'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = await getLang()

  return (
    <LangProvider initialLang={lang}>
      <AnalyticsTracker />
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </LangProvider>
  )
}
