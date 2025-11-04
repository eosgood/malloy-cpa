interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-sky-100 to-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">{title}</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">{subtitle}</p>
      </div>
    </section>
  );
}
