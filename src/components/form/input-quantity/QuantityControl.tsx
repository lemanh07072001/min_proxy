import "./styles.css";

interface QuantityControlProps {
  min?: number
  max?: number
  value?: number
  onChange?: (value: number) => void
  label?: string
  icon?: React.ReactNode
  className?: string
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  min = 1,
  max = 100,
  value = 1,
  onChange,
  label,
  icon,
  className = ''
}) => {
  // Đảm bảo value luôn nằm trong khoảng min-max
  const safeValue = Math.max(min, Math.min(max, value || min))

  const handleIncrease = () => {
    if (safeValue < max) {
      const newValue = safeValue + 1
      onChange?.(newValue)
    }
  }

  const handleDecrease = () => {
    if (safeValue > min) {
      const newValue = safeValue - 1
      onChange?.(newValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min
    if (newValue >= min && newValue <= max) {
      onChange?.(newValue)
    }
  }

  return (
    <div className={`quantity-control ${className}`}>
      {label && (
        <label className="quantity-label">
          {icon && <span className="quantity-icon">{icon}</span>}
          {label}
        </label>
      )}
      <div className="quantity-input-group">
        <button
          type="button"
          className="quantity-btn quantity-btn-decrease"
          onClick={handleDecrease}
          disabled={safeValue <= min}
        >
          -
        </button>
        <input
          type="number"
          className="quantity-input"
          value={safeValue}
          onChange={handleInputChange}
          min={min}
          max={max}
        />
        <button
          type="button"
          className="quantity-btn quantity-btn-increase"
          onClick={handleIncrease}
          disabled={safeValue >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default QuantityControl
