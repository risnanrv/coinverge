"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { searchCoins } from "@/lib/coingecko";
import Image from "next/image";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Coin[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [defaultCoins, setDefaultCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchDefaultCoins = async () => {
      const data = await searchCoins("bitcoin");
      type ApiCoin = {
        id: string;
        name: string;
        symbol: string;
        thumb?: string;
      };
      const coinsData = data.coins.map((c: ApiCoin) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        logo: c.thumb || "/default.png",
      }));
      setDefaultCoins(coinsData);
    };
    fetchDefaultCoins();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handler = setTimeout(() => {
      handleSearch();
    }, 250); // 500ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleSearch = async () => {
    const data = await searchCoins(query);
    type ApiCoin = {
      id: string;
      name: string;
      symbol: string;
      thumb?: string;
    };
    const coinsData = data.coins.map((c: ApiCoin) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      logo: c.thumb || "/default.png",
    }));
    setResults(coinsData);
  };

const handleSelect = (coinId: string) => {
    setSelected((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };


const handleGlobalAddCoin = () => {
  localStorage.setItem(
    "portfolioCoins",
    JSON.stringify(selected)
  );
  toast.success(`Added coins: ${selected.join(", ")}`);
  setSelected([]);
};



 const handleCardAddCoin = (coinId: string, coinName: string) => {
  const existing = JSON.parse(localStorage.getItem("portfolioCoins") || "[]");
  if (!existing.includes(coinId)) {
    const updated = [...existing, coinId];
    localStorage.setItem("portfolioCoins", JSON.stringify(updated));
    toast.success(`Added ${coinName}`);
  } else {
    toast.success(`${coinName} is already in your portfolio`);
  }
  // Don't remove from selected state - keep it selected so user can see what they've added
};
  const filteredCoins = results.length > 0 ? results : defaultCoins;

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-[#161731] flex flex-col items-center py-8 px-2">
        <section className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent mb-2">
            Coinverge
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium tracking-tight">
            Track, manage, and grow your crypto in Coinverge
          </p>
        </section>
        <div className="w-full max-w-2xl mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Search.."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // Remove onKeyDown Enter handler because no manual search button
            className="flex-1 rounded-full px-5 py-3 bg-[#191a2f] text-white border border-[#23234d] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#337dc9] transition"
          />
          {/* Remove Search button */}
        </div>
        {/* Global Add Coin Button */}
        {selected.length >= 2 && (
          <div className="w-full max-w-2xl flex justify-end mb-6">
            <button
              className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white rounded-lg font-semibold shadow focus-visible:ring-2 focus:outline-none transition"
              onClick={handleGlobalAddCoin}
            >
              Add Coins
            </button>
          </div>
        )}
        {/* Grid */}
        <section className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCoins.map((coin) => {
              const isSelected = selected.includes(coin.id);
              const isInPortfolio = JSON.parse(localStorage.getItem("portfolioCoins") || "[]").includes(coin.id);
              return (
                <div
                  key={coin.id}
                  className={`relative bg-[#e5e7fa] rounded-xl shadow-md px-5 pt-5 pb-6 flex flex-col items-center transition ring-2 ring-transparent 
                    ${
                      isInPortfolio
                        ? "ring-green-500 bg-green-50"
                        : isSelected
                        ? "ring-[#337dc9]"
                        : "hover:shadow-lg hover:scale-105"
                    }`}
                >
                  <button
                    aria-label={isSelected ? "Deselect coin" : "Select coin"}
                    className="absolute top-3 right-3 h-6 w-6 rounded-full border-2 border-[#337dc9] flex items-center justify-center bg-white focus-visible:ring-2 focus:outline-none transition"
                    onClick={() => handleSelect(coin.id)}
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <span className="inline-block w-3 h-3 bg-gradient-to-br from-[#8638b4] to-[#337dc9] rounded-full" />
                    )}
                  </button>
                  <Image
                    src={coin.logo}
                    alt={`${coin.name} logo`}
                    width={48}
                    height={48}
                    className="mb-4"
                  />
                  <span className="font-semibold text-lg text-gray-900">
                    {coin.name}{" "}
                    <span className="text-gray-500">{coin.symbol}</span>
                  </span>
                  {isSelected && (
                    <button
                      className={`mt-6 px-5 py-2 w-full rounded font-semibold focus-visible:ring-2 focus:outline-none transition ${
                        isInPortfolio
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white hover:opacity-90"
                      }`}
                      onClick={() => !isInPortfolio && handleCardAddCoin(coin.id, coin.name)}
                      disabled={isInPortfolio}
                    >
                      {isInPortfolio ? "Already Added" : "Add Coin"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
