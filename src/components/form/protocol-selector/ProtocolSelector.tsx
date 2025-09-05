import React from 'react';
import { Shield } from 'lucide-react';
import "./styles.css";

// Interface cho protocol object
interface ProtocolOption {
  id: string;
  name: string;
  description?: string;
}

// Interface hỗ trợ cả cách sử dụng cũ và mới
interface ProtocolSelectorProps {
  // Cách sử dụng cũ (tương thích ngược)
  value?: string;
  onChange?: (newValue: string) => void;
  
  // Cách sử dụng mới (từ ProxyCard)
  protocols?: string[] | ProtocolOption[];
  selectedProtocol?: string;
  onProtocolChange?: (newValue: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({ 
  value, 
  onChange,
  protocols = ["HTTP", "SOCKS5"],
  selectedProtocol,
  onProtocolChange,
  label = "GIAO THỨC",
  required = false,
  error
}) => {
  // Xử lý protocols array - hỗ trợ cả string[] và ProtocolOption[]
  const processedProtocols = protocols.map(protocol => {
    if (typeof protocol === 'string') {
      return { id: protocol, name: protocol };
    }
    return protocol;
  });

  // Xác định giá trị hiện tại và hàm xử lý thay đổi
  const currentValue = selectedProtocol || value || processedProtocols[0]?.id;
  const handleChange = onProtocolChange || onChange || (() => {});

  return (
    <div className="protocol-selector-group">
      {/* Label + Icon */}
      <label className="protocol-selector-label">
        <span className="protocol-selector-icon">
          <Shield size={16} />
        </span>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="protocol-selector">
        {processedProtocols.map((protocol) => (
          <button
            key={protocol.id}
            type="button"
            className={`protocol-btn ${currentValue === protocol.id ? "active" : ""}`}
            onClick={() => handleChange(protocol.id)}
            title={protocol.description}
          >
            {protocol.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProtocolSelector;
