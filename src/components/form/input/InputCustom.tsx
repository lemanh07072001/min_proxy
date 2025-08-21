import React from "react";
import "./styles.css"; // import CSS riêng
import "../main.css"
// Giả sử bạn có một file CSS riêng cho component này
// import "./styles.css";

// --- THAY ĐỔI 1: Định nghĩa interface cho object classNames ---
interface ClassNameMap {
  container?: string;
  label?: string;
  icon?: string;
  input?: string;
}

// --- Cập nhật interface props chính ---
interface InputCustom extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  classNames?: ClassNameMap;
}

const CustomTextField: React.FC<InputCustom> = ({
                                                  label,
                                                  icon,
                                                  classNames = {},
                                                  ...rest
                                                }) => {
  // --- THAY ĐỔI: Sử dụng một cách kết hợp class an toàn hơn ---
  // Cách này đảm bảo class gốc và class tùy chỉnh luôn được kết hợp đúng cách.
  const containerClasses = ['custom-textfield', classNames.container].filter(Boolean).join(' ');
  const labelClasses = ['custom-textfield-label', classNames.label].filter(Boolean).join(' ');
  const iconClasses = ['custom-textfield-icon', classNames.icon].filter(Boolean).join(' ');
  const inputClasses = ['custom-textfield-input', classNames.input, rest.className].filter(Boolean).join(' ');

  // Xóa className khỏi rest để tránh bị áp dụng hai lần
  delete rest.className;

  return (
    <div className={containerClasses}>
      <label className={labelClasses}>
        {icon && <span className={iconClasses}>{icon}</span>}
        {label}
      </label>
      <input
        className={inputClasses}
        {...rest}
      />
    </div>
  );
};

export default CustomTextField;