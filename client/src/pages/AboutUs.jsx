import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";

// ─── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: "12,000+", label: "Recipes shared" },
  { value: "4,800+", label: "Home cooks" },
  { value: "98",     label: "Countries represented" },
  { value: "4.8★",   label: "Average recipe rating" },
];

const values = [
  {
    icon: "🍳",
    title: "Real food from real kitchens",
    body:
      "Every recipe on flavorfind comes from someone's actual kitchen — not a test lab or a brand deal. We believe the best recipes are the ones passed down, iterated on, and cooked with love.",
  },
  {
    icon: "🌍",
    title: "Food has no borders",
    body:
      "From adobo to zwetschgenkuchen, we celebrate every cuisine equally. Our community spans nearly 100 countries, and we think that breadth makes every recipe better.",
  },
  {
    icon: "🤝",
    title: "Generosity by default",
    body:
      "Sharing a recipe is an act of trust. We protect that — no ads cluttering the experience, no upselling, no paywalls on the good stuff. Just recipes, freely given.",
  },
];

const team = [
  {
    initials: "AV",
    name: "Ana Vega",
    role: "Co-founder & Head of Community",
    bio: "Former restaurant chef turned product builder. Ana ensures every feature we ship makes the cooking experience better, not just the metrics.",
  },
  {
    initials: "JK",
    name: "Jonas Kim",
    role: "Co-founder & Engineering",
    bio: "Built his first recipe app to solve a real problem: losing his grandmother's handwritten cards. That itch never went away.",
  },
  {
    initials: "PR",
    name: "Priya Rao",
    role: "Design & Brand",
    bio: "Believes great design should feel inevitable in hindsight. Responsible for everything that makes flavorfind feel like flavorfind.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function StatCard({ value, label }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex flex-col items-center text-center">
      <span className="text-3xl font-bold text-orange-500 leading-none mb-1">
        {value}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

function ValueCard({ icon, title, body }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <span className="text-3xl mb-4 block">{icon}</span>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
    </div>
  );
}

function TeamCard({ initials, name, role, bio }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-orange-500 font-medium">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#faf7f2] font-sans">

        {/* ── Hero ── */}
        <div className="w-full relative overflow-hidden" style={{ height: "380px" }}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80"
            alt="Hands preparing food together"
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
          <div
            className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 animate-title-reveal"
            style={{ maxWidth: "1280px", margin: "0 auto", left: 0, right: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-widest mb-3 bg-orange-500 px-3 py-1 rounded-full w-fit">
              ✦ Our story
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ maxWidth: "560px" }}>
              Built by cooks, for cooks
            </h1>
            <p className="text-white/70 text-base" style={{ maxWidth: "460px" }}>
              flavorfind started as a shared notes folder between two friends who
              couldn't stop losing their favorite recipes. It grew into something
              we never expected.
            </p>
          </div>
        </div>

        {/* ── Main ── */}
        <main
          className="mx-auto px-7 pt-10 pb-16 w-full animate-fade-in-up"
          style={{ maxWidth: "1280px" }}
        >

          {/* ── Stats ── */}
          <section className="mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </section>

          {/* ── Mission ── */}
          <section className="mb-14">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4 bg-orange-50 px-3 py-1 rounded-full w-fit">
                  ✦ Our mission
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                  Make home cooking feel less like a chore and more like a conversation
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  The internet is full of recipes buried under ads, life stories,
                  and affiliate disclaimers. We built flavorfind because we wanted
                  a place where the recipe is the point — and the community around
                  it makes it better.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Today, tens of thousands of home cooks share, save, and improve
                  recipes together on flavorfind. Every rating, review, and tweak
                  makes the collection smarter. That's the product we set out to
                  build, and we're just getting started.
                </p>
              </div>
              <div className="flex-shrink-0 lg:w-56">
                <img
                  src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80"
                  alt="Home cook in kitchen"
                  className="w-full rounded-xl object-cover"
                  style={{ height: "220px" }}
                />
              </div>
            </div>
          </section>

          {/* ── Values ── */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>✦</span> What we stand for
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((v) => (
                <ValueCard key={v.title} {...v} />
              ))}
            </div>
          </section>

          {/* ── Team ── */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-2 0" />
                </svg>
                The team
              </h2>
              <span className="text-sm text-gray-400 hidden sm:block">Small, opinionated, food-obsessed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {team.map((t) => (
                <TeamCard key={t.name} {...t} />
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section>
            <div className="bg-orange-500 rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Ready to start cooking?
                </h2>
                <p className="text-orange-100 text-sm">
                  Join thousands of home cooks sharing what they love to make.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => navigate("/home")}
                  className="px-6 py-2.5 bg-white text-orange-500 text-sm font-semibold rounded-full hover:bg-orange-50 transition-colors"
                >
                  Browse Recipes
                </button>
                <button
                  onClick={() => navigate("/addrecipe")}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 transition-colors text-white text-sm font-semibold rounded-full border border-orange-400"
                >
                  + Share a Recipe
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}