import React from 'react'
import "./styles.css";

interface SelectCustomProps {
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
  [key: string]: any
}

const SelectCustom: React.FC<SelectCustomProps> = ({
  label,
  placeholder,
  required = false,
  error,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={`form-select ${error ? 'error' : ''} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default SelectCustom
