import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto"></div>
        <h1 className="text-white text-3xl font-bold mt-6">FoodFinder</h1>
        <p className="text-indigo-100 mt-2">
          Discovering delicious dining nearby...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;