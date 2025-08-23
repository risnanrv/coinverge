"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
};

// Example coin data (update logos accordingly)
const coins: Coin[] = [
  { id: "eth", name: "Ethereum", symbol: "ETH", logo: "/eth.png" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", logo: "/btc.png" },
  { id: "sol", name: "Solana", symbol: "SOL", logo: "/sol.png" },
  { id: "ada", name: "Cardano", symbol: "ADA", logo: "/ada.png" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filteredCoins = query
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
      )
    : coins;

  const handleSelect = (coinId: string) => {
    setSelected((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleGlobalAddCoin = () => {
    toast.success(`Added coins: ${selected.join(", ")}`);
    setSelected([]);
  };

  const handleCardAddCoin = (coinId: string, coinName: string) => {
    toast.success(`Added ${coinName}`);
    setSelected((prev) => prev.filter((id) => id !== coinId));
  };

  return (
    <>
      {/* Toaster container; place once in app */}
      <Toaster position="top-right" />
      <main className="min-h-screen bg-[#161731] flex flex-col items-center py-8 px-2">
        {/* Hero */}
        <section className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent mb-2">
            Coinverge
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium tracking-tight">
            Track, manage, and grow your crypto in Coinverge
          </p>
        </section>
        {/* Search */}
        <div className="w-full max-w-2xl mb-3">
          <input
            type="text"
            placeholder="Search.."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full px-5 py-3 bg-[#191a2f] text-white border border-[#23234d] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#337dc9] transition"
          />
        </div>
        {/* Global Add Coin Button - appears only if 2 or more selected */}
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
              return (
                <div
                  key={coin.id}
                  className={`relative bg-[#e5e7fa] rounded-xl shadow-md px-5 pt-5 pb-6 flex flex-col items-center transition ring-2 ring-transparent 
                    ${isSelected ? "ring-[#337dc9]" : "hover:shadow-lg hover:scale-105"}`}
                >
                  {/* Checkbox */}
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
                  {/* Logo */}
                  <img
                    src={coin.logo}
                    alt={coin.name + " logo"}
                    className="w-12 h-12 mb-4"
                  />
                  {/* Name/symbol */}
                  <span className="font-semibold text-lg text-gray-900">
                    {coin.name}{" "}
                    <span className="text-gray-500">{coin.symbol}</span>
                  </span>
                  {/* Add Coin Button (card-level) */}
                  {isSelected && (
                    <button
                      className="mt-6 px-5 py-2 w-full bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white rounded font-semibold focus-visible:ring-2 focus:outline-none transition"
                      onClick={() => handleCardAddCoin(coin.id, coin.name)}
                    >
                      Add Coin
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
