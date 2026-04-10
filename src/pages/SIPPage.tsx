import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Calculator, PieChart as PieChartIcon, TrendingUp, 
  Save, RefreshCcw, Info 
} from 'lucide-react';

import { useCalculatorStore } from '../store/calculatorStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePolicyStore } from '../store/policyStore';
import { runSIPScenario, calcLTCG_SIP } from '../utils/calculations';
import { formatCurrency, formatCompact } from '../utils/formatters';
import { exportToExcel, exportToPDF } from '../utils/exports';
import { PRESET_RATES } from '../constants';

// UI Components
import Input from '../components/ui/Input';
import RangeSlider from '../components/ui/RangeSlider';
import PresetButtons from '../components/ui/PresetButtons';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import MetricCard from '../components/ui/MetricCard';
import DonutChart from '../components/ui/DonutChart';
import LineChart from '../components/ui/LineChart';
import DataTable from '../components/ui/DataTable';
import ExportRow from '../components/ui/ExportRow';
import Tooltip from '../components/ui/Tooltip';

const sipSchema = z.object({
  monthly: z.number().min(100),
  rate: z.number().min(1).max(30),
  years: z.number().min(1).max(50),
  stepup: z.number().min(0).max(50),
});

type SIPForm = z.infer<typeof sipSchema>;

