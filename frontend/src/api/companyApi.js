import axiosInstance from './axiosInstance';

/**
 * Get all companies.
 * GET /companies
 * Returns: CompanyResponse[]
 */
export const getCompanies = async () => {
  const response = await axiosInstance.get('/companies');
  return response.data;
};

/**
 * Get a single company by ID.
 * GET /companies/{id}
 * Returns: CompanyResponse { id, name, ticker, sector }
 */
export const getCompanyById = async (id) => {
  const response = await axiosInstance.get(`/companies/${id}`);
  return response.data;
};

/**
 * Create a new company.
 * POST /companies
 * Body: { name, ticker, sector }
 * Returns: CompanyResponse
 */
export const createCompany = async ({ name, ticker, sector }) => {
  const response = await axiosInstance.post('/companies', { name, ticker, sector });
  return response.data;
};

/**
 * Update an existing company (full replacement).
 * PUT /companies/{id}
 * Body: { name, ticker, sector }
 * Returns: CompanyResponse
 */
export const updateCompany = async (id, { name, ticker, sector }) => {
  const response = await axiosInstance.put(`/companies/${id}`, { name, ticker, sector });
  return response.data;
};

/**
 * Delete a company.
 * DELETE /companies/{id}
 * Returns: 204 No Content
 */
export const deleteCompany = async (id) => {
  await axiosInstance.delete(`/companies/${id}`);
};
