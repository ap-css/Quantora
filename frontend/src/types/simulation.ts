export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export interface SimulationRequestPayload {
  age: number;
  monthly_investment: number;
  risk_level: RiskLevel;
  years: number;
  target_amount: number;
}

export interface SimulationResponse {
  expected_final_value: number;
  median_final_value: number;
  probability_of_reaching_target: number;
  value_at_risk_95: number;
  best_case: number;
  worst_case: number;
  std_deviation: number;
  sharpe_estimate: number;
  sample_paths: number[][];
}

