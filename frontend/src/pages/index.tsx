import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Token Launchpad</h1>
        <p className="text-gray-700">Welcome to the Token Creation Platform</p>
      </div>
    </div>
  );
};

export default HomePage;
