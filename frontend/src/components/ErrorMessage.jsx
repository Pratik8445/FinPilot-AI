import './ErrorMessage.css';

/**
 * Displays a user-friendly error message.
 * Handles backend shape: { success: false, message: "..." }
 * Also handles FastAPI default: { detail: "..." | [{msg}] }
 */
const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  let message = 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') {
    message = error;
  } else if (error?.response?.data) {
    const data = error.response.data;
    // Backend custom shape: { success: false, message: "..." }
    if (typeof data.message === 'string' && data.message) {
      message = data.message;
    // FastAPI default validation shape: { detail: "..." | [{msg}] }
    } else if (typeof data.detail === 'string' && data.detail) {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
    } else if (typeof data === 'string' && data) {
      message = data;
    }
  } else if (error?.message === 'Network Error') {
    message = 'Cannot reach the server. Make sure the backend is running on port 8000.';
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon">⚠</span>
      <span className="error-message__text">{message}</span>
      {onDismiss && (
        <button
          className="error-message__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
