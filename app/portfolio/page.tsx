"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCoinDetails } from "@/lib/coingecko";
import { usePortfolioStore } from "@/lib/store/portfolioStore";
import { useApiStore } from "@/lib/store/apiStore";
import toast, { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Image from "next/image";

export default function PortfolioPage() {
  const router = useRouter();
  
  // Zustand stores
  const { 
    holdings, 
    loading, 
    error, 
    setHoldings, 
    setLoading, 
    setError, 
    clearPortfolio, 
    validateAndCleanCoins 
  } = usePortfolioStore();

  const { checkApiHealth } = useApiStore();

  useEffect(() => {
    const loadCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check API health first
        const isApiHealthy = await checkApiHealth();
        if (!isApiHealthy) {
          setError('CoinGecko API is currently unavailable. Please try again later.');
          setLoading(false);
          return;
        }
        
        // Clean up any invalid coin IDs first
        const validCoinIds = validateAndCleanCoins();
        
        if (validCoinIds.length === 0) {
          setHoldings([]);
          setLoading(false);
          return;
        }

        console.log(`Loading portfolio with ${validCoinIds.length} valid coin IDs:`, validCoinIds);

        // Fetch details for each valid coin id from your API
        type CoinData = {
          id: string;
          name: string;
          symbol: string;
          logo: string;
          price: number;
          change1h: number;
          change24h: number;
          change7d: number;
        };
        const coinsData: CoinData[] = [];
        
        for (const id of validCoinIds) {
          try {
            console.log(`Fetching details for coin: ${id}`);
            const data = await fetchCoinDetails(id);
            
            if (data) {
              // Valid data received
              coinsData.push({
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                logo: data.image.thumb,
                price: data.market_data?.current_price?.usd || 0,
                change1h: data.market_data?.price_change_percentage_1h_in_currency?.usd || 0,
                change24h: data.market_data?.price_change_percentage_24h || 0,
                change7d: data.market_data?.price_change_percentage_7d || 0,
              });
              console.log(`Successfully added ${data.name} to portfolio`);
            } else {
              // API returned null (invalid coin), remove from store
              console.log(`Removing invalid coin ID from store: ${id}`);
              usePortfolioStore.getState().removeCoin(id);
            }
          } catch (coinError) {
            console.error(`Failed to fetch details for coin ${id}:`, coinError);
            // Remove invalid coin ID from store
            usePortfolioStore.getState().removeCoin(id);
          }
        }

        console.log(`Portfolio loaded with ${coinsData.length} coins`);
        setHoldings(coinsData);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setError(error instanceof Error ? error.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, [setHoldings, setLoading, setError, checkApiHealth, validateAndCleanCoins]);

  const handleValidateAndClean = () => {
    validateAndCleanCoins();
    toast.success("Portfolio validated and cleaned");
    window.location.reload();
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#161731] flex flex-col items-center py-8 px-2">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent mb-4 text-center">
        Coinverge Dashboard
      </h1>
      {/* Action buttons */}
    <div className="flex gap-4 mb-7 items-center">
  <button
    onClick={() => router.push("/")}
    className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow"
  >
    Add Coin
  </button>
  <button
    className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow"
  >
    AI Recommendation
  </button>
  <button
    onClick={() => window.location.reload()}
    className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow hover:opacity-90"
  >
    Refresh Portfolio
  </button>
  <button
    onClick={clearPortfolio}
    className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow hover:opacity-90"
  >
    Clear Portfolio
  </button>
  <button
    onClick={handleValidateAndClean}
    className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow hover:opacity-90"
  >
    Validate & Clean
  </button>
</div>


      {/* Holdings Grid */}
      <section className="w-full max-w-6xl">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#337dc9]"></div>
            <p className="text-gray-300 mt-2">Loading portfolio...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#337dc9] text-white rounded hover:bg-[#2a6bb8] transition"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {holdings.length === 0 ? (
              <p className="text-gray-300 text-center col-span-full">No coins in portfolio</p>
            ) : (
            holdings.map((coin) => (
              <div
                key={coin.id}
                className="relative bg-[#e5e7fa] rounded-xl shadow-md px-5 pt-5 pb-6 flex flex-col items-center transition ring-2 ring-transparent hover:shadow-lg hover:scale-105"
              >
                <div className="absolute top-3 right-3"></div>
                <Image
                  src={coin.logo}
                  alt={coin.name + " logo"}
                  className="w-12 h-12 mb-4"
                  width={48}
                  height={48}
                />
                <span className="font-semibold text-lg text-gray-900">
                  {coin.name} <span className="text-gray-500">{coin.symbol}</span>
                </span>
                                 <span className="mt-2 text-2xl font-extrabold text-gray-900">
                   ${(coin.price || 0).toLocaleString()}
                 </span>
                 <div className="flex mt-4 w-full justify-between text-center text-xs font-semibold">
                   <div>
                     <span className="block text-gray-500">1h</span>
                     <span className={(coin.change1h || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                       {(coin.change1h || 0).toFixed(2)}%
                     </span>
                   </div>
                   <div>
                     <span className="block text-gray-500">24h</span>
                     <span className={(coin.change24h || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                       {(coin.change24h || 0).toFixed(2)}%
                     </span>
                   </div>
                   <div>
                     <span className="block text-gray-500">7d</span>
                     <span className={(coin.change7d || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                       {(coin.change7d || 0).toFixed(2)}%
                     </span>
                   </div>
                 </div>
              </div>
            ))
          )}
        </div>
        )}
      </section>
      <Toaster />
    </main>
    </ProtectedRoute>
  );
}
