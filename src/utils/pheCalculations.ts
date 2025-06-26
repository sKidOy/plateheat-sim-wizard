
export interface PHEInputs {
  mode: 'heating' | 'cooling';
  hotFluid: 'oil' | 'petrol' | 'diesel';
  T_h_in?: number;
  T_h_out?: number;
  T_c_in?: number;
  T_c_out?: number;
  massFlowRate: number;
  L: number;
  B: number;
  b: number;
  N: number;
}

export interface PHEResults {
  T_h_in: number;
  T_h_out: number;
  T_c_in: number;
  T_c_out: number;
  Q: number;
  m_h: number;
  m_c: number;
  v_h: number;
  v_c: number;
  Re_h: number;
  Re_c: number;
  Pr_h: number;
  Pr_c: number;
  Nu_h: number;
  Nu_c: number;
  U: number;
  A: number;
  LMTD: number;
}

// Fluid properties
const fluidProperties = {
  oil: { cp: 2100, rho: 850, mu: 0.001, k: 0.145 },
  petrol: { cp: 2220, rho: 740, mu: 0.0003, k: 0.12 },
  diesel: { cp: 2010, rho: 820, mu: 0.0025, k: 0.135 }
};

// Water properties interpolation based on temperature
const getWaterProperties = (temp: number) => {
  // Simplified water properties interpolation
  const tempData = [
    { T: 20, cp: 4182, rho: 998.2, mu: 0.001002, k: 0.598 },
    { T: 30, cp: 4178, rho: 995.7, mu: 0.000798, k: 0.615 },
    { T: 40, cp: 4179, rho: 992.2, mu: 0.000653, k: 0.631 },
    { T: 50, cp: 4181, rho: 988.1, mu: 0.000547, k: 0.644 },
    { T: 60, cp: 4185, rho: 983.2, mu: 0.000467, k: 0.654 },
    { T: 70, cp: 4190, rho: 977.8, mu: 0.000404, k: 0.663 },
    { T: 80, cp: 4197, rho: 971.8, mu: 0.000355, k: 0.670 },
    { T: 90, cp: 4205, rho: 965.3, mu: 0.000315, k: 0.675 }
  ];

  // Linear interpolation
  const interpolate = (temp: number, prop: keyof typeof tempData[0]) => {
    if (temp <= tempData[0].T) return tempData[0][prop] as number;
    if (temp >= tempData[tempData.length - 1].T) return tempData[tempData.length - 1][prop] as number;

    for (let i = 0; i < tempData.length - 1; i++) {
      if (temp >= tempData[i].T && temp <= tempData[i + 1].T) {
        const x1 = tempData[i].T;
        const x2 = tempData[i + 1].T;
        const y1 = tempData[i][prop] as number;
        const y2 = tempData[i + 1][prop] as number;
        return y1 + (y2 - y1) * (temp - x1) / (x2 - x1);
      }
    }
    return tempData[0][prop] as number;
  };

  return {
    cp: interpolate(temp, 'cp'),
    rho: interpolate(temp, 'rho'),
    mu: interpolate(temp, 'mu'),
    k: interpolate(temp, 'k')
  };
};

