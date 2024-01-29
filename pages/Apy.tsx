//apy button
import React from 'react';

interface ButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-20 text-center py-2 rounded-xl ring-1 hover:ring-[#aa72ce] hover:shadow-lg hover:shadow-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]
    ${isActive ? 'ring-[#aa72ce] shadow-lg shadow-[#aa72ce] ' : 'ring-[#262548]'}`}
  >
    {label}
  </button>
);

export default Button;