"use client";

import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 translate w-full ${
      outline
        ? "bg-white border-black text-black"
        : "bg-brand border-brand text-white"
    } ${
      small
        ? "py-1 text-sm font-light border"
        : "py-3 text-md font-semibold border-2"
    }`}
  >
    {Icon && <Icon size={24} className="absolute left-4 top-3" />}
    {label}
  </button>
);
export default Button;
