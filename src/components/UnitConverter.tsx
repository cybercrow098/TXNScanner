import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

type UnitCategory = 'length' | 'mass' | 'temperature' | 'time' | 'data' | 'speed';

interface UnitConversion {
  from: string;
  to: string;
  value: string;
  result: string;
}

const UNIT_CATEGORIES: Record<UnitCategory, { name: string; units: string[] }> = {
  length: {
    name: 'Length',
    units: ['meters', 'kilometers', 'miles', 'feet', 'inches', 'yards']
  },
  mass: {
    name: 'Mass',
    units: ['grams', 'kilograms', 'pounds', 'ounces', 'metric tons']
  },
  temperature: {
    name: 'Temperature',
    units: ['Celsius', 'Fahrenheit', 'Kelvin']
  },
  time: {
    name: 'Time',
    units: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']
  },
  data: {
    name: 'Data',
    units: ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes']
  },
  speed: {
    name: 'Speed',
    units: ['m/s', 'km/h', 'mph', 'knots']
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>(UNIT_CATEGORIES[category].units[0]);
  const [toUnit, setToUnit] = useState<string>(UNIT_CATEGORIES[category].units[1]);
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const convert = () => {
    if (!value || isNaN(Number(value))) {
      setResult('');
      return;
    }

    const numValue = parseFloat(value);
    let converted: number;

    // Conversion logic for each category
    switch (category) {
      case 'length':
        converted = convertLength(numValue, fromUnit, toUnit);
        break;
      case 'mass':
        converted = convertMass(numValue, fromUnit, toUnit);
        break;
      case 'temperature':
        converted = convertTemperature(numValue, fromUnit, toUnit);
        break;
      case 'time':
        converted = convertTime(numValue, fromUnit, toUnit);
        break;
      case 'data':
        converted = convertData(numValue, fromUnit, toUnit);
        break;
      case 'speed':
        converted = convertSpeed(numValue, fromUnit, toUnit);
        break;
      default:
        converted = 0;
    }

    setResult(converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
    }));
  };

  // Conversion functions
  const convertLength = (value: number, from: string, to: string): number => {
    const meterConversion: Record<string, number> = {
      meters: 1,
      kilometers: 0.001,
      miles: 0.000621371,
      feet: 3.28084,
      inches: 39.3701,
      yards: 1.09361
    };

    const meters = value / meterConversion[from];
    return meters * meterConversion[to];
  };

  const convertMass = (value: number, from: string, to: string): number => {
    const gramConversion: Record<string, number> = {
      grams: 1,
      kilograms: 0.001,
      pounds: 0.00220462,
      ounces: 0.035274,
      'metric tons': 0.000001
    };

    const grams = value / gramConversion[from];
    return grams * gramConversion[to];
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case 'Celsius':
        celsius = value;
        break;
      case 'Fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'Kelvin':
        celsius = value - 273.15;
        break;
      default:
        return 0;
    }

    // Convert from Celsius to target unit
    switch (to) {
      case 'Celsius':
        return celsius;
      case 'Fahrenheit':
        return (celsius * 9/5) + 32;
      case 'Kelvin':
        return celsius + 273.15;
      default:
        return 0;
    }
  };

  const convertTime = (value: number, from: string, to: string): number => {
    const secondConversion: Record<string, number> = {
      seconds: 1,
      minutes: 1/60,
      hours: 1/3600,
      days: 1/86400,
      weeks: 1/604800,
      months: 1/2592000,
      years: 1/31536000
    };

    const seconds = value / secondConversion[from];
    return seconds * secondConversion[to];
  };

  const convertData = (value: number, from: string, to: string): number => {
    const byteConversion: Record<string, number> = {
      bytes: 1,
      kilobytes: 1/1024,
      megabytes: 1/1048576,
      gigabytes: 1/1073741824,
      terabytes: 1/1099511627776
    };

    const bytes = value / byteConversion[from];
    return bytes * byteConversion[to];
  };

  const convertSpeed = (value: number, from: string, to: string): number => {
    const msConversion: Record<string, number> = {
      'm/s': 1,
      'km/h': 3.6,
      'mph': 2.23694,
      'knots': 1.94384
    };

    const ms = value / msConversion[from];
    return ms * msConversion[to];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Converter Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">Unit Converter</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value as UnitCategory;
                    setCategory(newCategory);
                    setFromUnit(UNIT_CATEGORIES[newCategory].units[0]);
                    setToUnit(UNIT_CATEGORIES[newCategory].units[1]);
                    setResult('');
                  }}
                  className="cyber-input w-full"
                >
                  {Object.entries(UNIT_CATEGORIES).map(([key, { name }]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value);
                      setResult('');
                    }}
                    className="cyber-input w-full"
                  >
                    {UNIT_CATEGORIES[category].units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <ArrowRight className="w-5 h-5 text-cyber-secondary/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <select
                    value={toUnit}
                    onChange={(e) => {
                      setToUnit(e.target.value);
                      setResult('');
                    }}
                    className="cyber-input w-full"
                  >
                    {UNIT_CATEGORIES[category].units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setResult('');
                  }}
                  onKeyUp={() => convert()}
                  placeholder="Enter value..."
                  className="cyber-input w-full"
                />
              </div>

              <button
                onClick={convert}
                className="cyber-button cyber-button-primary w-full"
              >
                <Calculator className="w-4 h-4" />
                <span>Convert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <div className="cyber-card">
              <div className="space-y-6">
                <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">Input</span>
                      <span className="text-lg font-bold break-all">
                        {value} {fromUnit}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">Result</span>
                      <span className="text-2xl font-bold text-cyber-accent break-all">
                        {result} {toUnit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cyber-card">
                  <h3 className="text-lg font-bold mb-4">Common Conversions</h3>
                  <div className="space-y-2 text-sm text-cyber-secondary/70">
                    {category === 'length' && (
                      <>
                        <p>• 1 mile = 1.60934 kilometers</p>
                        <p>• 1 foot = 0.3048 meters</p>
                        <p>• 1 inch = 2.54 centimeters</p>
                      </>
                    )}
                    {category === 'mass' && (
                      <>
                        <p>• 1 kilogram = 2.20462 pounds</p>
                        <p>• 1 pound = 16 ounces</p>
                        <p>• 1 metric ton = 1000 kilograms</p>
                      </>
                    )}
                    {category === 'temperature' && (
                      <>
                        <p>• 0°C = 32°F</p>
                        <p>• 100°C = 212°F</p>
                        <p>• 0°C = 273.15K</p>
                      </>
                    )}
                    {category === 'time' && (
                      <>
                        <p>• 1 year = 365.25 days</p>
                        <p>• 1 week = 168 hours</p>
                        <p>• 1 day = 86400 seconds</p>
                      </>
                    )}
                    {category === 'data' && (
                      <>
                        <p>• 1 kilobyte = 1024 bytes</p>
                        <p>• 1 megabyte = 1024 kilobytes</p>
                        <p>• 1 gigabyte = 1024 megabytes</p>
                      </>
                    )}
                    {category === 'speed' && (
                      <>
                        <p>• 1 mph = 1.60934 km/h</p>
                        <p>• 1 m/s = 3.6 km/h</p>
                        <p>• 1 knot = 1.852 km/h</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}