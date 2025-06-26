
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Thermometer, Droplets, Play, Download, BarChart3 } from 'lucide-react';
import { calculatePHE, PHEInputs, PHEResults } from '../utils/pheCalculations';

const PHESimulator = () => {
  const [mode, setMode] = useState<'heating' | 'cooling'>('heating');
  const [hotFluid, setHotFluid] = useState<'oil' | 'petrol' | 'diesel'>('oil');
  const [inputs, setInputs] = useState<Partial<PHEInputs>>({
    L: 0.5,
    B: 0.1,
    b: 0.003,
    N: 10
  });
  const [results, setResults] = useState<PHEResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (key: keyof PHEInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [key]: numValue }));
  };

  const validateInputs = (): string[] => {
    const errors: string[] = [];
    
    if (!inputs.massFlowRate || inputs.massFlowRate <= 0) {
      errors.push('Mass flow rate must be greater than 0');
    }
    
    if (mode === 'heating') {
      if (!inputs.T_h_in || inputs.T_h_in <= 0) {
        errors.push('Hot fluid inlet temperature must be greater than 0°C');
      }
      if (!inputs.T_c_out || inputs.T_c_out <= 0) {
        errors.push('Cold fluid outlet temperature must be greater than 0°C');
      }
      if (inputs.T_h_in && inputs.T_c_out && inputs.T_h_in <= inputs.T_c_out) {
        errors.push('Hot fluid inlet temperature must be greater than cold fluid outlet temperature');
      }
    } else {
      if (!inputs.T_c_in || inputs.T_c_in <= 0) {
        errors.push('Cold fluid inlet temperature must be greater than 0°C');
      }
      if (!inputs.T_h_out || inputs.T_h_out <= 0) {
        errors.push('Hot fluid outlet temperature must be greater than 0°C');
      }
      if (inputs.T_c_in && inputs.T_h_out && inputs.T_c_in >= inputs.T_h_out) {
        errors.push('Cold fluid inlet temperature must be less than hot fluid outlet temperature');
      }
    }

    if (!inputs.L || inputs.L <= 0) {
      errors.push('Plate length must be greater than 0');
    }
    if (!inputs.B || inputs.B <= 0) {
      errors.push('Plate breadth must be greater than 0');
    }
    if (!inputs.b || inputs.b <= 0) {
      errors.push('Plate gap must be greater than 0');
    }
    if (!inputs.N || inputs.N <= 0) {
      errors.push('Number of plates must be greater than 0');
    }

    return errors;
  };

  const handleCalculate = async () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsCalculating(true);
    
    try {
      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = calculatePHE({
        ...inputs as PHEInputs,
        mode,
        hotFluid
      });
      setResults(result);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Calculation error occurred']);
    } finally {
      setIsCalculating(false);
    }
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      mode,
      hotFluid,
      inputs,
      results,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phe-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Input Section */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calculator className="h-7 w-7" />
            Simulation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Operation Mode */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Label className="text-lg font-semibold mb-4 block text-gray-800">Operation Mode</Label>
            <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'heating' | 'cooling')}>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'heating' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="heating" id="heating" />
                    <Label htmlFor="heating" className="font-medium cursor-pointer">Heating Mode</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Hot fluid heats cold fluid</p>
                </div>
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'cooling' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cooling" id="cooling" />
                    <Label htmlFor="cooling" className="font-medium cursor-pointer">Cooling Mode</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Cold fluid cools hot fluid</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          {/* Hot Fluid Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Label className="text-lg font-semibold mb-4 block text-gray-800">Hot Fluid Selection</Label>
            <RadioGroup value={hotFluid} onValueChange={(value) => setHotFluid(value as 'oil' | 'petrol' | 'diesel')}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'oil', label: 'Oil', desc: 'High viscosity, good heat capacity' },
                  { value: 'petrol', label: 'Petrol', desc: 'Low viscosity, volatile' },
                  { value: 'diesel', label: 'Diesel', desc: 'Medium viscosity, stable' }
                ].map((fluid) => (
                  <div key={fluid.value} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${hotFluid === fluid.value ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={fluid.value} id={fluid.value} />
                      <Label htmlFor={fluid.value} className="font-medium cursor-pointer">{fluid.label}</Label>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{fluid.desc}</p>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          {/* Temperature and Flow Inputs */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  Temperature Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mode === 'heating' ? (
                  <>
                    <div>
                      <Label htmlFor="T_h_in" className="text-sm font-medium">Hot Fluid Inlet Temperature (°C)</Label>
                      <Input
                        id="T_h_in"
                        type="number"
                        value={inputs.T_h_in || ''}
                        onChange={(e) => handleInputChange('T_h_in', e.target.value)}
                        placeholder="e.g., 80"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="T_c_out" className="text-sm font-medium">Cold Fluid Outlet Temperature (°C)</Label>
                      <Input
                        id="T_c_out"
                        type="number"
                        value={inputs.T_c_out || ''}
                        onChange={(e) => handleInputChange('T_c_out', e.target.value)}
                        placeholder="e.g., 60"
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="T_c_in" className="text-sm font-medium">Cold Fluid Inlet Temperature (°C)</Label>
                      <Input
                        id="T_c_in"
                        type="number"
                        value={inputs.T_c_in || ''}
                        onChange={(e) => handleInputChange('T_c_in', e.target.value)}
                        placeholder="e.g., 20"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="T_h_out" className="text-sm font-medium">Hot Fluid Outlet Temperature (°C)</Label>
                      <Input
                        id="T_h_out"
                        type="number"
                        value={inputs.T_h_out || ''}
                        onChange={(e) => handleInputChange('T_h_out', e.target.value)}
                        placeholder="e.g., 40"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-teal-50 border-teal-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-teal-600" />
                  Flow Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="massFlowRate" className="text-sm font-medium">
                    {mode === 'heating' ? 'Hot' : 'Cold'} Fluid Mass Flow Rate (kg/s)
                  </Label>
                  <Input
                    id="massFlowRate"
                    type="number"
                    step="0.1"
                    value={inputs.massFlowRate || ''}
                    onChange={(e) => handleInputChange('massFlowRate', e.target.value)}
                    placeholder="e.g., 2.5"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Plate Specifications */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Plate Heat Exchanger Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="L" className="text-sm font-medium">Length (m)</Label>
                <Input
                  id="L"
                  type="number"
                  step="0.01"
                  value={inputs.L || ''}
                  onChange={(e) => handleInputChange('L', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="B" className="text-sm font-medium">Breadth (m)</Label>
                <Input
                  id="B"
                  type="number"
                  step="0.01"
                  value={inputs.B || ''}
                  onChange={(e) => handleInputChange('B', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="b" className="text-sm font-medium">Plate Gap (m)</Label>
                <Input
                  id="b"
                  type="number"
                  step="0.001"
                  value={inputs.b || ''}
                  onChange={(e) => handleInputChange('b', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="N" className="text-sm font-medium">Number of Plates</Label>
                <Input
                  id="N"
                  type="number"
                  value={inputs.N || ''}
                  onChange={(e) => handleInputChange('N', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleCalculate} 
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg py-6"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Run PHE Simulation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Results Section */}
      {results && (
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart3 className="h-7 w-7" />
                Simulation Results
              </CardTitle>
              <Button 
                onClick={exportResults}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature Results */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Temperature Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hot Inlet:</span>
                    <span className="font-mono text-lg font-bold text-red-600">{results.T_h_in.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hot Outlet:</span>
                    <span className="font-mono text-lg font-bold text-orange-600">{results.T_h_out.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cold Inlet:</span>
                    <span className="font-mono text-lg font-bold text-blue-600">{results.T_c_in.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cold Outlet:</span>
                    <span className="font-mono text-lg font-bold text-teal-600">{results.T_c_out.toFixed(1)}°C</span>
                  </div>
                </CardContent>
              </Card>

              {/* Heat Transfer Results */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Heat Transfer Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Heat Duty:</span>
                    <span className="font-mono text-lg font-bold text-green-600">{results.Q.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hot Flow Rate:</span>
                    <span className="font-mono text-sm">{results.m_h.toFixed(2)} kg/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cold Flow Rate:</span>
                    <span className="font-mono text-sm">{results.m_c.toFixed(2)} kg/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">LMTD:</span>
                    <span className="font-mono text-lg font-bold text-emerald-600">{results.LMTD.toFixed(2)}°C</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fluid Velocities */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Fluid Velocities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hot Fluid:</span>
                    <span className="font-mono text-lg font-bold text-blue-600">{results.v_h.toFixed(3)} m/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cold Fluid:</span>
                    <span className="font-mono text-lg font-bold text-cyan-600">{results.v_c.toFixed(3)} m/s</span>
                  </div>
                </CardContent>
              </Card>

              {/* Hot Side Dimensionless Numbers */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-700">Hot Side Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reynolds:</span>
                    <span className="font-mono text-sm font-bold">{results.Re_h.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prandtl:</span>
                    <span className="font-mono text-sm font-bold">{results.Pr_h.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Nusselt:</span>
                    <span className="font-mono text-sm font-bold">{results.Nu_h.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cold Side Dimensionless Numbers */}
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-700">Cold Side Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reynolds:</span>
                    <span className="font-mono text-sm font-bold">{results.Re_c.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prandtl:</span>
                    <span className="font-mono text-sm font-bold">{results.Pr_c.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Nusselt:</span>
                    <span className="font-mono text-sm font-bold">{results.Nu_c.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Performance */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-700">Overall Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall U:</span>
                    <span className="font-mono text-lg font-bold text-yellow-600">{results.U.toFixed(0)} W/m²K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Heat Transfer Area:</span>
                    <span className="font-mono text-lg font-bold text-orange-600">{results.A.toFixed(2)} m²</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PHESimulator;
