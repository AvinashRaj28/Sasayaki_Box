import AuthProvider from "@/context/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "SasayakiBox",
  description: "Send and receive anonymous messages securely",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <main className="min-h-screen">{children}</main>
      </LanguageProvider>
      <footer className="text-center p-4 md:p-6 bg-pink-500 text-white">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">SasayakiBox</span>. All rights reserved.
      </footer>
    </AuthProvider>
  );
}
