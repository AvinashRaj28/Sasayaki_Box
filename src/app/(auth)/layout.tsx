import { LanguageProvider } from "@/context/LanguageContext"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: 'Authentication | SasayakiBox',
  description: 'Sign in or sign up to SasayakiBox',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <Navbar hideLanguageToggle={true} />

      {/* Background wrapper */}
      <div className="min-h-screen w-full flex flex-col relative">

        {/* Fuji background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url('/fuji.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.85)",
          }}
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] -z-10" />

        {/* Main content */}
        <main className="flex-grow flex items-center justify-center px-4 md:px-24 py-8 relative z-10 w-full">
          {children}
        </main>
      </div>

      <footer className="text-center p-4 md:p-6 bg-pink-500 text-white">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">SasayakiBox</span>. All rights reserved.
      </footer>

      <Toaster />
    </LanguageProvider>
  )
}
