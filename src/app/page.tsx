"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const alertVariants = {
    initial: { opacity: 0, height: 0, marginBottom: 0 },
    animate: { 
      opacity: 1, 
      height: "auto", 
      marginBottom: 12,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginBottom: 0,
      transition: { duration: 0.2 }
    }
  };

  const themeToggleVariants = {
    rotate: { rotate: 360, transition: { duration: 0.5 } }
  };

  return (
    <motion.main 
      className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-4 md:p-6 space-y-6 transition-colors duration-300`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with Theme Toggle */}
      <motion.header 
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4"
        variants={itemVariants}
      >
        <motion.h1 
          className={`text-3xl md:text-4xl font-bold ${themeClasses.accent} flex items-center`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span className="mr-2"></span> CryptoWeather Nexus
        </motion.h1>
        <div className="flex justify-end items-center gap-4">
          <motion.button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${themeClasses.pillButton} transition-colors`}
            title="Toggle Theme"
            whileTap={{ scale: 0.9 }}
            animate={darkMode ? "rotate" : ""}
            variants={themeToggleVariants}
          >
            {darkMode ? <SunMedium size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <motion.button 
            onClick={handleRefresh} 
            className={`p-2 rounded-full ${themeClasses.pillButton} transition-colors`}
            title="Refresh Data"
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-4 mb-6"
        variants={itemVariants}
      >
        <motion.p 
          className={`text-lg ${themeClasses.secondaryText}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your all-in-one dashboard for real-time weather, cryptocurrency stats,
          and trending news!
        </motion.p>
      </motion.section>

      {/* Live Updates Banner with Animation */}
      <motion.section 
        className={`${loading ? 'animate-pulse' : ''} ${themeClasses.gradient} rounded-xl p-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 text-white`}
        variants={itemVariants}
        animate={{ 
          boxShadow: [
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          ],
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <motion.div 
            className="p-2 bg-white/10 rounded-lg"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <TrendingUp size={24} />
          </motion.div>
          <motion.span 
            className="text-lg font-medium"
            key={btcPrice + ethPrice}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Live BTC: {btcPrice} | ETH: {ethPrice}
          </motion.span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <motion.div 
            className="p-2 bg-white/10 rounded-lg"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            {getWeatherIcon(weatherCondition)}
          </motion.div>
          <motion.span 
            className="text-lg font-medium"
            key={temperature + selectedCity}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {selectedCity}: {temperature}
          </motion.span>
        </div>
      </motion.section>

      {/* City Selection */}
      <motion.section 
        className={`${themeClasses.card} p-4 rounded-xl shadow-md border ${themeClasses.border}`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-medium mb-3">Select City:</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <motion.button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCity === city 
                  ? themeClasses.highlight + " text-white" 
                  : themeClasses.unselectedButton
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={selectedCity === city ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 0.2 }}
            >
              {city}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Main Dashboard Grid */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Weather Card */}
        <motion.div 
          className={`${themeClasses.card} p-5 rounded-2xl shadow-lg transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Weather Summary</h2>
            <motion.div 
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {getWeatherIcon(weatherCondition)}
            </motion.div>
          </div>
          <div className="mt-4 space-y-3">
            <motion.p 
              className="text-2xl font-bold"
              key={temperature + selectedCity}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {selectedCity}: {temperature}
            </motion.p>
            <div className="grid grid-cols-2 gap-2">
              <motion.div 
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-medium">Condition</p>
                <p className={`${themeClasses.accent}`}>{weatherCondition}</p>
              </motion.div>
              <motion.div 
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-medium">Humidity</p>
                <p className={`${themeClasses.accent}`}>65%</p>
              </motion.div>
              <motion.div 
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-medium">Wind</p>
                <p className={`${themeClasses.accent}`}>8 km/h</p>
              </motion.div>
              <motion.div 
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-medium">Visibility</p>
                <p className={`${themeClasses.accent}`}>10 km</p>
              </motion.div>
            </div>
          </div>
          <Link href="/whether">
            <motion.button 
              className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Detailed Weather
            </motion.button>
          </Link>
        </motion.div>

        {/* Crypto Card */}
        <motion.div 
          className={`${themeClasses.card} p-5 rounded-2xl shadow-lg transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Crypto Summary</h2>
            <motion.div 
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp size={24} className={themeClasses.accent} />
            </motion.div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Bitcoin", value: btcPrice, change: "+2.4%" },
              { name: "Ethereum", value: ethPrice, change: "-0.6%" },
              { name: "Solana", value: "$130", change: "+5.2%" },
              { name: "Cardano", value: "$0.45", change: "+0.8%" }
            ].map((crypto, idx) => (
              <motion.div 
                key={idx} 
                className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex justify-between items-center`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium">{crypto.name}</span>
                <div className="text-right">
                  <motion.span 
                    className="font-bold block"
                    key={crypto.value}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {crypto.value}
                  </motion.span>
                  <motion.span 
                    className={crypto.change.startsWith("+") ? "text-green-500" : "text-red-500"}
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {crypto.change}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/crypto">
            <motion.button 
              className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Full Crypto Dashboard
            </motion.button>
          </Link>
        </motion.div>

        {/* News and Alerts Card */}
        <motion.div 
          className={`${themeClasses.card} p-5 rounded-2xl shadow-lg transition-all ${themeClasses.cardHover} border ${themeClasses.border}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">Alerts & News</h2>
            <motion.div 
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle size={24} className={themeClasses.accent} />
            </motion.div>
          </div>
          <div className="max-h-64 overflow-y-auto pr-2 mt-4">
            <AnimatePresence>
              {alerts.length > 0 ? (
                <motion.ul className="space-y-3">
                  {alerts.map((alert) => (
                    <motion.li 
                      key={alert.id} 
                      className={`p-3 ${themeClasses.alertBg} rounded-lg border-l-4 ${themeClasses.alertBorder} flex gap-2`}
                      variants={alertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-1" />
                      <div>
                        <p className="text-sm">{alert.message}</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>{alert.time}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.p 
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} italic p-3 text-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No alerts at this time
                </motion.p>
              )}
            </AnimatePresence>
            
            <motion.div 
              className={`mt-4 pt-4 border-t ${themeClasses.border}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-medium mb-3">Latest News</h3>
              <ul className="space-y-2">
                {[
                  "Bitcoin hits new high as institutional adoption grows",
                  "Weather Alert: Storm system developing over Atlantic",
                  "Crypto regulation framework proposed in Congress",
                  "New DeFi platform launches with record TVL"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className={`text-sm p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer transition-colors`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          <Link href="/news">
            <motion.button 
              className={`mt-6 px-4 py-3 ${themeClasses.button} rounded-lg text-white w-full font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to News
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Quick Actions Section */}
      <motion.section 
        className="text-center mt-8 space-y-4"
        variants={itemVariants}
      >
        <h3 className="text-xl font-medium">Quick Actions</h3>
        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          variants={containerVariants}
        >
          {[
            { href: "/whether", icon: <CloudRain size={20} />, label: "Weather" },
            { href: "/crypto", icon: <TrendingUp size={20} />, label: "Crypto" },
            { href: "/news", icon: <AlertCircle size={20} />, label: "News" },
            { onClick: handleRefresh, icon: <RefreshCw size={20} className={loading ? "animate-spin" : ""} />, label: "Refresh" }
          ].map((action, idx) => (
            action.href ? (
              <Link href={action.href} key={idx}>
                <motion.button 
                  className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2 shadow-lg`}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              </Link>
            ) : (
              <motion.button 
                key={idx}
                onClick={action.onClick}
                className={`px-6 py-3 ${themeClasses.button} rounded-xl text-white flex items-center gap-2 shadow-lg`}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {action.icon}
                <span>{action.label}</span>
              </motion.button>
            )
          ))}
        </motion.div>
      </motion.section>
    </motion.main>
  );
}