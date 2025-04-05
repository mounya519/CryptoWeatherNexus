"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  MapPin, Sun, CloudRain, CloudSnow, Cloud, 
  Droplets, Wind, Gauge, Loader2, ChevronDown, 
  ChevronUp, RefreshCw, Search, Thermometer,
  Sunset, Sunrise, Eye, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  dt: number;
  timezone: number;
}

const WeatherInfo = () => {
  const presetCities = [
    { name: "New York", lat: "40.7128", lon: "-74.0060" },
    { name: "London", lat: "51.5074", lon: "-0.1278" },
    { name: "Tokyo", lat: "35.6762", lon: "139.6503" },
    { name: "Sydney", lat: "-33.8688", lon: "151.2093" },
    { name: "Dubai", lat: "25.2048", lon: "55.2708" }
  ];

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedCity, setSearchedCity] = useState<WeatherData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<"metric" | "imperial">("metric");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const apiKey = "fce91158cf3de2349767f631b374d20a";

  const fetchAllWeather = async () => {
    try {
      setLoading(true);
      const promises = presetCities.map(city => 
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=${selectedUnit}&appid=${apiKey}`
        )
      );
      
      const results = await Promise.all(promises);
      setWeatherData(results.map(res => res.data));
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch {
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  const searchCity = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=${selectedUnit}&appid=${apiKey}`
      );
      setSearchedCity(response.data);
      setIsSearching(false);
    } catch (err) {
      setError("City not found. Please try another location.");
      setIsSearching(false);
      setSearchedCity(null);
    }
  };

  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Rain":
      case "Drizzle":
        return <CloudRain className="text-blue-400" size={40} />;
      case "Thunderstorm":
        return <CloudRain className="text-purple-500" size={40} />;
      case "Snow":
        return <CloudSnow className="text-blue-100" size={40} />;
      case "Clouds":
        return <Cloud className="text-gray-400" size={40} />;
      case "Clear":
        return <Sun className="text-yellow-400" size={40} />;
      case "Mist":
      case "Fog":
      case "Haze":
        return <Eye className="text-gray-300" size={40} />;
      default:
        return <Thermometer className="text-orange-400" size={40} />;
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedCity(expandedCity === index ? null : index);
  };

  const refreshData = () => {
    if (searchedCity) {
      searchCity();
    } else {
      fetchAllWeather();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCity();
    }
  };

  useEffect(() => {
    fetchAllWeather();
  }, [selectedUnit]);

  if (loading && !searchedCity) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading weather data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 max-w-6xl min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Global Weather Dashboard
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a city..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <button 
              onClick={searchCity}
              disabled={isSearching}
              className="absolute right-2 top-1 bg-indigo-600 text-white p-1 rounded-full hover:bg-indigo-700 transition"
            >
              {isSearching ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Search size={16} />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedUnit("metric")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUnit === "metric" ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              °C
            </button>
            <button
              onClick={() => setSelectedUnit("imperial")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUnit === "imperial" ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              °F
            </button>
            <button
              onClick={refreshData}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-6">
        {searchedCity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <button
              onClick={() => {
                setSearchedCity(null);
                setSearchQuery("");
                setError(null);
              }}
              className="absolute top-2 right-2 z-10 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={18} />
            </button>
            <CityWeatherCard 
              city={searchedCity}
              index={0}
              expanded={expandedCity === 0}
              toggleExpand={() => toggleExpand(0)}
              selectedUnit={selectedUnit}
              formatTime={formatTime}
              getWindDirection={getWindDirection}
              getWeatherIcon={getWeatherIcon}
            />
          </motion.div>
        )}

        {!searchedCity && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Popular Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((city, index) => (
                <CityWeatherCard
                  key={`${city.name}-${index}`}
                  city={city}
                  index={index}
                  expanded={expandedCity === index}
                  toggleExpand={() => toggleExpand(index)}
                  selectedUnit={selectedUnit}
                  formatTime={formatTime}
                  getWindDirection={getWindDirection}
                  getWeatherIcon={getWeatherIcon}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p>Weather data provided by OpenWeatherMap</p>
        <p className="mt-1">Last updated: {lastUpdated}</p>
      </motion.div>
    </motion.div>
  );
};

const CityWeatherCard = ({
  city,
  index,
  expanded,
  toggleExpand,
  selectedUnit,
  formatTime,
  getWindDirection,
  getWeatherIcon
}: {
  city: WeatherData;
  index: number;
  expanded: boolean;
  toggleExpand: () => void;
  selectedUnit: string;
  formatTime: (timestamp: number, timezone: number) => string;
  getWindDirection: (degrees: number) => string;
  getWeatherIcon: (condition: string) => JSX.Element;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: expanded ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        layoutId={`card-${index}`}
        className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
          expanded ? "ring-2 ring-indigo-500" : ""
        }`}
      >
        <div 
          className="cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span className="text-lg font-semibold">{city.name}, {city.sys.country}</span>
              </div>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </motion.div>
            </div>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex flex-col">
              <motion.div 
                className="text-5xl font-bold text-gray-900"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
              >
                {Math.round(city.main.temp)}°{selectedUnit === "metric" ? "C" : "F"}
              </motion.div>
              <div className="text-sm text-gray-500">
                Feels like: {Math.round(city.main.feels_like)}°{selectedUnit === "metric" ? "C" : "F"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                H: {Math.round(city.main.temp_max)}° L: {Math.round(city.main.temp_min)}°
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                {getWeatherIcon(city.weather[0].main)}
              </motion.div>
              <span className="text-lg font-medium text-gray-700 capitalize">
                {city.weather[0].description}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-gray-100">
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  <WeatherDetailCard 
                    icon={<Wind size={24} />}
                    title="Wind"
                    value={`${city.wind.speed} ${selectedUnit === "metric" ? "m/s" : "mph"} ${getWindDirection(city.wind.deg)}`}
                    color="text-blue-500"
                  />
                  
                  <WeatherDetailCard 
                    icon={<Droplets size={24} />}
                    title="Humidity"
                    value={`${city.main.humidity}%`}
                    color="text-blue-500"
                  />
                  
                  <WeatherDetailCard 
                    icon={<Gauge size={24} />}
                    title="Pressure"
                    value={`${city.main.pressure} hPa`}
                    color="text-blue-500"
                  />
                  
                  <WeatherDetailCard 
                    icon={<Eye size={24} />}
                    title="Visibility"
                    value={`${city.visibility / 1000} km`}
                    color="text-blue-500"
                  />
                  
                  <WeatherDetailCard 
                    icon={<Sunrise size={24} />}
                    title="Sunrise"
                    value={formatTime(city.sys.sunrise, city.timezone)}
                    color="text-yellow-500"
                  />
                  
                  <WeatherDetailCard 
                    icon={<Sunset size={24} />}
                    title="Sunset"
                    value={formatTime(city.sys.sunset, city.timezone)}
                    color="text-orange-500"
                  />
                </div>
                
                <div className="px-4 pb-4">
                  <motion.div 
                    className="w-full bg-gradient-to-r from-indigo-100 to-blue-100 p-3 rounded-lg text-center"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-sm text-indigo-700">
                      Last updated: {new Date(city.dt * 1000).toLocaleTimeString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const WeatherDetailCard = ({
  icon,
  title,
  value,
  color
}: {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`mb-2 ${color}`}>
        {icon}
      </div>
      <div className="text-xs text-gray-900">{title}</div>
      <div className="font-semibold text-black text-sm">{value}</div>
    </motion.div>
  );
};

export default WeatherInfo;