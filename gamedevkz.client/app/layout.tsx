import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SoundEffects from "@/components/sound-effects"
import SafariThemeColor from "@/components/safari-theme-color"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "АКИРА",
  description: "Алматинский Клуб Игровых разработчиков АКИРА",
  // Set initial theme-color meta tag for iOS Safari
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' }
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SafariThemeColor />
          <SoundEffects />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
