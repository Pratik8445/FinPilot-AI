import './ConfirmModal.css';

/**
 * A reusable confirmation dialog modal.
 * Props: isOpen, title, message, confirmLabel, onConfirm, onCancel, loading
 */
const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <h2 className="modal__title" id="modal-title">{title}</h2>
        {message && <p className="modal__message">{message}</p>}
        <div className="modal__actions">
          <button
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn btn--${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
