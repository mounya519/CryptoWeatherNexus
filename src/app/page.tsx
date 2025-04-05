"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { AlertCircle, TrendingUp, CloudRain, Sun, Wind, RefreshCw, Moon, SunMedium } from "lucide-react";

export default function HomePage() {
  // State for various dashboard elements
  const [btcPrice, setBtcPrice] = useState("Loading...");
  const [ethPrice, setEthPrice] = useState("Loading...");
  const [temperature, setTemperature] = useState("Loading...");
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [chartData, setChartData] = useState<{ time: string; btc: number }[]>([]);
  const [selectedCity, setSelectedCity] = useState<keyof typeof weatherData>("New York");
  const [alerts, setAlerts] = useState<{ id: number; message: string; time: string }[]>([]);

  // Weather data for different cities
  const cities: (keyof typeof weatherData)[] = ["New York", "London", "Tokyo", "Sydney"];
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
  const updateChartData = (newPrice: number) => {
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
  const handleCityChange = (city: keyof typeof weatherData) => {
      setSelectedCity(city);
  };

  // Toggle theme function
  const toggleTheme = () => {
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
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rainy':
        return <CloudRain size={24} className={darkMode ? "text-blue-400" : "text-blue-600"} />;
      case 'sunny':
        return <Sun size={24} className="text-yellow-500" />;
      case 'cloudy':
        return <Wind size={24} className={darkMode ? "text-gray-400" : "text-gray-600"} />;
      default:
        return <Sun size={24} className="text-yellow-500" />;
    }
  };

  // Theme classes based on dark/light mode
  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-50",
    text: darkMode ? "text-white" : "text-gray-800",
    card: darkMode ? "bg-gray-800" : "bg-white",
    highlight: darkMode ? "bg-indigo-800" : "bg-indigo-500",
    button: darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600",
    accent: darkMode ? "text-blue-400" : "text-blue-600",
    secondaryText: darkMode ? "text-gray-300" : "text-gray-600",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    gradient: darkMode 
      ? "bg-gradient-to-r from-blue-700 to-indigo-800" 
      : "bg-gradient-to-r from-blue-500 to-indigo-600",
    alertBg: darkMode ? "bg-red-900/20" : "bg-red-100",
    alertBorder: darkMode ? "border-red-500" : "border-red-400",
    cardHover: darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50",
    unselectedButton: darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300",
    pillButton: darkMode 
      ? "bg-gray-800 hover:bg-gray-700 text-white" 
      : "bg-white hover:bg-gray-100 text-gray-800 shadow-sm",
  };

  return (
    <main className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-4 md:p-6 space-y-6 transition-colors duration-300`}>
      {/* Header with Theme Toggle */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.accent} flex items-center`}>
          <span className="mr-2"></span> CryptoWeather Nexus
        </h1>
        <div className="flex justify-end items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${themeClasses.pillButton} transition-colors`}
            title="Toggle Theme"
          >
            {darkMode ? <SunMedium size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={handleRefresh} 
            className={`p-2 rounded-full ${themeClasses.pillButton} transition-colors`}
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center space-y-4 mb-6">
        <p className={`text-lg ${themeClasses.secondaryText}`}>
          Your all-in-one dashboard for real-time weather, cryptocurrency stats,
          and trending news!
        </p>
      </section>

      {/* Live Updates Banner with Animation */}
      <section className={`${loading ? 'animate-pulse' : ''} ${themeClasses.gradient} rounded-xl p-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 text-white`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-2 bg-white/10 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <span className="text-lg font-medium">Live BTC: {btcPrice} | ETH: {ethPrice}</span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-2 bg-white/10 rounded-lg">
            {getWeatherIcon(weatherCondition)}
          </div>
          <span className="text-lg font-medium">{selectedCity}: {temperature}</span>
        </div>
      </section>

      {/* City Selection */}
      <section className={`${themeClasses.card} p-4 rounded-xl shadow-md border ${themeClasses.border}`}>
        <h3 className="text-lg font-medium mb-3">Select City:</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCity === city 
                  ? themeClasses.highlight + " text-white" 
                  : themeClasses.unselectedButton
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Weather Summary</h2>
            <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              {getWeatherIcon(weatherCondition)}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-2xl font-bold">{selectedCity}: {temperature}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <p className="text-sm font-medium">Condition</p>
                <p className={`${themeClasses.accent}`}>{weatherCondition}</p>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <p className="text-sm font-medium">Humidity</p>
                <p className={`${themeClasses.accent}`}>65%</p>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <p className="text-sm font-medium">Wind</p>
                <p className={`${themeClasses.accent}`}>8 km/h</p>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <p className="text-sm font-medium">Visibility</p>
                <p className={`${themeClasses.accent}`}>10 km</p>
              </div>
            </div>
          </div>
          <Link href="/whether">
            <button className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium transition-transform hover:scale-105`}>
              View Detailed Weather
            </button>
          </Link>
        </div>

        {/* Crypto Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Crypto Summary</h2>
            <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <TrendingUp size={24} className={themeClasses.accent} />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Bitcoin", value: btcPrice, change: "+2.4%" },
              { name: "Ethereum", value: ethPrice, change: "-0.6%" },
              { name: "Solana", value: "$130", change: "+5.2%" },
              { name: "Cardano", value: "$0.45", change: "+0.8%" }
            ].map((crypto, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex justify-between items-center`}>
                <span className="font-medium">{crypto.name}</span>
                <div className="text-right">
                  <span className="font-bold block">{crypto.value}</span>
                  <span className={crypto.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                    {crypto.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/crypto">
            <button className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium transition-transform hover:scale-105`}>
              View Full Crypto Dashboard
            </button>
          </Link>
        </div>

        {/* News and Alerts Card */}
        <div className={`${themeClasses.card} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Alerts & News</h2>
            <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <AlertCircle size={24} className={themeClasses.accent} />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto pr-2 mt-4">
            {alerts.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li key={alert.id} className={`p-3 ${themeClasses.alertBg} rounded-lg border-l-4 ${themeClasses.alertBorder} flex gap-2`}>
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>{alert.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} italic p-3 text-center`}>No alerts at this time</p>
            )}
            
            <div className={`mt-4 pt-4 border-t ${themeClasses.border}`}>
              <h3 className="font-medium mb-3">Latest News</h3>
              <ul className="space-y-2">
                {[
                  "Bitcoin hits new high as institutional adoption grows",
                  "Weather Alert: Storm system developing over Atlantic",
                  "Crypto regulation framework proposed in Congress",
                  "New DeFi platform launches with record TVL"
                ].map((item, idx) => (
                  <li key={idx} className={`text-sm p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer transition-colors`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link href="/news">
            <button className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium transition-transform hover:scale-105`}>
              Go to News
            </button>
          </Link>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="text-center mt-8 space-y-4">
        <h3 className="text-xl font-medium">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: "/whether", icon: <CloudRain size={20} />, label: "Weather" },
            { href: "/crypto", icon: <TrendingUp size={20} />, label: "Crypto" },
            { href: "/news", icon: <AlertCircle size={20} />, label: "News" },
            { onClick: handleRefresh, icon: <RefreshCw size={20} className={loading ? "animate-spin" : ""} />, label: "Refresh" }
          ].map((action, idx) => (
            action.href ? (
              <Link href={action.href} key={idx}>
                <button className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              </Link>
            ) : (
              <button 
                key={idx}
                onClick={action.onClick}
                className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            )
          ))}
        </div>
      </section>

      {/* Footer */}
     
    </main>
  );
}