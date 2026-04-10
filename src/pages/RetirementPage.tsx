import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { 
  Palmtree, TrendingUp, Info, 
  Save, RefreshCcw 
} from 'lucide-react';

import { useCalculatorStore } from '../store/calculatorStore';
import { calcRetirementTarget, runSWPScenario } from '../utils/calculations';
import { formatCurrency, formatCompact } from '../utils/formatters';

import Input from '../components/ui/Input';
import RangeSlider from '../components/ui/RangeSlider';
import Button from '../components/ui/Button';
import MetricCard from '../components/ui/MetricCard';
import LineChart from '../components/ui/LineChart';

const retireSchema = z.object({
  currentAge: z.number().min(18).max(60),
  retireAge: z.number().min(30).max(85),
  monthlyExp: z.number().min(5000),
  inflation: z.number().min(0).max(15),
  preRetireReturn: z.number().min(1).max(30),
  postRetireReturn: z.number().min(1).max(20),
});

type RetireForm = z.infer<typeof retireSchema>;

const RetirementPage: React.FC = () => {
  const { retirementResult, setRetirementResult } = useCalculatorStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RetireForm>({
    resolver: zodResolver(retireSchema),
    defaultValues: {
      currentAge: 30,
      retireAge: 60,
      monthlyExp: 50000,
      inflation: 6,
      preRetireReturn: 12,
      postRetireReturn: 8,
    }
  });

  const formValues = watch();

  const calculate = (data: RetireForm) => {
    const yearsToRetire = data.retireAge - data.currentAge;
    const retireYears = 85 - data.retireAge; // Assume life expectancy 85
    
    // Monthly income needed at retirement age (inflated)
    const inflatedExp = data.monthlyExp * Math.pow(1 + data.inflation / 100, yearsToRetire);
    
    // Find corpus needed
    const corpusNeeded = calcRetirementTarget(
      inflatedExp, 
      data.postRetireReturn, 
      retireYears, 
      data.inflation
    );

    // Get the depletion projection
    const projection = runSWPScenario(
      corpusNeeded, 
      inflatedExp, 
      data.postRetireReturn, 
      retireYears, 
      data.inflation
    );

    setRetirementResult({
      corpusRequired: corpusNeeded,
      monthlySavingsRequired: 0, // Simplified for now
      retirementYear: new Date().getFullYear() + yearsToRetire,
      yearlyData: projection.yearlyData
    });
  };

  React.useEffect(() => {
    calculate(formValues);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
      <Helmet>
        <title>Retirement Calculator India 2025 – Plan Your Corpus & Financial Freedom | Finlytic</title>
        <meta name="description" content="Calculate how much retirement corpus you need in India. Factor in inflation, post-retirement expenses, life expectancy, and existing savings to plan your financial freedom." />
        <meta name="keywords" content="retirement calculator India, retirement planning calculator, retirement corpus calculator, pension planner India, FIRE calculator, financial independence calculator 2025, retirement fund India" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/retirement" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/retirement" />
        <meta property="og:title" content="Retirement Calculator India – How Much Do You Need to Retire?" />
        <meta property="og:description" content="Plan your retirement corpus with India's best retirement calculator. Accounts for inflation, expenses, and life expectancy." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Retirement Corpus Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate the exact retirement corpus needed to sustain your lifestyle in India." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "Retirement Calculator", "item": "https://finlytic.in/retirement" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic Retirement Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Calculate the retirement corpus needed based on inflation, expenses, and post-retirement income.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "How much money do I need to retire in India?", "acceptedAnswer": { "@type": "Answer", "text": "The amount depends on your monthly expenses, inflation rate, and number of years in retirement. A common rule is 25x your annual expenses (the 4% rule), adjusted for India's higher inflation." }},
              { "@type": "Question", "name": "What is a retirement corpus?", "acceptedAnswer": { "@type": "Answer", "text": "A retirement corpus is the total savings/investments needed at retirement to sustain your lifestyle without active income for the rest of your life." }}
            ]}
          ]
        })}</script>
      </Helmet>
      <div className="w-full lg:w-[380px] space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6 text-amber-500">
            <Palmtree className="w-5 h-5" />
            <h3 className="text-lg font-bold font-sora">Retirement Profile</h3>
          </div>

          <form onSubmit={handleSubmit(calculate)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Current Age"
                type="number"
                {...register('currentAge', { valueAsNumber: true })}
                error={errors.currentAge?.message}
              />
              <Input
                label="Retire Age"
                type="number"
                {...register('retireAge', { valueAsNumber: true })}
                error={errors.retireAge?.message}
              />
            </div>

            <Input
              label="Monthly Expenses"
              type="number"
              prefix="₹"
              {...register('monthlyExp', { valueAsNumber: true })}
              error={errors.monthlyExp?.message}
            />

            <RangeSlider
              label="Inflation Rate (%)"
              min={0}
              max={15}
              suffix="%"
              value={formValues.inflation}
              onChange={(v) => setValue('inflation', v)}
            />

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-16 space-y-4">
              <RangeSlider
                label="Post-Retire Return (%)"
                min={1}
                max={20}
                suffix="%"
                value={formValues.postRetireReturn}
                onChange={(v) => setValue('postRetireReturn', v)}
              />
            </div>

            <Button type="submit" variant="teal" className="w-full" icon={<RefreshCcw className="w-4 h-4" />}>
              Estimate Corpus
            </Button>
          </form>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard
            label="Target Corpus Required"
            prefix="₹"
            value={formatCompact(retirementResult?.corpusRequired || 0)}
            variant="blue"
            subtext={`Required by year ${retirementResult?.retirementYear}`}
          />
          <MetricCard
            label="Monthly Income (Inflated)"
            prefix="₹"
            value={formatCompact(
               formValues.monthlyExp * Math.pow(1 + formValues.inflation / 100, formValues.retireAge - formValues.currentAge)
            )}
            variant="green"
            subtext={`Equivalent of ₹${formatCompact(formValues.monthlyExp)} today`}
          />
        </div>

        <div className="card p-6 h-[400px]">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Post-Retirement Corpus Depletion
          </h4>
          <div className="h-80">
            <LineChart
              labels={retirementResult?.yearlyData.map(d => `Age ${formValues.retireAge + d.year}`) || []}
              datasets={[
                {
                  label: 'Retirement Fund',
                  data: retirementResult?.yearlyData.map(d => d.balance) || [],
                  color: '#3557ff'
                }
              ]}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RetirementPage;

