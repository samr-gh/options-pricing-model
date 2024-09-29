import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Import components from Shadcn
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

const OptionsPricingModel = () => {
  const [stockPrice, setStockPrice] = useState(0);
  const [strikePrice, setStrikePrice] = useState(0);
  const [timeToMaturity, setTimeToMaturity] = useState(0);
  const [riskFreeRate, setRiskFreeRate] = useState(0); // Store raw percentage
  const [volatility, setVolatility] = useState(0); // Store raw percentage
  const [callPrice, setCallPrice] = useState(0);
  const [putPrice, setPutPrice] = useState(0);

  const calculateOptionPrice = () => {
    const riskFreeRateDecimal = riskFreeRate / 100;
    const volatilityDecimal = volatility / 100;

    const d1 =
      (Math.log(stockPrice / strikePrice) +
        (riskFreeRateDecimal + volatilityDecimal ** 2 / 2) * timeToMaturity) /
      (volatilityDecimal * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatilityDecimal * Math.sqrt(timeToMaturity);

    const callPrice =
      stockPrice * normCdf(d1) -
      strikePrice *
        Math.exp(-riskFreeRateDecimal * timeToMaturity) *
        normCdf(d2);
    const putPrice =
      strikePrice *
        Math.exp(-riskFreeRateDecimal * timeToMaturity) *
        normCdf(-d2) -
      stockPrice * normCdf(-d1);

    setCallPrice(callPrice);
    setPutPrice(putPrice);
  };

  const normCdf = (x: number) => (1 + erf(x / Math.sqrt(2))) / 2;

  const erf = (x: number) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    let sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    let t = 1 / (1 + p * x);
    let y =
      1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  return (
    <div className="max-w-full mx-auto ">
      <header className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md">
        <h1 className="text-xl font-bold text-center dark:text-white">Options Pricing Model</h1>
        <ModeToggle />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div>
            <Label className="dark:text-gray-300">Stock Price</Label>
            <Input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(parseFloat(e.target.value))}
              className="w-full dark:bg-gray-700 dark:text-white"
              placeholder="Stock Price"
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Strike Price</Label>
            <Input
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(parseFloat(e.target.value))}
              className="w-full dark:bg-gray-700 dark:text-white"
              placeholder="Strike Price"
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Time to Maturity (years)</Label>
            <Input
              type="number"
              value={timeToMaturity}
              onChange={(e) => setTimeToMaturity(parseFloat(e.target.value))}
              className="w-full dark:bg-gray-700 dark:text-white"
              placeholder="Time to Maturity (Years)"
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Risk-Free Rate (%)</Label>
            <Input
              type="number"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
              className="w-full dark:bg-gray-700 dark:text-white"
              placeholder="Risk-Free Rate"
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Volatility (%)</Label>
            <Input
              type="number"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value))}
              className="w-full dark:bg-gray-700 dark:text-white"
              placeholder="Volatility"
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={calculateOptionPrice} className="w-full md:w-auto">
            Calculate
          </Button>
        </div>
      </header>

      <div className="flex flex-col justify-center items-center mt-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Option Prices</h2>
        <div className="flex space-x-4">
          <div className="bg-green-500 dark:bg-green-700 text-white font-bold p-4 rounded-md">
            Call Price: {callPrice.toFixed(2)}
          </div>
          <div className="bg-red-500 dark:bg-red-700 text-white font-bold p-4 rounded-md">
            Put Price: {putPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsPricingModel;
