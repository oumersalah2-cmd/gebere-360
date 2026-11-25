"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Map,
  ScanLine,
  ShieldCheck,
  Sprout,
  Store,
  Tractor,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { platformTranslations } from "@/lib/i18n";

export default function Home() {
  const { language } = useApp();
  const t = platformTranslations[language];

  const services = [
    {
      icon: ScanLine,
      eyebrow: language === "om" ? "01 / Hubannoo" : language === "am" ? "01 / ብልህነት" : "01 / Intelligence",
      title: language === "om" ? "Rakkoo dursii argi" : language === "am" ? "ችግሮችን አስቀድመው ይወቁ" : "See problems earlier",
      description:
        language === "om"
          ? "Suuraa midhaanii gara qorannoo maasii hojiirra ooluutti jijjiiri — Gebere Vision AI qonna Itoophiyaatiif kan qophaa'e."
          : language === "am"
          ? "የሰብል ፎቶን ለኢትዮጵያ እርሻዎች በተዘጋጀው Gebere Vision AI አማካኝነት ወደ ተግባራዊ የምርመራ ውጤት ይቀይሩ።"
          : "Turn a crop photo into a practical scouting brief with Gebere Vision AI, built for the realities of Ethiopian fields.",
      href: "/gebere-vision-ai",
    },
    {
      icon: Map,
      eyebrow: language === "om" ? "02 / Hojii Maasii" : language === "am" ? "02 / የማሳ ሥራ" : "02 / Field operations",
      title: language === "om" ? "Lafa hunda beeki" : language === "am" ? "እያንዳንዱን ማሳ ይወቁ" : "Know every plot",
      description:
        language === "om"
          ? "Lafa safaradhu, maasii galmeessi, hojii midhaanii waqtii hunda bakka tokkotti to'adhu."
          : language === "am"
          ? "መሬት ይለኩ፣ ማሳዎችን ይመዝግቡ እና የሰብል እንቅስቃሴዎችን በአንድ አስተማማኝ ቦታ ይያዙ።"
          : "Map land, register farms, and keep crop activity in one dependable workspace your team can use every season.",
      href: "/farms",
    },
    {
      icon: BarChart3,
      eyebrow: language === "om" ? "03 / Diinagdee Maasii" : language === "am" ? "03 / የማሳ ኢኮኖሚ" : "03 / Farm economics",
      title: language === "om" ? "Ifaa ta'een guddisi" : language === "am" ? "በግልጽ እቅድ ያሳድጉ" : "Grow with clarity",
      description:
        language === "om"
          ? "Baasiiwwan, oomisha sassaabamee fi bu'aa ETB'n hordofii murtoo sirrii fudhadhu."
          : language === "am"
          ? "ወጪዎችን፣ ምርትን እና ትርፍን በETB ይከታተሉ፤ እያንዳንዱን ውሳኔ በራስዎ ቁጥር ይደግፉ።"
          : "Track expenses, harvests, and margins in ETB so each decision is grounded in your own numbers.",
      href: "/finance",
    },
    {
      icon: Store,
      eyebrow: language === "om" ? "04 / Carraa Gabaa" : language === "am" ? "04 / የገበያ መዳረሻ" : "04 / Market access",
      title: language === "om" ? "Oomisha gabaatti dhiyeessi" : language === "am" ? "ምርትዎን ወደ ገበያ ያቅርቡ" : "Move harvest forward",
      description:
        language === "om"
          ? "Oomisha qulqulluu bittootaa fi waldaalee waliin kallattiin gabaa B2B irratti walqunnamsiisi."
          : language === "am"
          ? "ጥራት ያለውን ምርት ከገዢዎች እና ከኅብረት ሥራ ማኅበራት ጋር በB2B ገበያ በቀጥታ ያገናኙ።"
          : "Connect quality produce with buyers and cooperative partners through a focused B2B marketplace.",
      href: "/marketplace",
    },
  ];

  const highlights =
    language === "om"
      ? ["Salphaatti fayyadami", "Daataa kee to'adhu", "Garee maasiif qophaa'e"]
      : language === "am"
      ? ["ለአጠቃቀም ቀላል", "መረጃዎ በእጅዎ", "ለመስክ ቡድኖች የተሰራ"]
      : ["Simple by design", "Data you control", "Made for field teams"];

  return (
    <main className="space-y-24 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#123b2b] text-white shadow-[0_24px_70px_rgba(18,59,43,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(176,216,105,0.22),transparent_34%),linear-gradient(115deg,rgba(18,59,43,0.98)_0%,rgba(18,59,43,0.86)_45%,rgba(18,59,43,0.3)_100%)]" />
        <div className="relative grid min-h-[620px] items-end gap-12 p-7 sm:p-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:p-16">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9f99d] backdrop-blur-sm">
              <Sprout className="h-4 w-4" />
              {t.home.badge}
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#d6e7dc] sm:text-lg">
              {t.home.heroDesc}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/auth/register" className="group inline-flex items-center gap-3 rounded-full bg-[#d9f99d] px-6 py-3.5 text-sm font-bold text-[#123b2b] transition-transform hover:-translate-y-0.5">
                {t.home.startBtn}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                {t.home.exploreBtn}
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#b8d2c2]">
              {highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#d9f99d]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/15" />
            <div className="relative overflow-hidden rounded-[1.5rem] border-8 border-white/90 bg-white shadow-2xl">
              <img src="/images/agriculture-collage.png" alt="A collage of Ethiopian crops, farmers, irrigation, and harvest" className="aspect-square w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 text-[#123b2b] shadow-xl sm:-left-10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#e8f4d0] p-2.5"><Tractor className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#69806f]">{t.brandName}</p>
                  <p className="mt-0.5 text-sm font-bold">{language === "om" ? "Biyyee irraa gara gabaatti" : language === "am" ? "ከአፈር እስከ ገበያ" : "From soil to sale"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b927e]">{t.home.approachLabel}</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#123b2b] sm:text-5xl">
            {t.home.approachTitle}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-[#64736a] lg:ml-auto">
          {t.home.approachDesc}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {services.map(({ icon: Icon, ...service }) => (
          <Link key={service.href} href={service.href} className="group rounded-[1.5rem] border border-[#dfe8df] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#9bbf8d] hover:shadow-[0_18px_40px_rgba(18,59,43,0.08)]">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-[#edf6e3] p-3.5 text-[#286344]"><Icon className="h-6 w-6" /></div>
              <ArrowUpRight className="h-5 w-5 text-[#9caf9f] transition-colors group-hover:text-[#286344]" />
            </div>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9d8c]">{service.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#123b2b]">{service.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#68776d]">{service.description}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-[#286344]">{t.home.openWorkspace} <ChevronRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </section>

      <section className="grid gap-8 rounded-[1.75rem] bg-[#e8f1df] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-[#286344]"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.16em]">{t.brandName}</span></div>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#123b2b] sm:text-4xl">{t.home.ctaTitle}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c7261]">{t.home.ctaDesc}</p>
        </div>
        <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123b2b] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#286344]">{t.home.ctaBtn} <ArrowUpRight className="h-4 w-4" /></Link>
      </section>
    </main>
  );
}
