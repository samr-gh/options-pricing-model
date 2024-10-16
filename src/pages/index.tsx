import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import components from Shadcn
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Rows } from "lucide-react";
import { time } from "console";

const OptionsPricingModel = () => {
  const [entryNumber, setEntryNumber] = useState(1);
  const [stockPrice, setStockPrice] = useState(100); // Default value of 100
  const [strikePrice, setStrikePrice] = useState(100); // Default value of 100
  const [timeToMaturity, setTimeToMaturity] = useState(1); // Default 1 year
  const [riskFreeRate, setRiskFreeRate] = useState(5); // Default 5%
  const [volatility, setVolatility] = useState(20); // Default 20%
  const [callPrice, setCallPrice] = useState(0);
  const [putPrice, setPutPrice] = useState(0);

  type TableRow = {
      entryNumber: number,
      stockPrice: number,
      strikePrice: number,
      timeToMaturity: number,
      riskFreeRate: number,
      volatility: number,
      callPrice: number,
      putPrice: number,
    } 
  
  // initialize history
  const [inputValues, setInputValues] = useState<TableRow[]>([]);

  // Auto-calculate option price whenever any of the inputs change
  useEffect(() => {
    if (
      stockPrice &&
      strikePrice &&
      timeToMaturity &&
      riskFreeRate &&
      volatility
    ) calculateOptionPrice()
  }, [stockPrice, strikePrice, timeToMaturity, riskFreeRate, volatility]);

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

  // late initialize most recent entry
  const createNewEntry = () => {
    useEffect
    // Move current top row down and append
    const newRow:TableRow = {
      entryNumber: entryNumber, stockPrice: stockPrice, strikePrice: strikePrice, 
      timeToMaturity: timeToMaturity, riskFreeRate: riskFreeRate, 
      volatility: volatility, callPrice: callPrice, putPrice: putPrice,
    }
    // update table
    setEntryNumber(entryNumber + 1)
    setInputValues([newRow, ...inputValues])
  }

  return (
    <div className="max-w-full mx-auto">
      <header className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md">
        <h1 className="text-xl font-bold flex dark:text-white">
          <div style={{textAlign: "center", flexGrow: "1"}}>
          Options Pricing Model
          </div>
          <div style={{justifyContent: "right"}}>
          <ModeToggle />
          </div>
        </h1>
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
            <Label className="dark:text-gray-300">
              Time to Maturity (years)
            </Label>
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
        <br></br>
        <div className="flex justify-center">
          <Button
          onClick={createNewEntry}>Record</Button>
        </div>
      </header>

      <div className="flex flex-col justify-center items-center p-12">

        <div className="flex space-x-4 text-center ">
          <div className="bg-green-500 dark:bg-green-700 text-white font-bold p-4 rounded-md w-52">
            Call Price: 
            <div>
            ${callPrice.toFixed(2)}
            </div>
          </div>
          <div className="bg-red-500 dark:bg-red-700 text-white font-bold p-4 rounded-md w-52">
            Put Price: 
            <div>
              ${putPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <br></br>

        
          
          <Table className="mb-10">
            <TableHeader>
              <TableRow>
                <TableHead># Entry</TableHead>
                <TableHead className="">Stock Price</TableHead>
                <TableHead>Strike Price</TableHead>
                <TableHead>Time to Maturity(Years)</TableHead>
                <TableHead className="">Risk-Free Rate</TableHead>
                <TableHead className="">Volatility</TableHead>
                <TableHead className="font-bold">Call Price</TableHead>
                <TableHead className="font-bold">Put Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map old rows */}
                <TableRow>
                <TableCell>{entryNumber}</TableCell>
                <TableCell className="font-medium">{stockPrice}</TableCell>
                <TableCell>{strikePrice}</TableCell>
                <TableCell>{timeToMaturity}</TableCell>
                <TableCell>{riskFreeRate}</TableCell>
                <TableCell>{volatility}</TableCell>
                <TableCell>{callPrice.toFixed(2)}</TableCell>
                <TableCell>{putPrice.toFixed(2)}</TableCell>
                </TableRow>
              <TableRow>
                <TableCell>
              <br></br>
              <span className="text-xl font-bold flex" style={{alignItems: 'center', flexGrow: '1'}}>History</span>
              <br></br>
                </TableCell>
              </TableRow>
            
              {
                inputValues.map((row, _) => (
                  <TableRow>
                    <TableCell>{row.entryNumber}</TableCell>
                    <TableCell>{row.stockPrice}</TableCell>
                    <TableCell>{row.strikePrice}</TableCell>
                    <TableCell>{row.timeToMaturity}</TableCell>
                    <TableCell>{row.riskFreeRate}</TableCell>
                    <TableCell>{row.volatility}</TableCell>
                    <TableCell>{row.callPrice.toFixed(2)}</TableCell>
                    <TableCell>{row.putPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              
            </TableBody>
          </Table>
        
      </div>
    </div>
  );
};

export default OptionsPricingModel;
