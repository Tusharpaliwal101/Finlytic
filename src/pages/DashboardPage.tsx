import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Wallet, Target, 
  ArrowRight, ShieldCheck, Zap 
} from 'lucide-react';
import { useCalculatorStore } from '../store/calculatorStore';
import { formatCompact } from '../utils/formatters';
import { NAV_ITEMS } from '../constants';

const DashboardPage: React.FC = () => {
  const { sipResult, swpResult, goalResult } = useCalculatorStore();


  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="space-y-12">
      <Helmet>
        <title>Finlytic – Best Free Financial Calculators India 2025 | SIP, SWP, CAGR & More</title>
        <meta name="description" content="India's most advanced free financial calculator suite. Calculate SIP, SWP, Lumpsum, CAGR, Inflation impact, Goal SIP & Retirement corpus — all with charts, PDF export, and tax analysis." />
        <meta name="keywords" content="financial calculators India, free SIP calculator, SWP calculator, CAGR calculator, lumpsum calculator, retirement planner India, inflation calculator, goal based SIP, mutual fund tools 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/" />
        <meta property="og:title" content="Finlytic – Best Free Financial Calculators India 2025" />
        <meta property="og:description" content="Plan your wealth with India's most accurate SIP, SWP, CAGR, Lumpsum & retirement calculators. Free, instant, with charts and PDF export." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta property="og:site_name" content="Finlytic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Finlytic – Best Financial Calculators India" />
        <meta name="twitter:description" content="Free SIP, SWP, CAGR, Lumpsum, Retirement & Inflation calculators. India's #1 wealth planning tool." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "name": "Finlytic", "url": "https://finlytic.in/", "description": "India's best free financial calculator suite for SIP, SWP, CAGR, Lumpsum, and retirement planning.", "potentialAction": { "@type": "SearchAction", "target": "https://finlytic.in/search?q={search_term_string}", "query-input": "required name=search_term_string" }},
            { "@type": "Organization", "name": "Finlytic", "url": "https://finlytic.in/", "logo": "https://finlytic.in/favicon.svg", "sameAs": [] },
            { "@type": "ItemList", "name": "Financial Calculators", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "SIP Calculator", "url": "https://finlytic.in/sip" },
              { "@type": "ListItem", "position": 2, "name": "SWP Calculator", "url": "https://finlytic.in/swp" },
              { "@type": "ListItem", "position": 3, "name": "Lumpsum Calculator", "url": "https://finlytic.in/lumpsum" },
              { "@type": "ListItem", "position": 4, "name": "Goal SIP Calculator", "url": "https://finlytic.in/goal-sip" },
              { "@type": "ListItem", "position": 5, "name": "CAGR Calculator", "url": "https://finlytic.in/cagr" },
              { "@type": "ListItem", "position": 6, "name": "Inflation Calculator", "url": "https://finlytic.in/inflation" },
              { "@type": "ListItem", "position": 7, "name": "Retirement Calculator", "url": "https://finlytic.in/retirement" }
            ]}
          ]
        })}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-24 bg-gradient-to-br from-blue to-blue-dark p-8 lg:p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-md">
            <Zap className="w-4 h-4 text-green" />
            <span className="text-xs font-bold uppercase tracking-wider">Smart Analytics v2.0</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold font-sora leading-tight mb-6">
            The #1 SIP Calculator <br /> in India.
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Detailed compounding projections, LTCG tax calculations, and inflation-indexed goal planning.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/sip" 
              className="px-8 py-4 bg-green hover:bg-green-dark text-white rounded-16 font-bold transition-all flex items-center gap-2 shadow-xl shadow-green/20"
            >
              Start Calculating <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Abstract patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </section>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active SIP Portfolio</p>
          <p className="text-3xl font-bold font-numbers text-blue">
            ₹{formatCompact(sipResult?.totalValue || 0)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-green">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold">+12% vs last month</span>
          </div>
        </div>
        <div className="card p-6 border-none shadow-none bg-slate-100 dark:bg-slate-800 animate-pulse">
           {/* Placeholder for other live stats */}
        </div>
      </div>

      {/* Calculator Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-sora">Financial Calculators</h2>
          <span className="text-sm text-slate-500 font-medium tracking-tight italic uppercase">Total 7 Modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NAV_ITEMS.filter(n => n.path !== '/').map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className="group card p-6 hover:border-blue transition-all"
            >
              <div className="mb-4 text-slate-400 group-hover:text-blue transition-colors">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue transition-colors">{item.label}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                Simulate {item.label.toLowerCase()} with tax and inflation tracking.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 flex gap-6 items-start bg-slate-950 text-white">
          <div className="bg-blue/20 p-4 rounded-24">
            <ShieldCheck className="w-8 h-8 text-blue" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Your financial scenarios are encrypted and saved securely with Firebase on the cloud.
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default DashboardPage;

