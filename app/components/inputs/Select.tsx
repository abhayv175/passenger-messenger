"use client";

import { useEffect, useState } from "react";
import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: any) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="mt-1">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={mounted && typeof document !== "undefined" ? document.body : undefined}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            control: (base, state) => ({
              ...base,
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: state.isFocused ? "#6366f1" : "#334155",
              boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
              borderRadius: "0.75rem",
              padding: "2px 4px",
              color: "#f8fafc",
              "&:hover": {
                borderColor: "#475569",
              },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderWidth: "1px",
              borderRadius: "0.75rem",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#4f46e5"
                : state.isFocused
                ? "#1e293b"
                : "transparent",
              color: "#f8fafc",
              cursor: "pointer",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              borderRadius: "0.5rem",
              border: "1px solid rgba(99, 102, 241, 0.4)",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#c7d2fe",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#a5b4fc",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "#fca5a5",
              },
            }),
            input: (base) => ({
              ...base,
              color: "#f8fafc",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#f8fafc",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default Select;
