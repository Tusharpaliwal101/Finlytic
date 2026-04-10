import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { 
  Calculator, LineChart as LineIcon, CheckCircle2, AlertTriangle, Info,
  Save, FileSpreadsheet, FileText 
} from 'lucide-react';

import { useCalculatorStore } from '../store/calculatorStore';
import { runSWPWithAnnualLTCG } from '../utils/calculations';
import { formatCurrency, formatCompact } from '../utils/formatters';

import Input from '../components/ui/Input';
import RangeSlider from '../components/ui/RangeSlider';
import Toggle from '../components/ui/Toggle';
import MetricCard from '../components/ui/MetricCard';
import LineChart from '../components/ui/LineChart';
import DonutChart from '../components/ui/DonutChart';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import { exportToExcel, exportToPDF } from '../utils/exports';

const swpSchema = z.object({
  corpus: z.number().min(10000),
  withdrawal: z.number().min(500),
  rate: z.number().min(1).max(30),
  years: z.number().min(1).max(50),
  inflation: z.number().min(0).max(15),
});

type SWPForm = z.infer<typeof swpSchema>;

const PRESETS = [
  { label: 'Conservative', rate: 8, color: 'bg-green' },
  { label: 'Balanced', rate: 10, color: 'bg-warning' },
  { label: 'Aggressive', rate: 13, color: 'bg-error' }
];

