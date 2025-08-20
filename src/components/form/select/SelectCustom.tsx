import React from "react";
import "./styles.css";

interface Option {
  label: string;
  value: string;
}

interface CustomFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  type?: "text" | "select"; // chọn kiểu
  options?: Option[]; // dùng khi type = select
}

const CustomField: React.FC<CustomFieldProps> = ({ label, icon, type = "text", options = [], ...rest }) => {
  return (
    <div className="custom-field">
      {/* Label + Icon */}
      <label className="custom-field-label">
        {icon && <span className="custom-field-icon">{icon}</span>}
        {label}
      </label>

      {/* Input hoặc Select */}
      {type === "select" ? (
        <select className="custom-field-select" {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {/*<option value="">-- Chọn --</option>*/}
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input className="custom-field-input" {...rest} />
      )}
    </div>
  );
};

export default CustomField;