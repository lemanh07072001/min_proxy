import { forwardRef } from 'react'
import "./styles.css" // import CSS riêng

interface InputCustomProps {
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
  className?: string
  [key: string]: any
}

const InputCustom = forwardRef<HTMLInputElement, InputCustomProps>(
  ({ label, placeholder, type = 'text', required = false, error, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`form-input ${error ? 'error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    )
  }
)

InputCustom.displayName = 'InputCustom'

export default InputCustom
