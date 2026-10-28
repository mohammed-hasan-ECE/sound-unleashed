import { Users, Target, Rocket, List, ExternalLink, Search } from 'lucide-react'

const team = [
  {
    initials: 'KH',
    name: 'Khaleel Jahir Hussain',
    role: 'Project Coordination & Business Concept',
    note: 'Coordinating the project direction and helping define the business concept.',
  },
  {
    initials: 'MH',
    name: 'Mohammed Hasan',
    role: 'UI/UX Design & Frontend Prototype',
    note: "Contributing to the website's interface design and frontend prototype.",
  },
  {
    initials: 'J',
    name: 'Jitesh',
    role: 'Product Research & Dealer Catalogue',
    note: 'Helping organise instrument categories and product information for the catalogue.',
  },
  {
    initials: 'P',
    name: 'Pravan',
    role: 'Content, Functional Testing & Presentation',
    note: 'Helping prepare project content, test the prototype, and organise its presentation.',
  },
]

export function AboutPage() {
  return (
    <div className="flex w-full flex-col gap-16 md:gap-20">
      {/* ============ 1. ABOUT US HERO ============ */}
      <section className="hero-surface rounded-3xl">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center sm:px-10 sm:py-16">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl">
            About Us
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            Sound Unleashed is a proposed music equipment discovery and retailer-referral
            platform designed to help musicians explore instruments, compare dealer
            listings, and discover equipment suited to their musical interests. Our
            project focuses on presenting a simple and accessible digital experience
            that connects customers with existing retailers.
          </p>
        </div>
      </section>

      {/* ============ 2. VISION & MISSION ============ */}
      <section className="flex flex-col gap-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-heading">
          Our Vision & Mission
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender">
                <Target className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading">The Challenge</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Musicians and producers often face challenges when researching instruments
              and audio equipment. Finding the right gear requires extensive searching
              across multiple retailer websites, comparing prices, and navigating
              scattered information.
            </p>
          </div>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender">
                <Rocket className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading">Our Solution</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sound Unleashed simplifies the discovery process by organizing instruments
              and equipment into clear categories, providing curated recommendations,
              and directing users to trusted retailers for purchase.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 3. HOW IT WORKS ============ */}
      <section className="rounded-3xl bg-lavender-soft p-8 md:p-12">
        <h2 className="text-center text-3xl font-bold tracking-tight text-heading">
          How It Works
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: List,
              step: '1',
              title: 'Explore',
              text: 'Browse instruments, audio equipment, and accessories in our carefully organized catalogue.',
            },
            {
              icon: Search,
              step: '2',
              title: 'Compare',
              text: 'Review specifications and compare available offers from multiple retailers.',
            },
            {
              icon: ExternalLink,
              step: '3',
              title: 'Visit Dealer',
              text: "Visit the retailer's external website to check latest details or make a purchase.",
            },
          ].map(({ icon: Icon, step, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-card"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender">
                <Icon className="h-6 w-6 text-brand-primary" />
                <span className="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/3 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                  {step}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-semibold text-heading">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 4. MEET OUR TEAM ============ */}
      <section className="flex flex-col gap-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-heading">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {team.map(({ initials, name, role, note }) => (
            <div
              key={name}
              className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-shadow hover:shadow-card-lg"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white">
                {initials}
              </div>
              <h3 className="mt-1 text-base font-semibold text-heading">{name}</h3>
              <p className="text-xs font-medium text-brand-primary">{role}</p>
              <p className="mx-auto max-w-[26ch] text-xs leading-relaxed text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 5. IMPORTANT NOTE ============ */}
      <section className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-lavender-soft p-8 text-center sm:p-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card shadow-card">
            <Users className="h-5 w-5 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-heading">
            Important Note
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sound Unleashed is a proposed business model and college prototype project.
            Actual purchases happen on external retailer websites. This platform does
            not operate as an independent retailer and does not have its own inventory
            or commercial operations.
          </p>
        </div>
      </section>
    </div>
  )
}
