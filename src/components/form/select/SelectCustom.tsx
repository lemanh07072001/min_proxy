import React from "react";

import "./styles.css";
import "../main.css"

// Giả sử bạn có một file CSS riêng cho component này
// import "./styles.css";

// --- 1. Định nghĩa interface cho object classNames ---
interface ClassNameMap {
  container?: string;
  label?: string;
  icon?: string;
  select?: string;
}

interface Option {
  label: string;
  value: string;
}

// --- 2. Định nghĩa interface props cho CustomSelect ---
interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  options: Option[]; // options là bắt buộc cho select
  classNames?: ClassNameMap;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                     label,
                                                     icon,
                                                     options = [],
                                                     classNames = {},
                                                     ...rest
                                                   }) => {
  // --- 3. Kết hợp class an toàn cho tất cả các phần tử ---
  const containerClasses = ['custom-field', classNames.container].filter(Boolean).join(' ');
  const labelClasses = ['custom-field-label', classNames.label].filter(Boolean).join(' ');
  const iconClasses = ['custom-field-icon', classNames.icon].filter(Boolean).join(' ');
  const selectClasses = ['custom-field-select', classNames.select, rest.className].filter(Boolean).join(' ');

  // Xóa className khỏi rest để tránh bị áp dụng hai lần
  delete rest.className;

  return (
    <div className={containerClasses}>
      <label className={labelClasses}>
        {icon && <span className={iconClasses}>{icon}</span>}
        {label}
      </label>

      <select className={selectClasses} {...rest}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;