export const calculatePHE = (inputs: PHEInputs): PHEResults => {
  const { mode, hotFluid, massFlowRate, L, B, b, N } = inputs;
  
  // Get hot fluid properties
  const hotFluidProps = fluidProperties[hotFluid];
  
  let T_h_in: number, T_h_out: number, T_c_in: number, T_c_out: number;
  let m_h: number, m_c: number;

  if (mode === 'heating') {
    T_h_in = inputs.T_h_in!;
    T_c_out = inputs.T_c_out!;
    m_h = massFlowRate;
    
    // Calculate T_c_in and T_h_out
    T_c_in = 25; // Assumed cold water inlet temperature
    
    // Heat balance: m_h * cp_h * (T_h_in - T_h_out) = m_c * cp_c * (T_c_out - T_c_in)
    // Assume T_h_out = T_h_in - 20 (temperature drop)
    T_h_out = T_h_in - 20;
    
    const Q_calc = m_h * hotFluidProps.cp * (T_h_in - T_h_out) / 1000; // kW
    
    // Calculate cold water average temperature for properties
    const T_c_avg = (T_c_in + T_c_out) / 2;
    const coldFluidProps = getWaterProperties(T_c_avg);
    
    m_c = (Q_calc * 1000) / (coldFluidProps.cp * (T_c_out - T_c_in));
  } else {
    T_c_in = inputs.T_c_in!;
    T_h_out = inputs.T_h_out!;
    m_c = massFlowRate;
    
    // Calculate T_h_in and T_c_out
    T_h_in = T_h_out + 30; // Assumed temperature difference
    T_c_out = T_c_in + 25; // Assumed temperature rise
    
    const T_c_avg = (T_c_in + T_c_out) / 2;
    const coldFluidProps = getWaterProperties(T_c_avg);
    
    const Q_calc = m_c * coldFluidProps.cp * (T_c_out - T_c_in) / 1000; // kW
    m_h = (Q_calc * 1000) / (hotFluidProps.cp * (T_h_in - T_h_out));
  }

  // Calculate heat duty
  const Q = m_h * hotFluidProps.cp * (T_h_in - T_h_out) / 1000; // kW

  // Calculate average temperatures for fluid properties
  const T_h_avg = (T_h_in + T_h_out) / 2;
  const T_c_avg = (T_c_in + T_c_out) / 2;
  const coldFluidProps = getWaterProperties(T_c_avg);

  // Calculate velocities
  const A_flow = B * b; // Flow area per channel
  const v_h = m_h / (hotFluidProps.rho * A_flow * (N - 1) / 2); // Hot fluid velocity
  const v_c = m_c / (coldFluidProps.rho * A_flow * (N - 1) / 2); // Cold fluid velocity

  // Calculate hydraulic diameter
  const D_h = 2 * b; // Hydraulic diameter for plate heat exchanger

  // Calculate Reynolds numbers
  const Re_h = (hotFluidProps.rho * v_h * D_h) / hotFluidProps.mu;
  const Re_c = (coldFluidProps.rho * v_c * D_h) / coldFluidProps.mu;

  // Calculate Prandtl numbers
  const Pr_h = (hotFluidProps.cp * hotFluidProps.mu) / hotFluidProps.k;
  const Pr_c = (coldFluidProps.cp * coldFluidProps.mu) / coldFluidProps.k;

  // Calculate Nusselt numbers (using Dittus-Boelter correlation)
  const Nu_h = 0.023 * Math.pow(Re_h, 0.8) * Math.pow(Pr_h, 0.4);
  const Nu_c = 0.023 * Math.pow(Re_c, 0.8) * Math.pow(Pr_c, 0.4);

  // Calculate heat transfer coefficients
  const h_h = (Nu_h * hotFluidProps.k) / D_h;
  const h_c = (Nu_c * coldFluidProps.k) / D_h;

  // Calculate overall heat transfer coefficient (assuming no fouling)
  const U = 1 / (1/h_h + 1/h_c);

  // Calculate Log Mean Temperature Difference (LMTD)
  const delta_T1 = T_h_in - T_c_out;
  const delta_T2 = T_h_out - T_c_in;
  const LMTD = (delta_T1 - delta_T2) / Math.log(delta_T1 / delta_T2);

  // Calculate required heat transfer area
  const A = (Q * 1000) / (U * LMTD);

  return {
    T_h_in,
    T_h_out,
    T_c_in,
    T_c_out,
    Q,
    m_h,
    m_c,
    v_h,
    v_c,
    Re_h,
    Re_c,
    Pr_h,
    Pr_c,
    Nu_h,
    Nu_c,
    U,
    A,
    LMTD: Math.abs(LMTD)
  };
};
