import { Toaster } from "@/components/ui/sonner";
import Background from "@/components/Background";
export const metadata = {
  title: "Public User Page | SasayakiBox",
  description: "Send anonymous messages to users",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-blue-50">
  <div className="absolute inset-0 w-full h-full opacity-40 -z-10">
    <Background />
  </div>

  <div className="relative z-10">{children}</div>
   {/* Toast notifications */}
   <Toaster position="bottom-right" />
</section>

  );
}
