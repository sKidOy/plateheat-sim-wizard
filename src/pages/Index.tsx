
import React from 'react';
import PHESimulator from '../components/PHESimulator';
import InfoSection from '../components/InfoSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <InfoSection />
        <PHESimulator />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
