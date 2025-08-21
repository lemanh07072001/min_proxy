import React from "react";

import "./styles.css"
import "../main.css"

interface ClassNameMap {
  container?: string;
  label?: string;
  icon?: string; // Thêm class cho icon
  textarea?: string;
}

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode; // Thêm prop icon
  classNames?: ClassNameMap;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
                                                         label,
                                                         icon, // Destructure icon
                                                         classNames = {},

                                                         className,
                                                         ...rest
                                                       }) => {

  const containerClasses = `custom-field ${classNames.container || ''}`.trim();
  const labelClasses = `custom-field-label ${classNames.label || ''}`.trim();
  const iconClasses = `custom-field-icon ${classNames.icon || ''}`.trim(); // Class cho icon
  const textareaClasses = `form-textarea-check  ${classNames.textarea || ''} ${className || ''}`.trim();

  return (
    <div className={containerClasses}>
      <label className={labelClasses}>
        {/* Render icon nếu có */}
        {icon && <span className={iconClasses}>{icon}</span>}
        {label}
      </label>

      {/* Áp dụng các lớp CSS đã được kết hợp */}
      <textarea className={textareaClasses} {...rest} />
    </div>
  );
};

export default CustomTextarea;
