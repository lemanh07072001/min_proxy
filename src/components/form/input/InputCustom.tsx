import React from "react";

import "./styles.css"; // import CSS riêng

interface InputCustom extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const CustomTextField: React.FC<InputCustom> = ({ label, icon, ...rest }) => {
  return (
    <div className="custom-textfield">
      {/* Label + Icon */}
      <label className="custom-textfield-label">
        {icon && <span className="custom-textfield-icon">{icon}</span>}
        {label}
      </label>

      {/* Input */}
      <input className="custom-textfield-input" {...rest} />
    </div>
  );
};

export default CustomTextField;