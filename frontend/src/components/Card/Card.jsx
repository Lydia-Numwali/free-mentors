import React from 'react';
import styles from './Card.module.css';

/**
 * Card Component
 * 
 * A flexible card component for displaying content with support for
 * multiple variants and hover effects.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant='default'] - Card variant (default, success, warning, error, info)
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.role] - ARIA role attribute
 * @returns {React.ReactElement} The rendered card element
 */
const Card = ({
  children,
  variant = 'default',
  className,
  role = 'article',
  ...props
}) => {
  const cardClassName = [
    styles.card,
    styles[`card--${variant}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClassName}
      role={role}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
