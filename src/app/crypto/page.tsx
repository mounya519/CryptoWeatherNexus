'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Loader2, Star, RefreshCw } from 'lucide-react';

const CryptoPage = () => {
    const mainCryptos = ['bitcoin', 'ethereum', 'cardano'];
    interface Crypto {
        id: string;
        name: string;
        symbol: string;
        image: string;
        current_price: number;
        market_cap: number;
        market_cap_rank: number;
        total_volume: number;
        high_24h: number;
        low_24h: number;
        price_change_percentage_24h: number;
        circulating_supply: number;
    }

    const [cryptos, setCryptos] = useState<Array<Crypto>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCryptoId, setSelectedCryptoId] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchCryptoData = () => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,solana,ripple,dogecoin,polkadot,litecoin,tron,uniswap&order=market_cap_desc&per_page=20&page=1&sparkline=false')
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                setCryptos(data);
                setLoading(false);
                setLastUpdated(new Date().toLocaleTimeString());
            })
            .catch(() => {
                setError('Failed to fetch crypto data.');
                setLoading(false);
            });
    };

    const formatMarketCap = (cap: number): string => 
        cap >= 1e12 ? `$${(cap / 1e12).toFixed(2)}T` : 
        cap >= 1e9 ? `$${(cap / 1e9).toFixed(2)}B` : 
        cap >= 1e6 ? `$${(cap / 1e6).toFixed(2)}M` : 
        `$${cap.toLocaleString()}`;
    
    const getChangeColor = (change: number): string => 
        change >= 0 ? 'text-green-600' : 'text-red-600';
    
    const getMainCryptos = (): Array<{ id: string; [key: string]: any }> => 
        cryptos.filter((c) => mainCryptos.includes(c.id));
    
    const toggleDetails = (id: string): void => 
        setSelectedCryptoId(selectedCryptoId === id ? null : id);
    
    const toggleFavorite = (id: string): void => 
        setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({ 
            opacity: 1, 
            y: 0, 
            transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }
        })
    };

    if (loading) return <div className="flex flex-col items-center justify-center h-64"><Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-2" /><p>Loading...</p></div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>;

    const mainCryptosData = getMainCryptos();
    const otherCryptos = cryptos.filter(c => !mainCryptos.includes(c.id));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Crypto Dashboard</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Updated: {lastUpdated}</span>
                    <button onClick={fetchCryptoData} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {mainCryptosData.map((crypto, index) => (
                    <motion.div
                        key={crypto.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1" />
                        <div className="p-4 relative">
                            <button onClick={() => toggleFavorite(crypto.id)} className="absolute top-2 right-2 text-yellow-500">
                                <Star fill={favorites.includes(crypto.id) ? 'currentColor' : 'none'} size={18} />
                            </button>
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                                    <div>
                                        <h2 className="font-semibold text-gray-900 text-lg">{crypto.name}</h2>
                                        <p className="text-xs uppercase text-gray-500">{crypto.symbol}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-semibold ${getChangeColor(crypto.price_change_percentage_24h)} flex items-center`}>
                                    {crypto.price_change_percentage_24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-gray-700 mb-2">Price: <span className="font-bold text-gray-900">${crypto.current_price.toLocaleString()}</span></div>
                            <div className="text-gray-700 mb-2">Market Cap: <span className="font-medium">{formatMarketCap(crypto.market_cap)}</span></div>
                            <div className="text-gray-700">24h Volume: <span className="font-medium">{formatMarketCap(crypto.total_volume)}</span></div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleDetails(crypto.id)}
                                className="w-full mt-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                            >
                                {selectedCryptoId === crypto.id ? 'Hide Details' : 'View Details'}
                            </motion.button>
                            <AnimatePresence>
                                {selectedCryptoId === crypto.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-3 border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><p className="text-gray-500">High 24h</p><p className="font-medium">${crypto.high_24h.toLocaleString()}</p></div>
                                            <div><p className="text-gray-500">Low 24h</p><p className="font-medium">${crypto.low_24h.toLocaleString()}</p></div>
                                            <div><p className="text-gray-500">Supply</p><p className="font-medium">{Math.round(crypto.circulating_supply).toLocaleString()}</p></div>
                                            <div><p className="text-gray-500">Rank</p><p className="font-medium">#{crypto.market_cap_rank}</p></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md">
                <div className="p-4 bg-indigo-50 border-b">
                    <h2 className="text-lg font-bold text-indigo-800">Other Cryptocurrencies</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-400">
                            <tr>
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-right">Price</th>
                                <th className="p-3 text-right">24h</th>
                                <th className="p-3 text-right">Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherCryptos.map((crypto, index) => (
                                <motion.tr key={crypto.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }} whileHover={{ backgroundColor: '#f9fafb' }} className="border-b">
                                    <td className="p-3 text-black">{crypto.market_cap_rank}</td>
                                    <td className="p-3 flex items-center gap-2 text-black">
                                        <img src={crypto.image} alt={crypto.name} className="w-5 h-5" />
                                        <span>{crypto.name}</span>
                                        <span className="text-xs text-gray-400 uppercase">{crypto.symbol}</span>
                                    </td>
                                    <td className="p-3 text-right font-medium text-black">${crypto.current_price.toLocaleString()}</td>
                                    <td className={`p-3 text-right font-medium text-black ${getChangeColor(crypto.price_change_percentage_24h)}`}>{crypto.price_change_percentage_24h.toFixed(2)}%</td>
                                    <td className="p-3 text-right text-black">{formatMarketCap(crypto.market_cap)}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-5 text-xs text-center text-gray-400">Powered by CoinGecko API</p>
        </motion.div>
    );
};

export default CryptoPage;
