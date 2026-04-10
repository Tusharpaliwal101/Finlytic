import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Save, FileSpreadsheet, FileText, TrendingDown } from 'lucide-react';

import { useCalculatorStore } from '../store/calculatorStore';
import { formatCurrency } from '../utils/formatters';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import MetricCard from '../components/ui/MetricCard';
import LineChart from '../components/ui/LineChart';
import DataTable from '../components/ui/DataTable';
import { exportToExcel, exportToPDF } from '../utils/exports';
import { useSavePolicy } from '../hooks/useSavePolicy';
import SavePolicyModal from '../components/ui/SavePolicyModal';

const inflationSchema = z.object({
  amount: z.number().min(100),
  rate: z.number().min(0.1).max(25),
  years: z.number().min(1).max(50),
});

type InflationForm = z.infer<typeof inflationSchema>;

const InflationPage = () => {
  const { setInfResult } = useCalculatorStore();
  const { openSaveModal, confirmSave, cancelSave, modalOpen, pendingName, pendingDescription, saved } = useSavePolicy();
  const { register, watch, formState: { errors } } = useForm<InflationForm>({
    resolver: zodResolver(inflationSchema),
    defaultValues: { amount: 100000, rate: 6, years: 10 }
  });

  const formValues = watch();

  const amount = formValues.amount || 0;
  const rate = formValues.rate || 0;
  const years = formValues.years || 0;

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const purchasingPower = amount / Math.pow(1 + rate / 100, years);
  const lostValue = amount - purchasingPower;
  const costMultiple = amount > 0 ? (futureValue / amount) : 0;

  useEffect(() => {
    setInfResult({
      futureValue,
      purchasingPower,
      yearlyData: []
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [futureValue, purchasingPower]);

  const yearlyData: Array<{ year: number; futureCost: number; purchasingPower: number; }> = [];
  for (let i = 0; i <= years; i++) {
    yearlyData.push({
      year: i,
      futureCost: amount * Math.pow(1 + rate / 100, i),
      purchasingPower: amount / Math.pow(1 + rate / 100, i)
    });
  }

  const handleExportExcel = () => {
    if (yearlyData.length === 0) return;
    const exportData = yearlyData.filter(d => d.year > 0).map(d => ({
      Year: d.year,
      'Future Cost': d.futureCost,
      'Purchasing Power': d.purchasingPower
    }));
    exportToExcel(exportData, 'Inflation-Impact');
  };

  const handleExportPDF = () => {
    if (yearlyData.length === 0) return;
    const headers = [['Year', 'Future Cost', 'Purchasing Power']];
    const data = yearlyData.filter(d => d.year > 0).map(d => [
      d.year.toString(),
      `Rs. ${formatCurrency(d.futureCost)}`,
      `Rs. ${formatCurrency(d.purchasingPower)}`
    ]);

    const summary = [
      { label: 'Current Cost', value: `Rs. ${formatCurrency(amount)}` },
      { label: 'Inflation Rate', value: `${rate}%` },
      { label: 'Time Period', value: `${years} Years` },
      { label: 'Future Cost', value: `Rs. ${formatCurrency(futureValue)}` },
    ];

    exportToPDF('Inflation Calculator', headers, data, 'Inflation-Impact', summary);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <Helmet>
        <title>Inflation Calculator India 2025 – Check Purchasing Power & Future Costs | Finlytic</title>
        <meta name="description" content="Calculate how rising inflation erodes your purchasing power and inflates future costs. See real value of money over time, year-wise cost charts, and plan your savings accordingly." />
        <meta name="keywords" content="inflation calculator India, purchasing power calculator, future cost calculator, price rise calculator India, real value of money, cost of living calculator 2025, inflation impact calculator" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/inflation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/inflation" />
        <meta property="og:title" content="Inflation Calculator – See How Prices Rise Over Time" />
        <meta property="og:description" content="Find out what today's money is worth in the future. Track purchasing power erosion with India's best inflation calculator." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inflation Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate how inflation erodes purchasing power and increases future costs over time." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "Inflation Calculator", "item": "https://finlytic.in/inflation" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic Inflation Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Calculate how inflation erodes purchasing power and increases the future cost of goods and services.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "How does inflation affect purchasing power?", "acceptedAnswer": { "@type": "Answer", "text": "Inflation reduces purchasing power — the same amount of money buys fewer goods over time. At 6% inflation, ₹1 lakh today will only buy what ₹55,839 buys in 10 years." }},
              { "@type": "Question", "name": "What is a good inflation rate in India?", "acceptedAnswer": { "@type": "Answer", "text": "RBI targets 4% inflation (±2%). India's historical CPI inflation averages around 5–7%. For financial planning, use 6% as a conservative estimate." }}
            ]}
          ]
        })}</script>
      </Helmet>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2 mb-2 font-sora">
          <TrendingDown className="w-8 h-8 text-error" />
          Inflation Calculator
        </h2>
        <p className="text-slate-400">Calculate how rising prices erode your purchasing power and increase future costs.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              INFLATION VARIABLES
            </h4>
            <div className="space-y-6">
              <Input label="CURRENT COST" type="number" prefix="₹" {...register('amount', { valueAsNumber: true })} error={errors.amount?.message} className="font-sora uppercase text-xs" />
              <Input label="INFLATION RATE" type="number" suffix="% p.a." {...register('rate', { valueAsNumber: true })} error={errors.rate?.message} className="font-sora uppercase text-xs" />
              <Input label="TIME PERIOD" type="number" suffix="Years" {...register('years', { valueAsNumber: true })} error={errors.years?.message} className="font-sora uppercase text-xs" />
            </div>
          </div>

          <div className="card p-6 bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
                QUICK SUMMARY
              </h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Current Cost</span>
                  <span className="text-white font-numbers font-bold">₹{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Future Cost</span>
                  <span className="text-error font-numbers font-bold">₹{formatCurrency(futureValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Purchasing Power</span>
                  <span className="text-warning font-numbers font-bold">₹{formatCurrency(purchasingPower)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Lost to Inflation</span>
                  <span className="text-error font-numbers font-bold">₹{formatCurrency(lostValue)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <hr className="border-slate-800 mb-6" />
              <Button
                type="button"
                onClick={() => openSaveModal({
                  name: `Inflation – ₹${formatCurrency(amount)} after ${years}yrs`,
                  description: `Future cost: ₹${formatCurrency(futureValue)}, Purchasing power: ₹${formatCurrency(purchasingPower)}`,
                  type: 'inflation',
                  data: { amount, rate, years, futureValue, purchasingPower, lostValue, costMultiple }
                })}
                className={`w-full font-semibold transition-all active:scale-[0.98] shadow-none border ${
                  saved ? 'border-green/40 bg-green/10 text-green' : 'border-error/30 bg-error/5 text-error hover:bg-error hover:text-white'
                }`}
                size="md"
                icon={<Save className="w-4 h-4" />}
              >
                {saved ? 'Saved!' : 'Save as Policy'}
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

        {/* Right Content */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              IMPACT ANALYSIS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard label="FUTURE COST" prefix="₹" value={formatCurrency(futureValue)} variant="red" subtext="What it will cost" />
              <MetricCard label="PURCHASING POWER" prefix="₹" value={formatCurrency(purchasingPower)} variant="amber" subtext="Real value today" />
              <MetricCard label="LOST VALUE" prefix="₹" value={formatCurrency(lostValue)} variant="red" subtext="Eroded by inflation" />
              <MetricCard label="COST MULTIPLE" value={`${costMultiple.toFixed(2)}x`} variant="amber" subtext="Price inflation factor" />
            </div>

            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-6 font-sora">
              <span className="flex items-center gap-2 text-error">
                <span className="w-3 h-3 border-2 border-error"></span> Future Cost
              </span>
              <span className="flex items-center gap-2 text-warning">
                <span className="w-3 h-3 border-2 border-warning"></span> Purchasing Power
              </span>
              <span className="flex items-center gap-2 text-white">
                <span className="w-3 h-3 border-2 border-white border-dashed"></span> Current Price Baseline
              </span>
            </h4>

            <div className="h-80">
              <LineChart
                labels={yearlyData.map(d => `Yr ${d.year}`)}
                datasets={[
                  {
                    label: 'Future Cost',
                    data: yearlyData.map(d => d.futureCost),
                    color: '#ff4b4b',
                    fill: false,
                  },
                  {
                    label: 'Purchasing Power',
                    data: yearlyData.map(d => d.purchasingPower),
                    color: '#ffb34b',
                    fill: true,
                  },
                  {
                    label: 'Baseline Price',
                    data: yearlyData.map(() => amount),
                    color: '#ffffff',
                    fill: false,
                    borderDash: [5, 5]
                  }
                ]}
              />
            </div>
          </div>

          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              YEAR-WISE DEPRECIATION
            </h4>
            <DataTable
              columns={[
                { header: 'YEAR', accessor: 'year' },
                { header: 'COST OF ITEM', accessor: 'formattedFutureCost', className: 'text-error' },
                { header: 'VALUE OF MONEY', accessor: 'formattedPower', className: 'text-warning' },
              ]}
              data={yearlyData.filter(d => d.year > 0).map(d => ({
                ...d,
                formattedFutureCost: `₹${formatCurrency(d.futureCost)}`,
                formattedPower: `₹${formatCurrency(d.purchasingPower)}`,
              }))}
            />
          </div>
        </div>
      </div>

      <SavePolicyModal
        isOpen={modalOpen}
        defaultName={pendingName}
        description={pendingDescription}
        onSave={confirmSave}
        onClose={cancelSave}
      />
    </div>
  );
};

export default InflationPage;
