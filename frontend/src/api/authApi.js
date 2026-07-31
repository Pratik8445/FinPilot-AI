import axiosInstance from './axiosInstance';

/**
 * Register a new user.
 * POST /auth/register
 * Body: { name, email, password }
 * Returns: UserResponse { id, name, email, created_at }
 */
export const registerUser = async ({ name, email, password }) => {
  const response = await axiosInstance.post('/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Login with email + password.
 * POST /auth/login
 * Backend expects application/x-www-form-urlencoded with field "username" (not "email")
 * Returns: Token { access_token, token_type }
 */
export const loginUser = async ({ email, password }) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axiosInstance.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

/**
 * Get the currently authenticated user's profile.
 * GET /auth/me
 * Returns: UserResponse { id, name, email, created_at }
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