const SWPPage: React.FC = () => {
  const { 
    swpResult, setSWPResult, 
    taxState, toggleTax 
  } = useCalculatorStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SWPForm>({
    resolver: zodResolver(swpSchema),
    defaultValues: {
      corpus: 50000000, // Matching the 5 Crores from screenshot
      withdrawal: 60000,
      rate: 10,
      years: 20,
      inflation: 6,
    }
  });

  const formValues = watch();

  const calculate = (data: SWPForm) => {
    const result = runSWPWithAnnualLTCG(
      data.corpus, data.withdrawal, data.rate, data.years, data.inflation
    );
    setSWPResult(result);
  };

  useEffect(() => {
    calculate(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.corpus, formValues.withdrawal, formValues.rate, formValues.years, formValues.inflation]);

  const yearlyData = swpResult?.yearlyData || [];
  const finalValue = Math.max(0, swpResult?.finalValue || 0);
  const totalWithdrawal = swpResult?.totalWithdrawal || 0;
  const totalTaxPaid = swpResult?.totalTaxPaid || 0;

  const handleExportExcel = () => {
    if (yearlyData.length === 0) return;
    const exportData = yearlyData.map((d, i) => {
      const cumulativeWd = yearlyData.slice(0, i + 1).reduce((sum, curr) => sum + (curr?.withdrawal || 0), 0);
      return {
        Year: d.year,
        'Monthly W/D': d.withdrawal / 12,
        'Total W/D': cumulativeWd,
        'Taxable Gain': d.taxableGain,
        'Tax Paid': d.taxPaid,
        'Corpus': d.balance,
      };
    });
    exportToExcel(exportData, 'SWP-Corpus-Depletion');
  };

  const handleExportPDF = () => {
    if (yearlyData.length === 0) return;
    const headers = [['Year', 'Monthly W/D', 'Total W/D', 'Taxable Gain', 'Tax Paid', 'Corpus']];
    const data = yearlyData.map((d, i) => {
      const cumulativeWd = yearlyData.slice(0, i + 1).reduce((sum, curr) => sum + (curr?.withdrawal || 0), 0);
      return [
        d.year.toString(),
        `Rs. ${formatCurrency(d.withdrawal / 12)}`,
        `Rs. ${formatCurrency(cumulativeWd)}`,
        `Rs. ${formatCurrency(d.taxableGain)}`,
        `Rs. ${formatCurrency(d.taxPaid)}`,
        `Rs. ${formatCurrency(d.balance)}`
      ];
    });

    const summary = [
      { label: 'Initial Corpus', value: `Rs. ${formatCurrency(formValues.corpus)}` },
      { label: 'Withdrawal p.m.', value: `Rs. ${formatCurrency(formValues.withdrawal)}` },
      { label: 'Return Rate', value: `${formValues.rate}%` },
      { label: 'Duration', value: `${formValues.years} Years` },
    ];

    exportToPDF('SWP Projection', headers, data, 'SWP-Projection', summary);
  };

  const isHealthy = finalValue > 0;
  const lastYearWithdrawal = yearlyData.length > 0 
    ? (yearlyData[yearlyData.length - 1]?.withdrawal || formValues.withdrawal)
    : formValues.withdrawal;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
      <Helmet>
        <title>SWP Calculator India 2025 – Systematic Withdrawal Plan & Monthly Income | Finlytic</title>
        <meta name="description" content="Plan your retirement income with Finlytic's SWP calculator. Calculate how long your corpus lasts with monthly withdrawals, inflation, and tax adjustments. Free & accurate." />
        <meta name="keywords" content="SWP calculator, systematic withdrawal plan calculator, retirement income calculator, monthly withdrawal mutual fund, SWP tax calculator India, corpus withdrawal planner 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/swp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/swp" />
        <meta property="og:title" content="SWP Calculator – Plan Monthly Income from Mutual Funds" />
        <meta property="og:description" content="Calculate how long your savings last with systematic monthly withdrawals. India's best SWP planner." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SWP Calculator India | Finlytic" />
        <meta name="twitter:description" content="Plan monthly withdrawals from your corpus with tax & inflation analysis." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "SWP Calculator", "item": "https://finlytic.in/swp" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic SWP Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Calculate sustainable monthly withdrawal from investments with inflation and tax adjustment.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "What is an SWP calculator?", "acceptedAnswer": { "@type": "Answer", "text": "An SWP calculator helps you plan systematic monthly withdrawals from a mutual fund corpus, showing how long your savings will last." }},
              { "@type": "Question", "name": "Is SWP better than FD for retirement income?", "acceptedAnswer": { "@type": "Answer", "text": "SWP from equity mutual funds can be tax-efficient and inflation-beating compared to fixed deposits, especially for long retirement horizons." }}
            ]}
          ]
        })}</script>
      </Helmet>

      {/* Left Sidebar: Inputs */}
      <div className="w-full lg:w-[420px] space-y-6">
        <div className="card p-6 border-t-0 bg-slate-900 border border-slate-800">
          
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-sora">
              QUICK PRESETS (RETURN RATE)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setValue('rate', p.rate)}
                  className={`py-3 px-1 rounded-16 border-1.5 transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                    formValues.rate === p.rate 
                      ? 'border-blue bg-blue/10 shadow-sm shadow-blue/20' 
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
                    <span className="text-xs font-bold text-white font-sora">{p.label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{p.rate}% p.a.</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-sora">
            WITHDRAWAL DETAILS
          </label>

          <form className="space-y-6">
            <div className="relative">
              <Input
                label="INITIAL CORPUS"
                type="number"
                prefix="₹"
                className="font-sora uppercase text-xs"
                {...register('corpus', { valueAsNumber: true })}
                error={errors.corpus?.message}
              />
              <span className="absolute top-[2px] left-[110px] flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] cursor-help">?</span>
            </div>

            <Input
              label="MONTHLY WITHDRAWAL"
              type="number"
              prefix="₹"
              className="font-sora uppercase text-xs"
              {...register('withdrawal', { valueAsNumber: true })}
              error={errors.withdrawal?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="RETURN % P.A."
                type="number"
                suffix="%"
                className="font-sora uppercase text-xs"
                {...register('rate', { valueAsNumber: true })}
                error={errors.rate?.message}
              />
              <Input
                label="TIME PERIOD"
                type="number"
                suffix="Yrs"
                className="font-sora uppercase text-xs"
                {...register('years', { valueAsNumber: true })}
                error={errors.years?.message}
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sora">
                  INFLATION RATE: <span className="text-error">{formValues.inflation}%</span>
                </label>
              </div>
              <RangeSlider
                min={0}
                max={10}
                value={formValues.inflation}
                onChange={(v) => setValue('inflation', v)}
                hideLabels
              />
              <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-600">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>
          </form>
        </div>

        <div className="card p-6 border-t-0 bg-slate-900 border border-slate-800">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-sora">
            ADVANCED OPTIONS
          </label>
          <div className="p-4 rounded-16 border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-bold text-slate-200">🏦 Realistic Annual LTCG Tax</span>
                <span className="flex items-center justify-center w-3 h-3 rounded-full bg-slate-800 text-slate-400 text-[8px] cursor-help">?</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">12.5% on gains &gt; ₹1.25L - Applied annually</p>
            </div>
            <Toggle
              enabled={taxState.swp}
              onChange={() => toggleTax('swp')}
              variant="green"
            />
          </div>
        </div>

        {/* QUICK SUMMARY (Moved to Left Sidebar) */}
        <div className="card p-6 bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              QUICK SUMMARY
            </h4>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Initial Corpus</span>
                <span className="text-white font-numbers font-bold">₹{formatCurrency(formValues.corpus)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Final Corpus</span>
                <span className="text-green font-numbers font-bold">₹{formatCurrency(finalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Withdrawn</span>
                <span className="text-blue font-numbers font-bold">₹{formatCurrency(totalWithdrawal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <span className={`${isHealthy ? 'text-green' : 'text-error'} font-numbers font-bold`}>{isHealthy ? 'Active' : 'Depleted'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total LTCG Tax Paid</span>
                <span className="text-warning font-numbers font-bold">₹{formatCurrency(totalTaxPaid)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <hr className="border-slate-800 mb-6" />
            <Button type="button" className="w-full bg-[#00c9a7] text-white hover:bg-[#00ca97]/90 shadow-sm border-none" size="lg" icon={<Save className="w-4 h-4" />}>
              Save as Policy
            </Button>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button type="button" onClick={handleExportExcel} className="h-11 px-6 text-sm flex items-center justify-center gap-2 rounded-10 font-semibold transition-all active:scale-[0.98] border border-[#00c9a7]/30 bg-[#00c9a7]/5 text-[#00c9a7] hover:bg-[#00c9a7] hover:text-white group-hover:text-white">
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </button>
              <button type="button" onClick={handleExportPDF} className="h-11 px-6 text-sm flex items-center justify-center gap-2 rounded-10 font-semibold transition-all active:scale-[0.98] border border-error/30 bg-error/5 text-error hover:bg-error hover:text-white group-hover:text-white">
                <FileText className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Results */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora pt-1">
            RESULTS
          </h2>
          {taxState.swp && (
            <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-[10px] font-bold uppercase tracking-wider font-sora">
              AFTER LTCG TAX
            </span>
          )}
        </div>

        {/* Big Central Donut Chart Card */}
        <div className="card p-6 border-t-[4px] border-t-blue bg-slate-900 border border-slate-800 shadow-xl relative min-h-[300px] flex items-center justify-center lg:justify-start lg:pl-10">
          <h3 className="absolute top-6 left-6 text-sm font-bold text-slate-200 flex items-center gap-2 font-sora">
            <Calculator className="w-4 h-4 text-slate-400" />
            ASSET ALLOCATION
          </h3>
          <div className="w-[240px] h-[240px] relative mt-10">
            <DonutChart
              data={[finalValue, totalWithdrawal]}
              labels={['Remaining Corpus', 'Total Withdrawn']}
              colors={['#00c9a7', '#ffffff']}
              centerLabel="Remaining"
              centerValue={`₹${formatCurrency(finalValue)}`}
              hideLegend={true}
            />
          </div>
          
          <div className="hidden lg:flex flex-col gap-6 ml-auto mr-12 text-right">
            <div>
              <div className="flex items-center justify-end gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm bg-green"></div>
                <span className="text-sm font-medium text-slate-400 font-sora tracking-tight">Remaining Corpus</span>
              </div>
              <p className="text-2xl font-bold text-green font-numbers">
                ₹{formatCurrency(finalValue)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-end gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm bg-white"></div>
                <span className="text-sm font-medium text-slate-400 font-sora tracking-tight">Total Withdrawn</span>
              </div>
              <p className="text-xl font-bold text-white font-numbers">
                ₹{formatCurrency(totalWithdrawal)}
              </p>
            </div>
          </div>
        </div>

        {/* 3x2 Grid for Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard
            label="FINAL CORPUS"
            prefix="₹"
            value={formatCurrency(finalValue)}
            variant="green"
            subtext={isHealthy ? 'Active' : 'Depleted'}
          />
          <MetricCard
            label="TOTAL WITHDRAWN"
            prefix="₹"
            value={formatCurrency(totalWithdrawal)}
            variant="blue"
            subtext={`Over ${formValues.years} years`}
          />
          <div className="card p-6 border-t-[4px] border-t-green bg-slate-900 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sora">
              STATUS
            </p>
            <div className="flex items-center gap-2 mb-1">
              {isHealthy ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green" />
                  <h4 className="text-2xl font-bold text-green font-sora tracking-tight">Healthy</h4>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-error" />
                  <h4 className="text-2xl font-bold text-error font-sora tracking-tight">Depleted</h4>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isHealthy ? 'Corpus sustained' : 'Funds exhausted early'}
            </p>
          </div>

          <MetricCard
            label="POST-TAX CORPUS"
            prefix="₹"
            value={formatCurrency(finalValue)}
            variant="blue"
            subtext="After annual LTCG"
          />
          <MetricCard
            label={`YEAR-${formValues.years} WITHDRAWAL`}
            prefix="₹"
            value={formatCurrency(lastYearWithdrawal)}
            variant="amber"
            subtext="Inflation-adjusted"
          />
          <MetricCard
            label="TOTAL LTCG TAX PAID"
            prefix="₹"
            value={formatCurrency(totalTaxPaid)}
            variant="amber"
            subtext="12.5% annually on gains > ₹1.25L"
          />
        </div>

        {/* Line Chart Section */}
        <div className="card p-6 bg-slate-900 border border-slate-800">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center lg:justify-start gap-6 font-sora">
            <span className="flex items-center gap-2 text-green">
              <span className="w-3 h-3 border-2 border-green"></span> Corpus Remaining
            </span>
            <span className="flex items-center gap-2 text-blue">
              <span className="w-3 h-3 border-2 border-blue border-dashed"></span> Total Withdrawn
            </span>
            {taxState.swp && (
              <span className="flex items-center gap-2 text-warning">
                <span className="w-3 h-3 border-2 border-warning border-dotted"></span> Cumulative Tax Paid
              </span>
            )}
          </h4>
          <div className="h-64">
            <LineChart
              labels={yearlyData.map(d => `Yr ${d.year}`)}
              datasets={[
                {
                  label: 'Remaining Corpus',
                  data: yearlyData.map(d => d.balance || 0),
                  color: '#00c9a7'
                },
                {
                  label: 'Cumulative Withdrawal',
                  data: yearlyData.map((d, i) => {
                    return yearlyData.slice(0, i + 1).reduce((acc, curr) => acc + (curr?.withdrawal || 0), 0);
                  }),
                  color: '#3557ff'
                },
                ...(taxState.swp ? [{
                  label: 'Cumulative Tax Paid',
                  data: yearlyData.map((d, i) => {
                    return yearlyData.slice(0, i + 1).reduce((acc, curr) => acc + (curr?.taxPaid || 0), 0);
                  }),
                  color: '#ffb34b'
                }] : [])
              ]}
            />
          </div>
        </div>

        {/* YEAR-WISE CORPUS DEPLETION Table */}
        <div className="card p-6 bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora">
              YEAR-WISE CORPUS DEPLETION
            </h4>
          </div>
          <DataTable
            columns={[
              { header: 'YEAR', accessor: 'year' },
              { header: 'MONTHLY W/D', accessor: 'formattedMonthlyWd' },
              { header: 'TOTAL W/D', accessor: 'formattedTotalWd' },
              ...(taxState.swp ? [
                { header: 'TAXABLE GAIN', accessor: 'formattedTaxableGain', className: 'text-warning' },
                { header: 'TAX PAID', accessor: 'formattedTaxPaid', className: 'text-error' },
              ] : []),
              { header: 'CORPUS', accessor: 'formattedBalance', className: 'text-green' },
            ]}
            data={yearlyData.map((d, i) => {
              const cumulativeWd = yearlyData.slice(0, i + 1).reduce((acc, curr) => acc + (curr?.withdrawal || 0), 0);
              return {
                ...d,
                formattedMonthlyWd: `₹${formatCurrency(d.withdrawal / 12)}`,
                formattedTotalWd: `₹${formatCurrency(cumulativeWd)}`,
                formattedTaxableGain: `₹${formatCurrency(d.taxableGain || 0)}`,
                formattedTaxPaid: `₹${formatCurrency(d.taxPaid || 0)}`,
                formattedBalance: `₹${formatCurrency(d.balance)}`,
              };
            })}
          />
        </div>

      </div>
      </div>
    </div>
  );
};

export default SWPPage;

