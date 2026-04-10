import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Save, FileSpreadsheet, FileText, Calculator } from 'lucide-react';

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

const lumpsumSchema = z.object({
  amount: z.number().min(500),
  rate: z.number().min(1).max(50),
  years: z.number().min(1).max(100),
});

type LumpsumForm = z.infer<typeof lumpsumSchema>;

const LumpsumPage: React.FC = () => {
  const { setLumpsumResult } = useCalculatorStore();
  const { openSaveModal, confirmSave, cancelSave, modalOpen, pendingName, pendingDescription, saved } = useSavePolicy();

  const { register, watch, formState: { errors } } = useForm<LumpsumForm>({
    resolver: zodResolver(lumpsumSchema),
    defaultValues: {
      amount: 100000,
      rate: 12,
      years: 10,
    }
  });

  const formValues = watch();

  const amount = formValues.amount || 0;
  const rate = formValues.rate || 0;
  const years = formValues.years || 0;

  const finalValue = amount * Math.pow(1 + rate / 100, years);
  const totalReturns = finalValue - amount;
  const wealthMultiple = amount > 0 ? (finalValue / amount) : 0;

  useEffect(() => {
    setLumpsumResult({
      totalInvestment: amount,
      totalReturns: totalReturns,
      totalValue: finalValue,
      yearlyData: [] // Will rebuild locally for full resolution
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, rate, years, finalValue, totalReturns]);

  const yearlyData: Array<{ year: number; investment: number; returns: number; balance: number }> = [];
  for (let i = 0; i <= years; i++) {
    const val = amount * Math.pow(1 + rate / 100, i);
    yearlyData.push({
      year: i,
      investment: amount,
      returns: val - amount,
      balance: val
    });
  }

  const handleExportExcel = () => {
    if (yearlyData.length === 0) return;
    const exportData = yearlyData.filter(d => d.year > 0).map(d => ({
      Year: d.year,
      'Total Invested': d.investment,
      'Total Returns': d.returns,
      'Portfolio Value': d.balance
    }));
    exportToExcel(exportData, 'Lumpsum-Projection');
  };

  const handleExportPDF = () => {
    if (yearlyData.length === 0) return;
    const headers = [['Year', 'Total Invested', 'Returns', 'Portfolio Value']];
    const data = yearlyData.filter(d => d.year > 0).map(d => [
      d.year.toString(),
      `Rs. ${formatCurrency(d.investment)}`,
      `Rs. ${formatCurrency(d.returns)}`,
      `Rs. ${formatCurrency(d.balance)}`
    ]);

    const summary = [
      { label: 'Investment Amount', value: `Rs. ${formatCurrency(amount)}` },
      { label: 'Expected Return', value: `${rate}% p.a.` },
      { label: 'Time Period', value: `${years} Years` },
      { label: 'Total Returns', value: `Rs. ${formatCurrency(totalReturns)}` },
      { label: 'Final Corpus', value: `Rs. ${formatCurrency(finalValue)}` }
    ];

    exportToPDF('Lumpsum Calculator', headers, data, 'Lumpsum-Projection', summary);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <Helmet>
        <title>Lumpsum Calculator India 2025 – One-Time Investment Returns | Finlytic</title>
        <meta name="description" content="Calculate the future value of your one-time lumpsum mutual fund investment. Get wealth multiple, year-wise growth projections, and downloadable reports. Free & instant." />
        <meta name="keywords" content="lumpsum calculator India, one time investment calculator, mutual fund lumpsum returns, lump sum SIP comparison, wealth calculator 2025, investment returns calculator India" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/lumpsum" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/lumpsum" />
        <meta property="og:title" content="Lumpsum Calculator – One-Time Mutual Fund Investment Returns" />
        <meta property="og:description" content="Calculate how your one-time investment grows over time. India's best lumpsum return estimator with charts and PDF export." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lumpsum Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate lumpsum investment returns with year-wise projections and wealth multiple." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "Lumpsum Calculator", "item": "https://finlytic.in/lumpsum" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic Lumpsum Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Calculate the future value of a one-time lumpsum mutual fund investment.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "What is a lumpsum investment?", "acceptedAnswer": { "@type": "Answer", "text": "A lumpsum investment is a single, one-time investment made in a mutual fund or other instrument, as opposed to periodic SIP investments." }},
              { "@type": "Question", "name": "Is lumpsum better than SIP?", "acceptedAnswer": { "@type": "Answer", "text": "Lumpsum is better when markets are low. SIP is safer for volatile markets as it averages your cost over time. Both strategies can be combined for optimal results." }}
            ]}
          ]
        })}</script>
      </Helmet>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2 mb-2 font-sora">
          <Calculator className="w-8 h-8 text-blue" />
          Lumpsum Calculator
        </h2>
        <p className="text-slate-400">Project the future value of a one-time investment over long periods using compound growth.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              INVESTMENT DETAILS
            </h4>
            <div className="space-y-6">
              <Input label="INVESTMENT AMOUNT" type="number" prefix="₹" {...register('amount', { valueAsNumber: true })} error={errors.amount?.message} className="font-sora uppercase text-xs" />
              <Input label="EXPECTED RETURN" type="number" suffix="% p.a." {...register('rate', { valueAsNumber: true })} error={errors.rate?.message} className="font-sora uppercase text-xs" />
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
                  <span className="text-slate-500">Amount Invested</span>
                  <span className="text-white font-numbers font-bold">₹{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Est. Returns</span>
                  <span className="text-green font-numbers font-bold">₹{formatCurrency(totalReturns)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Final Corpus</span>
                  <span className="text-blue font-numbers font-bold">₹{formatCurrency(finalValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Wealth Multiple</span>
                  <span className="text-warning font-numbers font-bold">{wealthMultiple.toFixed(2)}x</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <hr className="border-slate-800 mb-6" />
              <Button
                type="button"
                onClick={() => openSaveModal({
                  name: `Lumpsum – ₹${formatCurrency(amount)} @ ${rate}% for ${years}yr`,
                  description: `Final corpus: ₹${formatCurrency(finalValue)}`,
                  type: 'lumpsum',
                  data: { amount, rate, years, finalValue, totalReturns, wealthMultiple }
                })}
                className={`w-full font-semibold transition-all active:scale-[0.98] shadow-none border ${
                  saved ? 'border-green/40 bg-green/10 text-green' : 'border-blue/30 bg-blue/5 text-blue hover:bg-blue hover:text-white'
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

        {/* Right Sidebar */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              PROJECTION
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard label="TOTAL INVESTED" prefix="₹" value={formatCurrency(amount)} variant="blue" subtext="Principal" />
              <MetricCard label="EST. RETURNS" prefix="₹" value={formatCurrency(totalReturns)} variant="green" subtext="Wealth generated" />
              <MetricCard label="FINAL CORPUS" prefix="₹" value={formatCurrency(finalValue)} variant="blue" subtext={`After ${years} years`} />
              <MetricCard label="WEALTH MULTIPLE" value={`${wealthMultiple.toFixed(2)}x`} variant="amber" subtext="Growth factor" />
            </div>

            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-6 font-sora">
               <span className="flex items-center gap-2 text-blue">
                 <span className="w-3 h-3 border-2 border-blue"></span> Portfolio Value
               </span>
               <span className="flex items-center gap-2 text-green">
                 <span className="w-3 h-3 border-2 border-green border-dashed"></span> Total Invested
               </span>
            </h4>

            <div className="h-80">
              <LineChart
                labels={yearlyData.map(d => `Yr ${d.year}`)}
                datasets={[
                  {
                    label: 'Portfolio Value',
                    data: yearlyData.map(d => d.balance),
                    color: '#3557ff',
                    fill: true,
                  },
                  {
                    label: 'Total Invested',
                    data: yearlyData.map(d => d.investment),
                    color: '#00c9a7',
                    fill: false,
                    borderDash: [5, 5]
                  }
                ]}
              />
            </div>
          </div>

          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              YEAR-WISE GROWTH
            </h4>
            <DataTable
              columns={[
                { header: 'YEAR', accessor: 'year' },
                { header: 'INVESTMENT', accessor: 'formattedInvestment' },
                { header: 'RETURNS', accessor: 'formattedReturns', className: 'text-green' },
                { header: 'PORTFOLIO VALUE', accessor: 'formattedBalance', className: 'text-blue' },
              ]}
              data={yearlyData.filter(d => d.year > 0).map(d => ({
                ...d,
                formattedInvestment: `₹${formatCurrency(d.investment)}`,
                formattedReturns: `₹${formatCurrency(d.returns)}`,
                formattedBalance: `₹${formatCurrency(d.balance)}`,
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

export default LumpsumPage;

