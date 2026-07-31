import axiosInstance from './axiosInstance';

/**
 * Upload a financial report PDF.
 * POST /reports/upload
 * Body: multipart/form-data { company_id, report_year, file }
 * Note: Upload auto-triggers AI analysis on the backend.
 * Returns: FinancialReportResponse
 */
export const uploadReport = async ({ companyId, reportYear, file }) => {
  const formData = new FormData();
  formData.append('company_id', companyId);
  formData.append('report_year', reportYear);
  formData.append('file', file);

  const response = await axiosInstance.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get all financial reports (no auth required).
 * GET /reports/
 * Returns: FinancialReportResponse[]
 */
export const getReports = async () => {
  const response = await axiosInstance.get('/reports/');
  return response.data;
};

/**
 * Get a single report by ID.
 * GET /reports/{id}
 * Returns: FinancialReportResponse
 */
export const getReportById = async (id) => {
  const response = await axiosInstance.get(`/reports/${id}`);
  return response.data;
};

/**
 * Delete a report and its associated PDF file.
 * DELETE /reports/{id}
 * Returns: { message: "Report deleted successfully" }
 */
export const deleteReport = async (id) => {
  const response = await axiosInstance.delete(`/reports/${id}`);
  return response.data;
};
