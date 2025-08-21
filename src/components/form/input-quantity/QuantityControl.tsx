import React, { useState } from "react";
import "./styles.css";
import "../main.css"

interface QuantityControlProps {
  label?: string;
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
                                                           label,
                                                           icon,
                                                           min = 1,
                                                           max = 99,
                                                           value = 1,
                                                           onChange,
                                                         }) => {
  const [qty, setQty] = useState(value);

  const handleChange = (newVal: number) => {
    if (newVal < min || newVal > max) return;
    setQty(newVal);
    onChange?.(newVal);
  };

  return (
    <div className="quantity-wrapper">
      {label && (
        <label className="quantity-label">
          {icon && <span className="quantity-icon">{icon}</span>}
          {label}
        </label>
      )}

      <div className="quantity-controls">
        {/* Giảm */}
        <button
          type="button"
          className="qty-btn"
          onClick={() => handleChange(qty - 1)}
          disabled={qty <= min}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-minus"
          >
            <path d="M5 12h14"></path>
          </svg>
        </button>

        {/* Input */}
        <input
          type="number"
          className="qty-display"
          min={min}
          max={max}
          value={qty}
          onChange={(e) => handleChange(Number(e.target.value))}
        />

        {/* Tăng */}
        <button
          type="button"
          className="qty-btn"
          onClick={() => handleChange(qty + 1)}
          disabled={qty >= max}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;