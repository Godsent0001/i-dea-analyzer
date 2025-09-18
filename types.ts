
export interface Metric {
  value: string | number;
  rationale: string;
}

export interface MarketAnalytics {
  totalAddressableMarket: Metric;
  serviceableAvailableMarket: Metric;
  serviceableObtainableMarket: Metric;
  marketGrowthRate: Metric;
  marketTrendsAndTiming: Metric;
  competitorLandscape: Metric;
}

export interface CustomerDemandAnalytics {
  customerAcquisitionCost: Metric;
  willingnessToPay: Metric;
}

export interface ProductSolutionAnalytics {
  valuePropositionClarity: Metric;
  differentiationIndex: Metric;
  minimumViableProduct: Metric;
  technicalFeasibility: Metric;
  ipAndMoats: Metric;
}

export interface BusinessModelAnalytics {
  revenueModel: Metric;
  scalabilityPotential: Metric;
  salesCycleLength: Metric;
}

export interface FinancialAnalytics {
  burnRateAndRunway: Metric;
  breakEvenAnalysis: Metric;
}

export interface OverallAssessment {
  chanceOfSuccess: number;
  summary: string;
}

export interface AnalysisData {
  marketAnalytics: MarketAnalytics;
  customerDemandAnalytics: CustomerDemandAnalytics;
  productSolutionAnalytics: ProductSolutionAnalytics;
  businessModelAnalytics: BusinessModelAnalytics;
  financialAnalytics: FinancialAnalytics;
  overallAssessment: OverallAssessment;
}

export enum AppState {
  IDLE,
  LOADING,
  RESULTS,
  ERROR
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
