import React from 'react';
import { Shield } from 'lucide-react';
import "./styles.css";


// Lỗi xảy ra do không tìm thấy file './styles.css'.
// Dòng import dưới đây đã được chú thích lại để khắc phục lỗi.
// Bạn có thể bỏ chú thích và trỏ đến file CSS thật của mình.
// import './styles.css';

// Component được cập nhật để nhận `value` và `onChange` từ React Hook Form
interface ProtocolSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="protocol-selector-group">
      {/* Label + Icon */}
      <label className="protocol-selector-label">
        <span className="protocol-selector-icon">
          <Shield size={16} />
        </span>
        GIAO THỨC
      </label>

      {/* Buttons */}
      <div className="protocol-selector">
        <button
          type="button"
          className={`protocol-btn ${value === "HTTP" ? "active" : ""}`}
          onClick={() => onChange("HTTP")}
        >
          HTTP
        </button>
        <button
          type="button"
          className={`protocol-btn ${value === "SOCKS5" ? "active" : ""}`}
          onClick={() => onChange("SOCKS5")}
        >
          SOCKS5
        </button>
      </div>
    </div>
  );
};

export default ProtocolSelector;
