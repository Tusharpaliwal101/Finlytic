import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileSpreadsheet, FileText,
  RefreshCcw,
  Save,
  Target
} from 'lucide-react';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useCalculatorStore } from '../store/calculatorStore';
import { calcRequiredSIP, runSIPScenario } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import Input from '../components/ui/Input';
import LineChart from '../components/ui/LineChart';
import MetricCard from '../components/ui/MetricCard';
import RangeSlider from '../components/ui/RangeSlider';
import SavePolicyModal from '../components/ui/SavePolicyModal';
import { useSavePolicy } from '../hooks/useSavePolicy';
import { exportToExcel, exportToPDF } from '../utils/exports';

const goalSchema = z.object({
  target: z.number().min(50000),
  rate: z.number().min(1).max(30),
  years: z.number().min(1).max(50),
  stepup: z.number().min(0).max(50),
});

type GoalForm = z.infer<typeof goalSchema>;

const GoalSIPPage: React.FC = () => {
  const { goalResult, setGoalResult } = useCalculatorStore();
  const { openSaveModal, confirmSave, cancelSave, modalOpen, pendingName, pendingDescription, saved } = useSavePolicy();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      target: 10000000,
      rate: 12,
      years: 15,
      stepup: 5,
    }
  });

  const formValues = watch();

  const calculate = (data: GoalForm) => {
    const requiredSip = calcRequiredSIP(data.target, data.rate, data.years, data.stepup);
    // Use the SIP result to show the projection
    const projection = runSIPScenario(requiredSip, data.rate, data.years, data.stepup);

    setGoalResult({
      monthlyRequired: requiredSip,
      totalValue: projection.totalValue,
      isAchievable: true,
      yearlyData: projection.yearlyData
    });
  };

  React.useEffect(() => {
    calculate(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.target, formValues.rate, formValues.years, formValues.stepup]);

  const monthlyRequired = goalResult?.monthlyRequired || 0;
  const yearlyData = goalResult?.yearlyData || [];
  const totalInvestment = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].totalInvestment : 0;
  const totalReturns = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].returns : 0;
  const finalSip = monthlyRequired * Math.pow(1 + formValues.stepup / 100, formValues.years > 0 ? formValues.years - 1 : 0);

  const handleExportExcel = () => {
    if (yearlyData.length === 0) return;
    const exportData = yearlyData.map((d) => ({
      Year: d.year,
      'Monthly SIP': monthlyRequired * Math.pow(1 + formValues.stepup / 100, d.year - 1),
      'Total Invested': d.totalInvestment,
      'Portfolio Value': d.balance,
      'Progress %': `${((d.balance / formValues.target) * 100).toFixed(1)}%`
    }));
    exportToExcel(exportData, 'Goal-SIP-Projection');
  };

  const handleExportPDF = () => {
    if (yearlyData.length === 0) return;
    const headers = [['Year', 'Monthly SIP', 'Total Invested', 'Portfolio Value', 'Progress %']];
    const data = yearlyData.map((d) => [
      d.year.toString(),
      `Rs. ${formatCurrency(monthlyRequired * Math.pow(1 + formValues.stepup / 100, d.year - 1))}`,
      `Rs. ${formatCurrency(d.totalInvestment)}`,
      `Rs. ${formatCurrency(d.balance)}`,
      `${((d.balance / formValues.target) * 100).toFixed(1)}%`
    ]);

    const summary = [
      { label: 'Target Corpus', value: `Rs. ${formatCurrency(formValues.target)}` },
      { label: 'Initial SIP', value: `Rs. ${formatCurrency(monthlyRequired)}` },
      { label: 'Annual Step-up', value: `${formValues.stepup}%` },
      { label: 'Time Horizon', value: `${formValues.years} Years` }
    ];

    exportToPDF('Goal SIP Projection', headers, data, 'Goal-SIP-Projection', summary);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <Helmet>
        <title>Goal SIP Calculator India 2025 – Monthly SIP Required for Financial Goals | Finlytic</title>
        <meta name="description" content="Find exactly how much SIP you need to reach your financial goals. Set a target corpus, time horizon, and annual step-up — our Goal SIP calculator solves for the exact monthly investment." />
        <meta name="keywords" content="goal SIP calculator India, monthly SIP required calculator, financial goal planner, goal based investing, target corpus SIP calculator, step-up SIP planner 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/goal-sip" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/goal-sip" />
        <meta property="og:title" content="Goal SIP Calculator – How Much to Invest for Your Goal?" />
        <meta property="og:description" content="Reverse-engineer your SIP amount from a financial goal. Enter target amount, timeframe, and get the exact monthly SIP." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Goal SIP Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate monthly SIP needed to reach any financial goal with step-up planning." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "Goal SIP Calculator", "item": "https://finlytic.in/goal-sip" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic Goal SIP Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Reverse-calculate the monthly SIP amount required to reach a financial goal within a given timeframe.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "How to calculate SIP needed for a goal?", "acceptedAnswer": { "@type": "Answer", "text": "Enter your target amount, expected rate of return, time horizon, and optional step-up. The Goal SIP calculator will compute the exact monthly SIP required." }},
              { "@type": "Question", "name": "What is step-up SIP in goal planning?", "acceptedAnswer": { "@type": "Answer", "text": "Step-up SIP increases your monthly contribution by a fixed percentage each year. This reduces the initial SIP burden while still reaching the same goal." }}
            ]}
          ]
        })}</script>
      </Helmet>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[380px] space-y-6">
          <div className="card p-6 border-blue/20">
            <div className="flex items-center gap-2 mb-6 text-blue">
              <Target className="w-5 h-5" />
              <h3 className="text-lg font-bold font-sora">Goal Parameters</h3>
            </div>

            <form onSubmit={handleSubmit(calculate)} className="space-y-6">
              <Input
                label="Target Amount"
                type="number"
                prefix="₹"
                {...register('target', { valueAsNumber: true })}
                error={errors.target?.message}
              />

              <RangeSlider
                label="Expected Return (%)"
                min={1}
                max={30}
                suffix="%"
                value={formValues.rate}
                onChange={(v) => setValue('rate', v)}
              />

              <RangeSlider
                label="Time Horizon (Years)"
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

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" icon={<RefreshCcw className="w-4 h-4" />}>
                  Solve for SIP
                </Button>
              </div>
            </form>
          </div>

          {/* Left Side Quick Summary */}
          <div className="card p-6 bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
                REQUIRED SIP
              </h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Required SIP (Month 1)</span>
                  <span className="text-green font-numbers font-bold">₹{formatCurrency(monthlyRequired)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Target Corpus</span>
                  <span className="text-blue font-numbers font-bold">₹{formatCurrency(formValues.target)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Invested</span>
                  <span className="text-green font-numbers font-bold">₹{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Returns</span>
                  <span className="text-warning font-numbers font-bold">₹{formatCurrency(totalReturns)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Year-{formValues.years} SIP</span>
                  <span className="text-slate-300 font-numbers font-bold">₹{formatCurrency(finalSip)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <hr className="border-slate-800 mb-6" />
              <Button
                type="button"
                onClick={() => openSaveModal({
                  name: `Goal SIP – ₹${formatCurrency(formValues.target)} in ${formValues.years}yr`,
                  description: `Monthly SIP: ₹${formatCurrency(monthlyRequired)}, Step-up: ${formValues.stepup}%`,
                  type: 'goal',
                  data: { target: formValues.target, rate: formValues.rate, years: formValues.years, stepup: formValues.stepup, monthlyRequired, totalInvestment, totalReturns, finalSip }
                })}
                className={`w-full font-semibold transition-all active:scale-[0.98] shadow-none border ${saved ? 'border-green/40 bg-green/10 text-green' : 'border-[#00c9a7]/30 bg-[#00c9a7]/5 text-[#00c9a7] hover:bg-[#00c9a7] hover:text-white'
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

        <div className="flex-1 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-sora">
              PROJECTION
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard
                label="REQUIRED MONTHLY SIP"
                prefix="₹"
                value={formatCurrency(goalResult?.monthlyRequired || 0)}
                variant="green"
                subtext="Starting amount"
              />
              <MetricCard
                label="TARGET CORPUS"
                prefix="₹"
                value={formatCurrency(formValues.target)}
                variant="blue"
                subtext="Your goal"
              />
              <MetricCard
                label="TOTAL TO INVEST"
                prefix="₹"
                value={formatCurrency(goalResult?.yearlyData.length ? goalResult.yearlyData[goalResult.yearlyData.length - 1].totalInvestment : 0)}
                variant="green"
                subtext={`Over ${formValues.years} years`}
              />
              <MetricCard
                label={`YEAR-${formValues.years} SIP`}
                prefix="₹"
                value={formatCurrency((goalResult?.monthlyRequired || 0) * Math.pow(1 + formValues.stepup / 100, formValues.years > 0 ? formValues.years - 1 : 0))}
                variant="amber"
                subtext={`After ${formValues.stepup}% p.a. step-up`}
              />
            </div>

            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-6 font-sora">
              <span className="flex items-center gap-2 text-blue">
                <span className="w-3 h-3 border-2 border-blue"></span> Portfolio Value
              </span>
              <span className="flex items-center gap-2 text-warning">
                <span className="w-3 h-3 border-2 border-warning border-dashed"></span> Target Corpus
              </span>
              <span className="flex items-center gap-2 text-green">
                <span className="w-3 h-3 border-2 border-green border-dotted"></span> Total Invested
              </span>
            </h4>

            <div className="h-80">
              <LineChart
                labels={goalResult?.yearlyData.map(d => `Yr ${d.year}`) || []}
                datasets={[
                  {
                    label: 'Portfolio Value',
                    data: goalResult?.yearlyData.map(d => d.balance) || [],
                    color: '#3557ff',
                    fill: true,
                  },
                  {
                    label: 'Target Corpus',
                    data: goalResult?.yearlyData.map(() => formValues.target) || [],
                    color: '#ffb34b',
                    borderDash: [5, 5],
                    fill: false,
                  },
                  {
                    label: 'Total Invested',
                    data: goalResult?.yearlyData.map(d => d.totalInvestment) || [],
                    color: '#00c9a7',
                    borderDash: [2, 4],
                    fill: false,
                  }
                ]}
              />
            </div>
          </div>

          {/* YEAR-WISE PROGRESS TO GOAL Table */}
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              YEAR-WISE PROGRESS TO GOAL
            </h4>
            <DataTable
              columns={[
                { header: 'YEAR', accessor: 'year' },
                { header: 'MONTHLY SIP', accessor: 'formattedMonthlySip' },
                { header: 'TOTAL INVESTED', accessor: 'formattedTotalInvested' },
                { header: 'PORTFOLIO VALUE', accessor: 'formattedBalance' },
                { header: 'PROGRESS %', accessor: 'formattedProgress', className: 'text-blue' },
              ]}
              data={yearlyData.map((d) => {
                const currentSip = monthlyRequired * Math.pow(1 + formValues.stepup / 100, d.year - 1);
                const progressPct = ((d.balance / formValues.target) * 100).toFixed(1);
                return {
                  ...d,
                  formattedMonthlySip: `₹${formatCurrency(currentSip)}`,
                  formattedTotalInvested: `₹${formatCurrency(d.totalInvestment)}`,
                  formattedBalance: `₹${formatCurrency(d.balance)}`,
                  formattedProgress: `${progressPct}%`,
                };
              })}
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

export default GoalSIPPage;