const SIPPage: React.FC = () => {
  const { 
    sipResult, setSIPResult, 
    taxState, toggleTax, 
    mcState, toggleMC 
  } = useCalculatorStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SIPForm>({
    resolver: zodResolver(sipSchema),
    defaultValues: {
      monthly: 10000,
      rate: 12,
      years: 10,
      stepup: 0,
    }
  });

  const formValues = watch();

  const { user } = useAuthStore();
  const { savePolicy } = usePolicyStore();
  const navigate = useNavigate();

  const handleSave = () => {
    if (!user) {
      alert('Please login to save your scenarios.');
      navigate('/auth/login');
      return;
    }
    
    savePolicy({
      name: `SIP ${formatCurrency(sipResult?.totalValue || 0)}`,
      description: `Monthly: ${formValues.monthly}, Rate: ${formValues.rate}%, Years: ${formValues.years}`,
      type: 'SIP',
      data: { ...formValues, result: sipResult },
      effectiveDate: new Date().toLocaleDateString()
    }, user.id);
  };

  const calculate = (data: SIPForm) => {
    const result = runSIPScenario(data.monthly, data.rate, data.years, data.stepup);
    setSIPResult(result);
  };

  // Auto-calculate on mount
  React.useEffect(() => {
    calculate(formValues);
  }, []);

  const totalInvestment = sipResult?.totalInvestment || 0;
  const preTaxReturns = sipResult?.totalReturns || 0;
  const ltcgTax = calcLTCG_SIP(sipResult?.totalValue || 0, totalInvestment);
  const isTax = taxState.sip;

  const netReturns = isTax ? Math.max(0, preTaxReturns - ltcgTax) : preTaxReturns;
  const netValue = totalInvestment + netReturns;
  
  const growthMultiple = totalInvestment > 0 ? (netValue / totalInvestment).toFixed(2) : "0.00";
  const returnPercentage = totalInvestment > 0 ? ((netReturns / totalInvestment) * 100).toFixed(2) : "0.00";

  const handleExportExcel = () => {
    if (!sipResult) return;
    const data = sipResult.yearlyData.map(d => ({
      Year: `Yr ${d.year}`,
      'Total Investment': `₹${formatCurrency(d.totalInvestment)}`,
      'Returns': `₹${formatCurrency(d.returns)}`,
      'Balance': `₹${formatCurrency(d.balance)}`,
    }));
    exportToExcel(data, `Finlytic_SIP_Schedule`);
  };

  const handleExportPDF = () => {
    if (!sipResult) return;
    const headers = [['Year', 'Total Investment', 'Returns', 'Balance']];
    const data = sipResult.yearlyData.map(d => [
      `Yr ${d.year}`,
      `Rs. ${formatCurrency(d.totalInvestment)}`,
      `Rs. ${formatCurrency(d.returns)}`,
      `Rs. ${formatCurrency(d.balance)}`,
    ]);
    exportToPDF(
      'SIP Investment Schedule',
      headers,
      data,
      'Finlytic_SIP_Schedule',
      [
        { label: 'Total Invested', value: `Rs. ${formatCurrency(totalInvestment)}` },
        { label: 'Future Value', value: `Rs. ${formatCurrency(netValue)}` },
        { label: 'Monthly SIP', value: `Rs. ${formatCurrency(formValues.monthly)}` },
        { label: 'Expected Return', value: `${formValues.rate}% p.a.` }
      ]
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
      <Helmet>
        <title>SIP Calculator India 2025 – Mutual Fund Returns & Step-up Planner | Finlytic</title>
        <meta name="description" content="Calculate SIP returns with India's most accurate SIP calculator. Supports annual step-up, LTCG tax, Monte Carlo simulation & inflation-adjusted wealth projection." />
        <meta name="keywords" content="SIP calculator India, systematic investment plan calculator, mutual fund SIP returns, monthly SIP calculator, step-up SIP, LTCG tax calculator, compounding wealth calculator, SIP 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/sip" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/sip" />
        <meta property="og:title" content="SIP Calculator India – Best Mutual Fund Return Estimator" />
        <meta property="og:description" content="Plan your SIP investments with step-up, inflation & LTCG tax. India's most advanced SIP calculator." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SIP Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate mutual fund SIP returns with step-up, inflation & tax analysis." />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
                { "@type": "ListItem", "position": 2, "name": "SIP Calculator", "item": "https://finlytic.in/sip" }
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": "Finlytic SIP Calculator",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "description": "Calculate the future value of your monthly SIP investments with step-up and LTCG tax analysis.",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is an SIP calculator?",
                  "acceptedAnswer": { "@type": "Answer", "text": "An SIP calculator estimates the future value of periodic mutual fund investments considering rate of return and compounding." }
                },
                {
                  "@type": "Question",
                  "name": "How does step-up SIP work?",
                  "acceptedAnswer": { "@type": "Answer", "text": "A step-up SIP increases your monthly investment by a fixed percentage every year, accelerating wealth creation." }
                }
              ]
            }
          ]
        })}</script>
      </Helmet>
      {/* Left: Inputs */}
      <div className="w-full lg:w-[380px] space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6 text-blue">
            <Calculator className="w-5 h-5" />
            <h3 className="text-lg font-bold font-sora">SIP Parameters</h3>
          </div>

          <form onSubmit={handleSubmit(calculate)} className="space-y-6">
            <Input
              label="Monthly Investment"
              type="number"
              prefix="₹"
              {...register('monthly', { valueAsNumber: true })}
              error={errors.monthly?.message}
            />
            
            <RangeSlider
              label="Return Rate (p.a.)"
              min={1}
              max={30}
              suffix="%"
              value={formValues.rate}
              onChange={(v) => setValue('rate', v)}
            />
            <PresetButtons
              presets={PRESET_RATES}
              currentValue={formValues.rate}
              onSelect={(v) => setValue('rate', v)}
            />

            <RangeSlider
              label="Time Period (Years)"
              min={1}
              max={50}
              suffix=" Yrs"
              value={formValues.years}
              onChange={(v) => setValue('years', v)}
            />

            <RangeSlider
              label="Annual Step-up (%)"
              min={0}
              max={50}
              suffix="%"
              value={formValues.stepup}
              onChange={(v) => setValue('stepup', v)}
            />

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Toggle
                label="Post-tax Value (LTCG)"
                enabled={taxState.sip}
                onChange={() => toggleTax('sip')}
                variant="green"
              />
              <Toggle
                label="Monte Carlo Projection"
                enabled={mcState.sip}
                onChange={() => toggleMC('sip')}
                variant="blue"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" icon={<RefreshCcw className="w-4 h-4" />}>
                Calculate
              </Button>
              <Button 
                variant="secondary" 
                className="px-4"
                onClick={handleSave}
              >
                <Save className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Results */}
      <div className="flex-1 space-y-6">
        <div className={`grid gap-4 mb-6 ${taxState.sip ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'}`}>
          <MetricCard
            label="Future Value"
            prefix="₹"
            value={formatCurrency(netValue)}
            variant="blue"
            subtext={`After ${formValues.years} years`}
          />
          <MetricCard
            label="Total Invested"
            prefix="₹"
            value={formatCurrency(totalInvestment)}
            variant="green"
            subtext="Cumulative SIP"
          />
          <MetricCard
            label="Wealth Gained"
            prefix="₹"
            value={formatCurrency(netReturns)}
            variant="green"
            subtext={`${returnPercentage}% returns`}
          />
          <MetricCard
            label="Growth Multiple"
            value={`${growthMultiple}x`}
            variant="amber"
            subtext="Capital multiplied"
          />
          {taxState.sip && (
            <MetricCard
              label="LTCG Tax Paid"
              prefix="₹"
              value={formatCurrency(ltcgTax)}
              variant="amber"
              subtext="12.5% on gains > ₹1.25L"
            />
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Asset Allocation
            </h4>
            <DonutChart
              data={[sipResult?.totalInvestment || 0, sipResult?.totalReturns || 0]}
              labels={['Invested Amount', 'Est. Returns']}
              colors={['#3557ff', '#00c9a7']}
              centerLabel="Total Portfolio"
              centerValue={`₹${formatCompact(sipResult?.totalValue || 0)}`}
            />
          </div>

          <div className="card p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth Curve
            </h4>
            <div className="h-64">
              <LineChart
                labels={sipResult?.yearlyData.map(d => `Yr ${d.year}`) || []}
                datasets={[
                  {
                    label: 'Portfolio Value',
                    data: sipResult?.yearlyData.map(d => d.balance) || [],
                    color: '#3557ff'
                  }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Yearly Breakdown
            </h4>
            <ExportRow onExcel={handleExportExcel} onPdf={handleExportPDF} />
          </div>
          <DataTable
            columns={[
              { header: 'Year', accessor: 'year' },
              { header: 'Investment', accessor: 'formattedInvestment', isNumeric: true },
              { header: 'Returns', accessor: 'formattedReturns', isNumeric: true },
              { header: 'Balance', accessor: 'formattedBalance', isNumeric: true },
            ]}
            data={sipResult?.yearlyData.map(d => ({
              ...d,
              formattedInvestment: `₹${formatCurrency(d.totalInvestment)}`,
              formattedReturns: `₹${formatCurrency(d.returns)}`,
              formattedBalance: `₹${formatCurrency(d.balance)}`,
            })) || []}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default SIPPage;

