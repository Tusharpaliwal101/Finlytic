import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { BarChart2, FileSpreadsheet, FileText, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import Input from '../components/ui/Input';
import LineChart from '../components/ui/LineChart';
import MetricCard from '../components/ui/MetricCard';
import SavePolicyModal from '../components/ui/SavePolicyModal';
import { useSavePolicy } from '../hooks/useSavePolicy';
import { useCalculatorStore } from '../store/calculatorStore';
import { exportToExcel, exportToPDF } from '../utils/exports';
import { formatCurrency } from '../utils/formatters';

const cagrSchema = z.object({
  initial: z.number().min(100),
  final: z.number().min(100),
  years: z.number().min(1).max(100),
});

type CAGRForm = z.infer<typeof cagrSchema>;

const CAGRPage = () => {
  const { setCAGRResult } = useCalculatorStore();
  const { openSaveModal, confirmSave, cancelSave, modalOpen, pendingName, pendingDescription, saved } = useSavePolicy();
  const { register, watch, formState: { errors } } = useForm<CAGRForm>({
    resolver: zodResolver(cagrSchema),
    defaultValues: { initial: 100000, final: 350000, years: 5 }
  });

  const formValues = watch();

  const initial = formValues.initial || 0;
  const final = formValues.final || 0;
  const years = formValues.years || 0;

  const cagr = (years > 0 && initial > 0) ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0;
  const absoluteReturnPct = initial > 0 ? ((final - initial) / initial) * 100 : 0;
  const absoluteGain = final - initial;
  const growthMultiple = initial > 0 ? final / initial : 0;

  useEffect(() => {
    setCAGRResult({
      cagr,
      totalReturn: absoluteGain,
      absoluteReturn: absoluteReturnPct,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cagr, absoluteGain, absoluteReturnPct]);

  const yearlyData: Array<{ year: number; value: number; growth: number; returnPct: number }> = [];
  for (let i = 0; i <= years; i++) {
    const prevVal = i > 0 ? initial * Math.pow(1 + cagr / 100, i - 1) : initial;
    const currentVal = initial * Math.pow(1 + cagr / 100, i);
    yearlyData.push({
      year: i,
      value: currentVal,
      growth: i === 0 ? 0 : currentVal - prevVal,
      returnPct: i === 0 ? 0 : cagr
    });
  }

  const handleExportExcel = () => {
    if (yearlyData.length === 0) return;
    const exportData = yearlyData.filter(d => d.year > 0).map(d => ({
      Year: d.year,
      Value: d.value,
      Growth: d.growth,
      'Return %': `${d.returnPct.toFixed(2)}%`
    }));
    exportToExcel(exportData, 'CAGR-Projection');
  };

  const handleExportPDF = () => {
    if (yearlyData.length === 0) return;
    const headers = [['Year', 'Value', 'Growth', 'Return %']];
    const data = yearlyData.filter(d => d.year > 0).map(d => [
      d.year.toString(),
      `Rs. ${formatCurrency(d.value)}`,
      `Rs. ${formatCurrency(d.growth)}`,
      `${d.returnPct.toFixed(2)}%`
    ]);

    const summary = [
      { label: 'Initial Investment', value: `Rs. ${formatCurrency(initial)}` },
      { label: 'Final Value', value: `Rs. ${formatCurrency(final)}` },
      { label: 'Time Period', value: `${years} Years` },
      { label: 'CAGR', value: `${cagr.toFixed(2)}%` },
    ];

    exportToPDF('CAGR Calculator', headers, data, 'CAGR-Projection', summary);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <Helmet>
        <title>CAGR Calculator India 2025 – Compound Annual Growth Rate | Finlytic</title>
        <meta name="description" content="Calculate CAGR (Compound Annual Growth Rate) of any investment instantly. Compare fund performance, track portfolio growth, and project future value with year-wise charts." />
        <meta name="keywords" content="CAGR calculator India, compound annual growth rate calculator, investment growth calculator, portfolio return calculator, fund performance tracker, CAGR formula 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finlytic.in/cagr" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/cagr" />
        <meta property="og:title" content="CAGR Calculator – Measure True Investment Growth Rate" />
        <meta property="og:description" content="Find the real annual growth rate of any investment. India's most accurate CAGR calculator with year-wise projections." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CAGR Calculator India | Finlytic" />
        <meta name="twitter:description" content="Calculate compound annual growth rate and compare investment performance." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finlytic.in/" },
              { "@type": "ListItem", "position": 2, "name": "CAGR Calculator", "item": "https://finlytic.in/cagr" }
            ]},
            { "@type": "SoftwareApplication", "name": "Finlytic CAGR Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "description": "Calculate compound annual growth rate of any investment with year-wise breakdowns.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "What is CAGR?", "acceptedAnswer": { "@type": "Answer", "text": "CAGR or Compound Annual Growth Rate is the rate at which an investment grows annually over a specified period to reach a final value." }},
              { "@type": "Question", "name": "How is CAGR calculated?", "acceptedAnswer": { "@type": "Answer", "text": "CAGR = (Final Value / Initial Value)^(1/Years) - 1. Our calculator does this instantly for any investment." }}
            ]}
          ]
        })}</script>
      </Helmet>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2 mb-2 font-sora">
          <BarChart2 className="w-8 h-8 text-blue" />
          CAGR Calculator
        </h2>
        <p className="text-slate-400">Calculate Compounded Annual Growth Rate for any investment. Compare across time periods.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-6">
          <div className="card p-6 bg-slate-900 border border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sora mb-6">
              INVESTMENT DETAILS
            </h4>
            <div className="space-y-6">
              <Input label="INITIAL INVESTMENT" type="number" prefix="₹" {...register('initial', { valueAsNumber: true })} error={errors.initial?.message} className="font-sora uppercase text-xs" />
              <Input label="FINAL VALUE" type="number" prefix="₹" {...register('final', { valueAsNumber: true })} error={errors.final?.message} className="font-sora uppercase text-xs" />
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
                  <span className="text-slate-500">Initial Investment</span>
                  <span className="text-white font-numbers font-bold">₹{formatCurrency(initial)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Final Value</span>
                  <span className="text-amber font-numbers font-bold">₹{formatCurrency(final)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">CAGR</span>
                  <span className="text-warning font-numbers font-bold">{cagr.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Return</span>
                  <span className="text-blue font-numbers font-bold">{absoluteReturnPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Growth Multiple</span>
                  <span className="text-green font-numbers font-bold">{growthMultiple.toFixed(2)}x</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <hr className="border-slate-800 mb-6" />
              <Button
                type="button"
                onClick={() => openSaveModal({
                  name: `CAGR – ${cagr.toFixed(2)}% over ${years}yr`,
                  description: `₹${formatCurrency(initial)} → ₹${formatCurrency(final)} in ${years} years`,
                  type: 'cagr',
                  data: { initial, final, years, cagr, absoluteReturnPct, absoluteGain, growthMultiple }
                })}
                className={`w-full font-semibold transition-all active:scale-[0.98] shadow-none border ${saved ? 'border-green/40 bg-green/10 text-green' : 'border-warning/30 bg-warning/5 text-warning hover:bg-warning hover:text-slate-900'
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
              RESULTS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard label="CAGR" value={`${cagr.toFixed(2)}%`} variant="amber" subtext="Per annum" />
              <MetricCard label="TOTAL RETURN" value={`${absoluteReturnPct.toFixed(2)}%`} variant="blue" subtext="Absolute" />
              <MetricCard label="ABSOLUTE GAIN" prefix="₹" value={formatCurrency(absoluteGain)} variant="green" subtext="Profit" />
              <MetricCard label="GROWTH MULTIPLE" value={`${growthMultiple.toFixed(2)}x`} variant="blue" subtext="Capital multiplier" />
            </div>

            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-6 font-sora">
              <span className="flex items-center gap-2 text-blue">
                <span className="w-3 h-3 border-2 border-blue"></span> Investment Value
              </span>
            </h4>

            <div className="h-80">
              <LineChart
                labels={yearlyData.map(d => `Yr ${d.year}`)}
                datasets={[
                  {
                    label: 'Investment Value',
                    data: yearlyData.map(d => d.value),
                    color: '#3557ff',
                    fill: false,
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
                { header: 'VALUE', accessor: 'formattedValue' },
                { header: 'GROWTH', accessor: 'formattedGrowth', className: 'text-green' },
                { header: 'RETURN %', accessor: 'formattedReturn', className: 'text-warning' },
              ]}
              data={yearlyData.filter(d => d.year > 0).map(d => ({
                ...d,
                formattedValue: `₹${formatCurrency(d.value)}`,
                formattedGrowth: `₹${formatCurrency(d.growth)}`,
                formattedReturn: `${d.returnPct.toFixed(2)}%`,
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

export default CAGRPage;

