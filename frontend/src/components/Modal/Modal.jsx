import React, { useEffect, useRef, useCallback } from 'react';
import styles from './Modal.module.css';

/**
 * Modal Component
 * 
 * A modal dialog component with overlay, header, body, and footer sections.
 * Supports keyboard handling (ESC to close) and focus trap.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Modal content (typically header, body, footer)
 * @param {boolean} [props.isOpen=false] - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {string} [props.title] - Modal title
 * @param {string} [props.size='regular'] - Modal size (regular, large)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.closeOnEscape=true] - Whether ESC key closes the modal
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether clicking overlay closes the modal
 * @returns {React.ReactElement|null} The rendered modal or null if not open
 */
const Modal = ({
  children,
  isOpen = false,
  onClose,
  title,
  size = 'regular',
  className,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle ESC key press
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalClassName = [
    styles.modal,
    styles[`modal--${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Modal Header Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {Function} [props.onClose] - Close button callback
 * @param {string} [props.title] - Header title
 * @returns {React.ReactElement} The rendered modal header
 */
export const ModalHeader = ({ children, onClose, title }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
        {children}
      </div>
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Modal Body Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Body content
 * @returns {React.ReactElement} The rendered modal body
 */
export const ModalBody = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

/**
 * Modal Footer Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content (typically buttons)
 * @returns {React.ReactElement} The rendered modal footer
 */
export const ModalFooter = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export default Modal;
