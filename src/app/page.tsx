"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Line } from "recharts";
import { AlertCircle, TrendingUp, CloudRain, Sun, Wind, RefreshCw } from "lucide-react";

export default function HomePage() {
  // State for various dashboard elements
  const [btcPrice, setBtcPrice] = useState("Loading...");
  const [ethPrice, setEthPrice] = useState("Loading...");
  const [temperature, setTemperature] = useState("Loading...");
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("New York");
  const [alerts, setAlerts] = useState([]);

  // Weather data for different cities
  const cities = ["New York", "London", "Tokyo", "Sydney"];
  const weatherData = {
    "New York": { temp: "18°C", condition: "Clear" },
    "London": { temp: "12°C", condition: "Rainy" },
    "Tokyo": { temp: "22°C", condition: "Sunny" },
    "Sydney": { temp: "25°C", condition: "Cloudy" },
  };

  // Simulated live update with more realistic data
  useEffect(() => {
    // Initial delay to simulate loading
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Generate initial chart data
    generateChartData();

    // Simulate live price updates with small variations
    const interval = setInterval(() => {
      // Simulate price fluctuations
      const btcBasePrice = 67000;
      const ethBasePrice = 3200;
      const btcVariation = Math.floor(Math.random() * 1000) - 500;
      const ethVariation = Math.floor(Math.random() * 200) - 100;
      
      const newBtcPrice = btcBasePrice + btcVariation;
      const newEthPrice = ethBasePrice + ethVariation;
      
      setBtcPrice(`$${newBtcPrice.toLocaleString()}`);
      setEthPrice(`$${newEthPrice.toLocaleString()}`);
      
      // Update chart data periodically
      if (Math.random() > 0.7) {
        updateChartData(newBtcPrice);
      }
      
      // Occasionally add alerts
      if (Math.random() > 0.9) {
        addRandomAlert();
      }
      
      // Update weather data
      setTemperature(weatherData[selectedCity].temp);
      setWeatherCondition(weatherData[selectedCity].condition);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimer);
    };
  }, [selectedCity]);

  // Generate mock chart data
  const generateChartData = () => {
    const data = [];
    const basePrice = 67000;
    
    for (let i = 0; i < 24; i++) {
      const variation = Math.floor(Math.random() * 2000) - 1000;
      data.push({
        time: `${i}:00`,
        btc: basePrice + variation,
      });
    }
    
    setChartData(data);
  };

  // Update chart data with new values
  const updateChartData = (newPrice) => {
    const newChartData = [...chartData.slice(1), {
      time: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      btc: newPrice
    }];
    
    setChartData(newChartData);
  };

  // Add a random alert
  const addRandomAlert = () => {
    const alertTypes = [
      "BTC price surge detected! Up 5% in the last hour.",
      "Weather alert: Storm approaching in selected region.",
      "New crypto regulations announced in EU.",
      "ETH showing unusual volatility pattern.",
    ];
    
    const newAlert = {
      id: Date.now(),
      message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      time: new Date().toLocaleTimeString()
    };
    
    setAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 5));
  };

  // Handle city selection
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      generateChartData();
      setLoading(false);
    }, 1000);
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'rainy':
        return <CloudRain size={24} className="text-blue-400" />;
      case 'sunny':
        return <Sun size={24} className="text-yellow-400" />;
      case 'cloudy':
        return <Wind size={24} className="text-gray-400" />;
      default:
        return <Sun size={24} className="text-yellow-400" />;
    }
  };

  // Theme classes based on dark/light mode
  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-blue-50",
    text: darkMode ? "text-white" : "text-gray-800",
    card: darkMode ? "bg-gray-800" : "bg-white",
    highlight: darkMode ? "bg-indigo-800" : "bg-indigo-600",
    button: darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600",
    accent: darkMode ? "text-blue-400" : "text-blue-600",
  };

  return (
    <main className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-6 space-y-6 transition-colors duration-300`}>
      {/* Header with Theme Toggle */}
      <header className="flex justify-between items-center mb-4">
        <h1 className={`text-4xl md:text-5xl font-bold ${themeClasses.accent}`}>
          CryptoWeather Nexus
        </h1>
        <div className="flex items-center gap-4">
          
          <button 
            onClick={handleRefresh} 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center space-y-4">
        <p className="text-lg text-gray-300">
          Your all-in-one dashboard for real-time weather, cryptocurrency stats,
          and trending news!
        </p>
      </section>

      {/* Live Updates Banner with Animation */}
      <section className={`${loading ? 'animate-pulse' : ''} bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-4 shadow-lg flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <TrendingUp size={24} />
          <span className="text-lg font-medium">Live BTC: {btcPrice} | ETH: {ethPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          {getWeatherIcon(weatherCondition)}
          <span className="text-lg font-medium">{selectedCity}: {temperature}</span>
        </div>
      </section>

      {/* City Selection */}
      <section className={`${themeClasses.card} p-4 rounded-xl shadow-md`}>
        <h3 className="text-lg font-medium mb-2">Select City:</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCity === city 
                  ? themeClasses.highlight + " text-white" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* Price Chart */}
      

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Weather Summary</h2>
            {getWeatherIcon(weatherCondition)}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-2xl font-bold">{selectedCity}: {temperature}</p>
            <p>Condition: {weatherCondition}</p>
            <p>Humidity: 65%</p>
            <p>Wind: 8 km/h</p>
          </div>
          <Link href="/whether">
            <button className={`mt-4 px-4 py-2 ${themeClasses.button} rounded-lg text-white w-full`}>
              View Detailed Weather
            </button>
          </Link>
        </div>

        {/* Crypto Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}>
          <h2 className="text-xl font-semibold mb-2">Crypto Summary</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span>Bitcoin:</span>
              <span className="font-bold">{btcPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ethereum:</span>
              <span className="font-bold">{ethPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Solana:</span>
              <span className="font-bold">$130</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cardano:</span>
              <span className="font-bold">$0.45</span>
            </div>
          </div>
          <Link href="/crypto">
            <button className={`mt-4 px-4 py-2 ${themeClasses.button} rounded-lg text-white w-full`}>
              View Full Crypto Dashboard
            </button>
          </Link>
        </div>

        {/* News and Alerts Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}>
          <h2 className="text-xl font-semibold mb-2">Alerts & News</h2>
          <div className="max-h-64 overflow-y-auto pr-2">
            {alerts.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li key={alert.id} className="p-2 bg-red-900/20 rounded border-l-4 border-red-500 flex gap-2">
                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-400">{alert.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No alerts at this time</p>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="font-medium mb-2">Latest News</h3>
              <ul className="space-y-2">
                <li className="text-sm">Bitcoin hits new high as institutional adoption grows</li>
                <li className="text-sm">Weather Alert: Storm system developing over Atlantic</li>
                <li className="text-sm">Crypto regulation framework proposed in Congress</li>
                <li className="text-sm">New DeFi platform launches with record TVL</li>
              </ul>
            </div>
          </div>
          <Link href="/news">
            <button className={`mt-4 px-4 py-2 ${themeClasses.button} rounded-lg text-white w-full`}>
              Go to News
            </button>
          </Link>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="text-center mt-8 space-y-4">
        <h3 className="text-xl font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/whether">
            <button className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2`}>
              <CloudRain size={20} />
              <span>Weather</span>
            </button>
          </Link>
          <Link href="/crypto">
            <button className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2`}>
              <TrendingUp size={20} />
              <span>Crypto</span>
            </button>
          </Link>
          <Link href="/news">
            <button className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2`}>
              <AlertCircle size={20} />
              <span>News</span>
            </button>
          </Link>
          <button 
            onClick={handleRefresh}
            className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2`}
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

    

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-400">
        <p>© 2025 CryptoWeather Nexus. All rights reserved.</p>
      </footer>
    </main>
  );
}