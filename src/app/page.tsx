/* ============================================================
   Meridian — Landing Page
   Premium hero with interactive body map preview, feature
   showcase, social proof, and clear CTAs.
   ============================================================ */
import Link from "next/link";

/** Animated body silhouette SVG for the hero section */
function BodySilhouette() {
  return (
    <svg
      viewBox="0 0 200 440"
      className="w-full max-w-[280px] mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body outline */}
      <path
        d="M100 30 C85 30 75 45 75 55 C75 65 85 75 100 75 C115 75 125 65 125 55 C125 45 115 30 100 30Z"
        className="fill-primary-200/50 stroke-primary-400"
        strokeWidth="1.5"
      />
      <path
        d="M80 80 L70 84 L55 110 L50 150 L60 152 L70 120 L80 100 L80 80Z"
        className="fill-primary-200/30 stroke-primary-400"
        strokeWidth="1.5"
      />
      <path
        d="M120 80 L130 84 L145 110 L150 150 L140 152 L130 120 L120 100 L120 80Z"
        className="fill-primary-200/30 stroke-primary-400"
        strokeWidth="1.5"
      />
      <path
        d="M82 78 L80 100 L78 160 L75 200 L78 260 L72 340 L68 400 L80 405 L90 340 L95 270 L100 260 L105 270 L110 340 L120 405 L132 400 L128 340 L122 260 L125 200 L122 160 L120 100 L118 78 L100 85Z"
        className="fill-primary-200/30 stroke-primary-400"
        strokeWidth="1.5"
      />
      {/* Animated insight markers */}
      <circle cx="100" cy="52" r="6" className="fill-accent-400 pulse-glow" opacity="0.9">
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="88" cy="140" r="5" className="fill-danger-500" opacity="0.7">
        <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="78" cy="230" r="5" className="fill-warning-500" opacity="0.7">
        <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Connection lines between markers */}
      <line x1="100" y1="58" x2="88" y2="134" className="stroke-accent-300" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="88" y1="146" x2="78" y2="224" className="stroke-warning-300" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1.2s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

/** Feature card component */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-neutral-200/50 shadow-sm hover:shadow-lg hover:border-primary-300/50 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/** Metric display for social proof */
function MetricPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-3">
      <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-gradient-mesh">
      {/* ---- Navigation Bar ---- */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L12 22M2 12L22 12M5 5L19 19M19 5L5 19" opacity="0.3" />
                <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
                <circle cx="12" cy="4" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="12" cy="20" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="4" cy="12" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="20" cy="12" r="1.5" fill="white" stroke="none" opacity="0.6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-neutral-800 tracking-tight">
              Meridian
            </span>
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
            <a href="#insights" className="hover:text-primary-600 transition-colors">AI Insights</a>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:inline-flex text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              Get Started
              <svg className="ml-1.5 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/60 border border-primary-200/50 text-primary-700 text-xs font-semibold mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              AI-POWERED HEALTH INTELLIGENCE
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-[1.1] tracking-tight mb-6">
              Your body is
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"> talking.</span>
              <br />
              Learn to
              <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent"> listen.</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Meridian correlates your sleep, food, stress, exercise, and symptoms
              to reveal patterns you&apos;d never find alone. Powered by AI that gets
              smarter with every entry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
              >
                Start Free Journal
                <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-neutral-600 bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 transition-all duration-200"
              >
                See How it Works
              </a>
            </div>
            {/* Trust pill */}
            <p className="mt-6 text-xs text-neutral-400 flex items-center gap-1.5 justify-center lg:justify-start">
              <svg className="w-4 h-4 text-success-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required · Private & encrypted · HIPAA-aware
            </p>
          </div>

          {/* Right: Body Map Preview */}
          <div className="relative flex justify-center animate-float">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-300/20 to-accent-300/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl">
              <BodySilhouette />
              {/* Floating insight cards */}
              <div className="absolute -right-4 top-16 sm:-right-8 bg-white rounded-xl shadow-lg p-3 border border-neutral-100 animate-slide-up max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center">
                    <span className="text-xs">🧠</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">AI Insight</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Headaches correlate 73% with nights under 6hrs sleep
                </p>
              </div>
              <div className="absolute -left-4 bottom-24 sm:-left-8 bg-white rounded-xl shadow-lg p-3 border border-neutral-100 animate-slide-up max-w-[170px]" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-warning-500/10 flex items-center justify-center">
                    <span className="text-xs">⚡</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">Pattern</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Back pain spikes 2 days after skipping exercise
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Social Proof Bar ---- */}
      <section className="py-8 border-y border-neutral-200/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-0 sm:divide-x divide-neutral-200">
          <MetricPill value="12+" label="Health Factors Tracked" />
          <MetricPill value="50+" label="Pattern Types Detected" />
          <MetricPill value="73%" label="Users Report Clarity" />
          <MetricPill value="<2min" label="Daily Logging Time" />
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Every signal. Every connection.
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Track the inputs your body receives and the outputs it produces.
              Meridian connects the dots that traditional trackers miss.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            <FeatureCard
              icon="🫁"
              title="Interactive Body Map"
              description="Tap exactly where it hurts. Visual symptom logging with precision pinpointing on an anatomical body map."
            />
            <FeatureCard
              icon="🧬"
              title="Multi-Factor Correlation"
              description="AI analyzes sleep, food, stress, exercise, weather, supplements, and more — finding connections across 12+ dimensions."
            />
            <FeatureCard
              icon="🔮"
              title="Predictive Insights"
              description="After learning your patterns, Meridian warns you before symptoms strike. 'Tomorrow is a high-risk migraine day.'"
            />
            <FeatureCard
              icon="📊"
              title="Visual Timeline"
              description="See your health story unfold with beautiful charts that reveal trends, cycles, and breakthrough moments."
            />
            <FeatureCard
              icon="🍽️"
              title="Meal & Supplement Tracking"
              description="Log what you eat and take. AI parses your entries and correlates specific foods with how you feel."
            />
            <FeatureCard
              icon="🔒"
              title="Private & Encrypted"
              description="Your health data never leaves your control. End-to-end encryption with zero third-party data sharing."
            />
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section id="how-it-works" className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Three minutes a day.<br />
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                A lifetime of clarity.
              </span>
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Log how you feel",
                description: "Tap the body map, slide the scales, jot a note. Under 2 minutes.",
                color: "from-primary-500 to-primary-600",
              },
              {
                step: "02",
                title: "AI finds the patterns",
                description: "Meridian correlates your data across time, finding patterns invisible to the human eye.",
                color: "from-accent-500 to-accent-600",
              },
              {
                step: "03",
                title: "Get actionable insights",
                description: "Receive personalized, evidence-backed insights that help you take control of your health.",
                color: "from-primary-500 to-accent-500",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start group"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- AI Insights Preview ---- */}
      <section id="insights" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              AI that actually understands
              <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent"> your body</span>
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Not generic advice. Personalized intelligence built from YOUR data.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Insight card mock 1 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-300 animate-pulse" />
                Correlation Detected
              </div>
              <h3 className="text-xl font-bold mb-2">Sleep + Headache Link</h3>
              <p className="text-primary-100 text-sm leading-relaxed mb-4">
                Your headaches are <strong className="text-white">73% correlated</strong> with nights
                where you sleep less than 6 hours. This pattern has been consistent
                over the last 23 entries.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[73%] bg-white/80 rounded-full" />
                </div>
                <span className="text-sm font-semibold">73%</span>
              </div>
            </div>
            {/* Insight card mock 2 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-200 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-300 animate-pulse" />
                Prediction
              </div>
              <h3 className="text-xl font-bold mb-2">Tomorrow&apos;s Forecast</h3>
              <p className="text-accent-100 text-sm leading-relaxed mb-4">
                Based on today&apos;s stress level (4/5) and last night&apos;s sleep (5.5hrs),
                there&apos;s a <strong className="text-white">moderate risk</strong> of migraine tomorrow.
                Consider extra hydration and early rest tonight.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-medium">💧 Hydrate</span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-medium">😴 Rest Early</span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-medium">🧘 Stretch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-10 sm:p-14 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-20 -mt-20 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start decoding your body today
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands who&apos;ve discovered the hidden patterns behind how they feel.
                Your first insight is just 7 entries away.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 text-base font-semibold text-neutral-900 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-neutral-50 transition-all duration-200"
              >
                Start Free — No Credit Card
                <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-10 px-4 border-t border-neutral-200/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-700">Meridian</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <span>© 2026 Meridian Health Inc.</span>
            <a href="#" className="hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
