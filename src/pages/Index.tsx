
import React from 'react';
import PHESimulator from '../components/PHESimulator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Plate Type Heat Exchanger Simulator
          </h1>
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-gray-700 leading-relaxed">
              A Plate Type Heat Exchanger (PHE) is a highly efficient device used to transfer heat between two fluids through metal plates. 
              It is widely used in industries for both heating and cooling purposes. This tool allows users to simulate a PHE and 
              determine key thermal parameters by selecting operation mode and fluid inputs.
            </p>
          </div>
        </div>
        <PHESimulator />
      </div>
    </div>
  );
};

export default Index;
