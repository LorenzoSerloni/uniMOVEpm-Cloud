/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Select, { components } from "react-select";
import type { StylesConfig, GroupBase, CSSObjectWithLabel } from "react-select";

const customStyles: StylesConfig<{ value: string; label: string }, true, GroupBase<{ value: string; label: string }>> = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "white",
    borderColor: "#848383",
    borderRadius: "0.350rem",
    minHeight: "2rem",
    boxShadow: "none",
    fontSize: "0.8rem",
    paddingLeft: "0.1rem",
    cursor: "pointer",
    display: "flex",
    flexWrap: "nowrap", // Prevent wrapping
    overflowX: "auto",  // Enable horizontal scroll
    overflowY: "hidden",
    alignItems: "flex-start",
  }),
  valueContainer: (base) => ({
    ...base,
    display: "flex",
    flexWrap: "nowrap", // Prevent wrapping
    overflowX: "auto",  // Enable horizontal scroll
    overflowY: "hidden",
    alignItems: "center",
    gap: "0.25rem",
  }),
  option: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: 500,
    fontSize: "0.8rem",
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.350rem",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
    marginTop: 2,
    zIndex: 20,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    transition: "all .2s",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <img src="./collapsing-gray.svg" alt="arrow" style={{ width: 9, height: 6 }} />
  </components.DropdownIndicator>
);

const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="2" x2="8" y2="8" stroke="#848383" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="1" y2="8" stroke="#848383" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </components.ClearIndicator>
);

interface SelectorProps {
  options: { value: string; label: string }[];
  value: { value: string; label: string }[];
  setValue: (value: { value: string; label: string }[]) => void;
}

const Selector = ({
  options,
  value,
  setValue,
}: SelectorProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // Auto-close when all options are selected
  useEffect(() => {
    if (value.length === options.length) {
      setMenuIsOpen(false);
    }
  }, [value, options.length]);

  return (
    <Select
      isMulti
      value={value}
      onChange={(opts) => setValue(opts as { value: string; label: string }[])}
      options={options}
      placeholder="Select type(s)"
      styles={customStyles}
      components={{ DropdownIndicator, ClearIndicator }}
      closeMenuOnSelect={false}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(false)}
    />
  );
};

export default Selector;