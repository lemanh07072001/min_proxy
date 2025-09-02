import React from 'react'
import "./styles.css"

interface TextArenaCustomProps {
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  rows?: number
  [key: string]: any
}

const TextArenaCustom: React.FC<TextArenaCustomProps> = ({
  label,
  placeholder,
  required = false,
  error,
  className = '',
  rows = 4,
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
      <textarea
        className={`form-textarea ${error ? 'error' : ''} ${className}`}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default TextArenaCustom
