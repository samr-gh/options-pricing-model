'use client';

import React, { useState } from 'react';

const OptionsPricingModel = () => {
  const [stockPrice, setStockPrice] = useState(0);
  const [strikePrice, setStrikePrice] = useState(0);
  const [timeToMaturity, setTimeToMaturity] = useState(0);
  const [riskFreeRate, setRiskFreeRate] = useState(0);
  const [volatility, setVolatility] = useState(0);
  const [callPrice, setCallPrice] = useState(0);
  const [putPrice, setPutPrice] = useState(0);

  const calculateOptionPrice = () => {
    const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + volatility ** 2 / 2) * timeToMaturity) / (volatility * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatility * Math.sqrt(timeToMaturity);
    
    const callPrice = stockPrice * normCdf(d1) - strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * normCdf(d2);
    const putPrice = strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * normCdf(-d2) - stockPrice * normCdf(-d1);
    
    setCallPrice(callPrice);
    setPutPrice(putPrice);
  };

  const normCdf = (x:number) => {
    return (1 + erf(x / Math.sqrt(2))) / 2;
  };

  const erf = (x:number) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    let sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    
    let t = 1 / (1 + p * x);
    let y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Options Pricing Model</h1>
      <div className="flex flex-col justify-center items-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Option Prices</h2>
        <p>Call Price: {callPrice.toFixed(2)}</p>
        <p>Put Price: {putPrice.toFixed(2)}</p>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-2">Enter Inputs</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Price</label>
            <input type="number" value={stockPrice} onChange={(e) => setStockPrice(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Strike Price</label>
            <input type="number" value={strikePrice} onChange={(e) => setStrikePrice(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time to Maturity (years)</label>
            <input type="number" value={timeToMaturity} onChange={(e) => setTimeToMaturity(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk-Free Rate (%)</label>
            <input type="number" value={riskFreeRate} onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) / 100)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Volatility (%)</label>
            <input type="number" value={volatility} onChange={(e) => setVolatility(parseFloat(e.target.value) / 100)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <button onClick={calculateOptionPrice} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Calculate</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OptionsPricingModel;