import React from "react";

interface TextboxProps {
  placeholder?: string;
  rows?: number;
  cols?: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const Textbox: React.FC<TextboxProps> = ({
  placeholder = "Enter your text...",
  rows = 4,
  cols = 50,
  value,
  onChange,
  onSubmit
}) => {
  return (
    <div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onSubmit}
      >Submit</button>
    </div>
  );
};

export default Textbox;
