import React, { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * 
 * A flexible form input component supporting multiple input types with
 * focus states, error states, and multiple sizes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type (text, email, password, number)
 * @param {string} [props.size='regular'] - Input size (large, regular, small)
 * @param {boolean} [props.error=false] - Whether the input has an error
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Input value
 * @param {string} [props.name] - Input name attribute
 * @param {string} [props.id] - Input id attribute
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onChange] - Change event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.aria-label] - ARIA label for accessibility
 * @param {string} [props.aria-describedby] - ARIA describedby for error messages
 * @returns {React.ReactElement} The rendered input element
 */
const Input = forwardRef(({
  type = 'text',
  size = 'regular',
  error = false,
  placeholder,
  value,
  name,
  id,
  className,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  ...ariaProps
}, ref) => {
  const inputClassName = [
    styles.input,
    styles[`input--${size}`],
    error && styles['input--error'],
    disabled && styles['input--disabled'],
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      type={type}
      className={inputClassName}
      placeholder={placeholder}
      value={value}
      name={name}
      id={id}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      {...ariaProps}
    />
  );
});

Input.displayName = 'Input';

export default Input;
