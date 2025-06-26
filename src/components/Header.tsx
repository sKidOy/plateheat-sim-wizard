
import React from 'react';
import { Thermometer, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-full">
              <Thermometer className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                PHE Simulator Pro
              </h1>
              <p className="text-gray-600 font-medium">
                Professional Heat Exchanger Analysis Tool
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Industry Grade</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
