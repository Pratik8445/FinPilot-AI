import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
  return (
    <div className={`spinner-wrapper spinner-wrapper--${size}`}>
      <div className={`spinner spinner--${size}`} aria-label="Loading" role="status" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
