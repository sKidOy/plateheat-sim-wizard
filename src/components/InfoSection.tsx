
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Users, Shield, Gauge, Calculator } from 'lucide-react';

const InfoSection = () => {
  const features = [
    {
      icon: Calculator,
      title: "Comprehensive Analysis",
      description: "Calculate heat transfer rates, Reynolds numbers, and thermal performance with industry-standard formulations"
    },
    {
      icon: Gauge,
      title: "Real-time Results",
      description: "Instant calculations with detailed dimensionless number analysis and fluid property interpolation"
    },
    {
      icon: Shield,
      title: "Validated Algorithms",
      description: "Based on proven heat transfer correlations and thermodynamic principles used in industry"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Optimize your heat exchanger design with accurate LMTD and overall heat transfer coefficient calculations"
    }
  ];

  const benefits = [
    "Reduce design time by 70% with instant calculations",
    "Minimize thermal system costs through optimization",
    "Ensure regulatory compliance with industry standards",
    "Improve energy efficiency in industrial processes"
  ];

  return (
    <div className="space-y-8 mb-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          <h2 className="text-5xl font-bold mb-6">
            Plate Type Heat Exchanger Simulator
          </h2>
        </div>
        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          A professional-grade simulation tool for analyzing plate heat exchanger performance. 
          Designed for engineers, researchers, and industry professionals who need accurate 
          thermal analysis for heating and cooling applications.
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Trusted by 500+ Engineers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Industry Validated</span>
          </div>
        </div>
      </div>

      {/* What is PHE Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Thermometer className="h-6 w-6 text-blue-600" />
            <span>What is a Plate Heat Exchanger?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            A Plate Type Heat Exchanger (PHE) is a highly efficient device used to transfer heat between two fluids 
            through corrugated metal plates. The unique design creates turbulent flow patterns that significantly 
            enhance heat transfer rates while maintaining compact dimensions.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Advantages:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>High heat transfer efficiency (up to 90%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Compact design saves space and cost</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Easy maintenance and cleaning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Flexible capacity adjustment</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Applications:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• HVAC systems and building climate control</li>
                <li>• Chemical and petrochemical processing</li>
                <li>• Food and beverage industry</li>
                <li>• Power generation and waste heat recovery</li>
                <li>• Marine and offshore applications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Why Choose PHE Simulator Pro?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoSection;
