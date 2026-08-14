import Hero from "@/components/Hero";
import Disciplines from "@/components/Disciplines";
import Pricing from "@/components/Pricing";

// FASE 2 — Hero + Disciplinas + Precios
export default function HomePage() {
  return (
    <main className="min-h-dvh bg-brand-black flex flex-col">
      <Hero />
      <Disciplines />
      <Pricing />
    </main>
  );
}
