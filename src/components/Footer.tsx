
import React from 'react';
import { Mail, Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">PHE Simulator Pro</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional heat exchanger simulation tool designed for engineers and researchers. 
              Accurate calculations, validated algorithms, and industry-standard results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Heat Transfer Analysis</li>
              <li>Fluid Property Calculation</li>
              <li>Performance Optimization</li>
              <li>Real-time Results</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Applications</h4>
            <ul className="space-y-2 text-gray-300">
              <li>HVAC Systems</li>
              <li>Chemical Processing</li>
              <li>Food Industry</li>
              <li>Power Generation</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PHE Simulator Pro. All rights reserved. Built for engineering excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
