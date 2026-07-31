import axiosInstance from './axiosInstance';

/**
 * Trigger AI analysis for a report (idempotent — returns existing if already done).
 * POST /analysis/{report_id}
 * Returns: AIAnalysisResponse
 */
export const triggerAnalysis = async (reportId) => {
  const response = await axiosInstance.post(`/analysis/${reportId}`);
  return response.data;
};

/**
 * Get existing AI analysis for a report.
 * GET /analysis/{report_id}
 * Returns: AIAnalysisResponse {
 *   id, report_id, company_overview, revenue_analysis,
 *   profitability, risks, investment_recommendation,
 *   overall_rating (string "1"-"10"), created_at
 * }
 */
export const getAnalysis = async (reportId) => {
  const response = await axiosInstance.get(`/analysis/${reportId}`);
  return response.data;
};
