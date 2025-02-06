import React from "react";

interface TextboxProps {
  placeholder?: string;
  rows?: number;
  cols?: number;
  value: string;
  disable?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const Textbox: React.FC<TextboxProps> = ({
  placeholder = "Enter your text...",
  rows = 4,
  cols = 50,
  value,
  disable,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
      <textarea
        className={`w-full p-3 border ${
          disable ? "text-gray-400" : "text-white"
        } border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ease-in-out resize-none hover:shadow-md bg-gray-700`}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        value={value}
        disabled={disable}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        onClick={onSubmit}
        disabled={disable}
      >
        Submit
      </button>
    </div>
  );
};

export default Textbox;
