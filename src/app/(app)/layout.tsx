import AuthProvider from "@/context/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "SasayakiBox",
  description: "Send and receive anonymous messages securely",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <main className="min-h-screen">{children}</main>
      </LanguageProvider>
    </AuthProvider>
  );
}
