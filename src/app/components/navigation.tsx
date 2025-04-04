"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCloud, FiDollarSign, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Function to check if a link is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 28
      }
    },
    exit: { 
      opacity: 0, 
      y: 100,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <div className="relative">
      
      {/* Sidebar for larger screens */}
      <motion.nav 
        className="hidden md:flex flex-col w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-5 h-screen fixed left-0 top-0 shadow-xl z-40"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <motion.div 
          className="flex items-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-white text-indigo-800 p-2 rounded-lg mr-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FiCloud size={24} />
            </motion.div>
          </div>
          <h2 className="text-xl font-bold">WeatherCrypto</h2>
        </motion.div>
        
        <ul className="space-y-2 flex-1">
          {[
            { path: '/', icon: <FiHome size={20} />, name: 'Home' },
            { path: '/whether', icon: <FiCloud size={20} />, name: 'Weather' },
            { path: '/crypto', icon: <FiDollarSign size={20} />, name: 'Crypto' },
            { path: '/news', icon: <FiGlobe size={20} />, name: 'News' }
          ].map((item, index) => (
            <motion.li 
              key={item.path}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={item.path}>
                <motion.div 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path) 
                      ? 'bg-indigo-700 shadow-md' 
                      : 'hover:bg-indigo-700/50'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`mr-3 ${
                    isActive(item.path) ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.span 
                      className="ml-auto bg-white text-indigo-600 text-xs px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      Live
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
        
        <motion.div 
          className="mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="p-3 bg-indigo-700/50 rounded-lg text-sm backdrop-blur-sm"
            whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.7)' }}
          >
            <p>Last updated: {timeString}</p>
          </motion.div>
        </motion.div>
      </motion.nav>

    

      {/* Bottom Navigation Bar - Mobile */}
      <motion.nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="flex justify-around items-center">
          {[
            { path: '/', icon: <FiHome size={22} />, name: 'Home' },
            { path: '/whether', icon: <FiCloud size={22} />, name: 'Weather' },
            { path: '/crypto', icon: <FiDollarSign size={22} />, name: 'Crypto' },
            { path: '/news', icon: <FiGlobe size={22} />, name: 'News' }
          ].map((item) => (
            <Link 
              key={item.path}
              href={item.path}
            >
              <motion.div 
                className={`flex flex-col items-center p-3 transition-all ${
                  isActive(item.path) 
                    ? 'text-indigo-600' 
                    : 'text-gray-500'
                }`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                {isActive(item.path) ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {item.icon}
                  </motion.div>
                ) : (
                  item.icon
                )}
                <motion.span 
                  className={`text-xs mt-1 ${isActive(item.path) ? 'font-medium' : ''}`}
                  animate={{ 
                    scale: isActive(item.path) ? 1.1 : 1,
                    color: isActive(item.path) ? '#4f46e5' : '#6b7280'
                  }}
                >
                  {item.name}
                </motion.span>
                {isActive(item.path) && (
                  <motion.div
                    className="h-1 w-8 bg-indigo-600 rounded-full mt-1"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navigation;