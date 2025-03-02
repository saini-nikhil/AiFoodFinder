import React from 'react';

const responsivebtn = ({setViewMode ,viewMode ,theme }) => {
  return (
    <div className="md:hidden mb-6">
    <div
      className={`${
        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
      } rounded-lg p-1 flex`}
    >
      <button
        onClick={() => setViewMode("split")}
        className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "split"
            ? `${
                theme === "dark"
                  ? "bg-gray-600 text-indigo-300"
                  : "bg-white text-indigo-700"
              } shadow-sm`
            : `${
                theme === "dark"
                  ? "text-gray-300 hover:text-indigo-300"
                  : "text-gray-600 hover:text-indigo-600"
              }`
        }`}
      >
        Both
      </button>
      <button
        onClick={() => setViewMode("map")}
        className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "map"
            ? `${
                theme === "dark"
                  ? "bg-gray-600 text-indigo-300"
                  : "bg-white text-indigo-700"
              } shadow-sm`
            : `${
                theme === "dark"
                  ? "text-gray-300 hover:text-indigo-300"
                  : "text-gray-600 hover:text-indigo-600"
              }`
        }`}
      >
        Map
      </button>
      <button
        onClick={() => setViewMode("voice")}
        className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "voice"
            ? `${
                theme === "dark"
                  ? "bg-gray-600 text-indigo-300"
                  : "bg-white text-indigo-700"
              } shadow-sm`
            : `${
                theme === "dark"
                  ? "text-gray-300 hover:text-indigo-300"
                  : "text-gray-600 hover:text-indigo-600"
              }`
        }`}
      >
        Voice
      </button>
    </div>
  </div>
  );
}

export default responsivebtn;
