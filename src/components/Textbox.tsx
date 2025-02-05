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
    <div className="p-4 bg-white rounded-lg shadow-lg animate-fade-in">
      
      <textarea
        className="w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out resize-none hover:shadow-md"
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

     
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default Textbox;