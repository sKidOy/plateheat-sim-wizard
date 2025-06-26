
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Thermometer, Droplets } from 'lucide-react';
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

  const handleCalculate = () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    
    try {
      const result = calculatePHE({
        ...inputs as PHEInputs,
        mode,
        hotFluid
      });
      setResults(result);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Calculation error occurred']);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Input Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operation Mode */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Operation Mode</Label>
            <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'heating' | 'cooling')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heating" id="heating" />
                <Label htmlFor="heating">Heating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cooling" id="cooling" />
                <Label htmlFor="cooling">Cooling</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Hot Fluid Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Hot Fluid</Label>
            <RadioGroup value={hotFluid} onValueChange={(value) => setHotFluid(value as 'oil' | 'petrol' | 'diesel')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oil" id="oil" />
                <Label htmlFor="oil">Oil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="petrol" id="petrol" />
                <Label htmlFor="petrol">Petrol</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="diesel" id="diesel" />
                <Label htmlFor="diesel">Diesel</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Temperature and Flow Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Temperature Inputs
              </h3>
              
              {mode === 'heating' ? (
                <>
                  <div>
                    <Label htmlFor="T_h_in">Hot Fluid Inlet Temperature (°C)</Label>
                    <Input
                      id="T_h_in"
                      type="number"
                      value={inputs.T_h_in || ''}
                      onChange={(e) => handleInputChange('T_h_in', e.target.value)}
                      placeholder="e.g., 80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="T_c_out">Cold Fluid Outlet Temperature (°C)</Label>
                    <Input
                      id="T_c_out"
                      type="number"
                      value={inputs.T_c_out || ''}
                      onChange={(e) => handleInputChange('T_c_out', e.target.value)}
                      placeholder="e.g., 60"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="T_c_in">Cold Fluid Inlet Temperature (°C)</Label>
                    <Input
                      id="T_c_in"
                      type="number"
                      value={inputs.T_c_in || ''}
                      onChange={(e) => handleInputChange('T_c_in', e.target.value)}
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="T_h_out">Hot Fluid Outlet Temperature (°C)</Label>
                    <Input
                      id="T_h_out"
                      type="number"
                      value={inputs.T_h_out || ''}
                      onChange={(e) => handleInputChange('T_h_out', e.target.value)}
                      placeholder="e.g., 40"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Flow Rate
              </h3>
              <div>
                <Label htmlFor="massFlowRate">
                  {mode === 'heating' ? 'Hot' : 'Cold'} Fluid Mass Flow Rate (kg/s)
                </Label>
                <Input
                  id="massFlowRate"
                  type="number"
                  step="0.1"
                  value={inputs.massFlowRate || ''}
                  onChange={(e) => handleInputChange('massFlowRate', e.target.value)}
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Plate Specifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plate Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="L">Length (m)</Label>
                <Input
                  id="L"
                  type="number"
                  step="0.01"
                  value={inputs.L || ''}
                  onChange={(e) => handleInputChange('L', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="B">Breadth (m)</Label>
                <Input
                  id="B"
                  type="number"
                  step="0.01"
                  value={inputs.B || ''}
                  onChange={(e) => handleInputChange('B', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="b">Plate Gap (m)</Label>
                <Input
                  id="b"
                  type="number"
                  step="0.001"
                  value={inputs.b || ''}
                  onChange={(e) => handleInputChange('b', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="N">Number of Plates</Label>
                <Input
                  id="N"
                  type="number"
                  value={inputs.N || ''}
                  onChange={(e) => handleInputChange('N', e.target.value)}
                />
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleCalculate} className="w-full">
            Calculate PHE Performance
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hot Inlet:</span>
                    <span className="font-mono">{results.T_h_in.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hot Outlet:</span>
                    <span className="font-mono">{results.T_h_out.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cold Inlet:</span>
                    <span className="font-mono">{results.T_c_in.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cold Outlet:</span>
                    <span className="font-mono">{results.T_c_out.toFixed(1)}°C</span>
                  </div>
                </CardContent>
              </Card>

              {/* Heat Transfer Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heat Transfer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Heat Duty:</span>
                    <span className="font-mono">{results.Q.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hot Flow Rate:</span>
                    <span className="font-mono">{results.m_h.toFixed(2)} kg/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cold Flow Rate:</span>
                    <span className="font-mono">{results.m_c.toFixed(2)} kg/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LMTD:</span>
                    <span className="font-mono">{results.LMTD.toFixed(2)}°C</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fluid Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Velocities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hot Fluid:</span>
                    <span className="font-mono">{results.v_h.toFixed(3)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cold Fluid:</span>
                    <span className="font-mono">{results.v_c.toFixed(3)} m/s</span>
                  </div>
                </CardContent>
              </Card>

              {/* Hot Side Numbers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hot Side Dimensionless Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Reynolds:</span>
                    <span className="font-mono">{results.Re_h.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prandtl:</span>
                    <span className="font-mono">{results.Pr_h.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nusselt:</span>
                    <span className="font-mono">{results.Nu_h.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cold Side Numbers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cold Side Dimensionless Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Reynolds:</span>
                    <span className="font-mono">{results.Re_c.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prandtl:</span>
                    <span className="font-mono">{results.Pr_c.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nusselt:</span>
                    <span className="font-mono">{results.Nu_c.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Heat Transfer Coefficients */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heat Transfer Coefficients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall U:</span>
                    <span className="font-mono">{results.U.toFixed(0)} W/m²K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span className="font-mono">{results.A.toFixed(2)} m²</span>
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
