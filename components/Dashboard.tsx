
import React from 'react';
import { AnalysisData } from '../types';
import AnalyticsCard from './AnalyticsCard';
import { METRIC_DESCRIPTIONS } from '../constants';

interface DashboardProps {
  data: AnalysisData;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-200 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

const SuccessGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-green-500"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <span className="absolute text-3xl font-bold text-white">{percentage}%</span>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { 
    marketAnalytics: ma, 
    customerDemandAnalytics: cda,
    productSolutionAnalytics: psa,
    businessModelAnalytics: bma,
    financialAnalytics: fa,
    overallAssessment: oa
  } = data;

  return (
    <div className="flex-grow p-4 md:p-8 overflow-y-auto bg-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">Overall Assessment</h1>
                <p className="text-slate-300">{oa.summary}</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-center">
                    <SuccessGauge percentage={oa.chanceOfSuccess} />
                    <p className="mt-2 font-semibold text-green-400">Chance of Success</p>
                </div>
                 <div className="text-center">
                    <SuccessGauge percentage={100 - oa.chanceOfSuccess} />
                    <p className="mt-2 font-semibold text-red-400">Chance of Failure</p>
                </div>
            </div>
        </div>

        <Section title="Market Analytics">
            <AnalyticsCard title="Total Addressable Market" value={ma.totalAddressableMarket.value} rationale={ma.totalAddressableMarket.rationale} tooltip={METRIC_DESCRIPTIONS.totalAddressableMarket} />
            <AnalyticsCard title="Serviceable Available Market" value={ma.serviceableAvailableMarket.value} rationale={ma.serviceableAvailableMarket.rationale} tooltip={METRIC_DESCRIPTIONS.serviceableAvailableMarket} />
            <AnalyticsCard title="Serviceable Obtainable Market" value={ma.serviceableObtainableMarket.value} rationale={ma.serviceableObtainableMarket.rationale} tooltip={METRIC_DESCRIPTIONS.serviceableObtainableMarket} />
            <AnalyticsCard title="Market Growth Rate" value={ma.marketGrowthRate.value} rationale={ma.marketGrowthRate.rationale} tooltip={METRIC_DESCRIPTIONS.marketGrowthRate} />
            <AnalyticsCard title="Market Trends & Timing" value={ma.marketTrendsAndTiming.value} rationale={ma.marketTrendsAndTiming.rationale} tooltip={METRIC_DESCRIPTIONS.marketTrendsAndTiming} />
            <AnalyticsCard title="Competitor Landscape" value={ma.competitorLandscape.value} rationale={ma.competitorLandscape.rationale} tooltip={METRIC_DESCRIPTIONS.competitorLandscape} />
        </Section>
        
        <Section title="Customer & Demand Analytics">
            <AnalyticsCard title="Customer Acquisition Cost" value={cda.customerAcquisitionCost.value} rationale={cda.customerAcquisitionCost.rationale} tooltip={METRIC_DESCRIPTIONS.customerAcquisitionCost} />
            <AnalyticsCard title="Willingness to Pay" value={cda.willingnessToPay.value} rationale={cda.willingnessToPay.rationale} tooltip={METRIC_DESCRIPTIONS.willingnessToPay} />
        </Section>
        
        <Section title="Product & Solution Analytics">
            <AnalyticsCard title="Value Proposition Clarity" value={psa.valuePropositionClarity.value} rationale={psa.valuePropositionClarity.rationale} tooltip={METRIC_DESCRIPTIONS.valuePropositionClarity} />
            <AnalyticsCard title="Differentiation Index" value={psa.differentiationIndex.value} rationale={psa.differentiationIndex.rationale} tooltip={METRIC_DESCRIPTIONS.differentiationIndex} />
            <AnalyticsCard title="Minimum Viable Product" value={psa.minimumViableProduct.value} rationale={psa.minimumViableProduct.rationale} tooltip={METRIC_DESCRIPTIONS.minimumViableProduct} />
            <AnalyticsCard title="Technical Feasibility" value={psa.technicalFeasibility.value} rationale={psa.technicalFeasibility.rationale} tooltip={METRIC_DESCRIPTIONS.technicalFeasibility} />
            <AnalyticsCard title="IP & Moats" value={psa.ipAndMoats.value} rationale={psa.ipAndMoats.rationale} tooltip={METRIC_DESCRIPTIONS.ipAndMoats} />
        </Section>
        
        <Section title="Business Model Analytics">
            <AnalyticsCard title="Revenue Model" value={bma.revenueModel.value} rationale={bma.revenueModel.rationale} tooltip={METRIC_DESCRIPTIONS.revenueModel} />
            <AnalyticsCard title="Scalability Potential" value={bma.scalabilityPotential.value} rationale={bma.scalabilityPotential.rationale} tooltip={METRIC_DESCRIPTIONS.scalabilityPotential} />
            <AnalyticsCard title="Sales Cycle Length" value={bma.salesCycleLength.value} rationale={bma.salesCycleLength.rationale} tooltip={METRIC_DESCRIPTIONS.salesCycleLength} />
        </Section>

        <Section title="Financial Analytics">
            <AnalyticsCard title="Burn Rate & Runway" value={fa.burnRateAndRunway.value} rationale={fa.burnRateAndRunway.rationale} tooltip={METRIC_DESCRIPTIONS.burnRateAndRunway} />
            <AnalyticsCard title="Break-Even Analysis" value={fa.breakEvenAnalysis.value} rationale={fa.breakEvenAnalysis.rationale} tooltip={METRIC_DESCRIPTIONS.breakEvenAnalysis} />
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
