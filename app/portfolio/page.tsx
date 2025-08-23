// app/portfolio/page.tsx (or pages/portfolio.tsx for legacy structure)

"use client";

import { useRouter } from "next/navigation";

type Holding = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
};

const holdings: Holding[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    logo: "/eth-logo.png",
    price: 4741.26,
    change1h: 0.1,
    change24h: 0.5,
    change7d: 3,
  },
  // Add more holdings as needed
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    logo: "/btc-logo.png",
    price: 67250.00,
    change1h: -0.2,
    change24h: 1.2,
    change7d: 5.1,
  },
];

export default function PortfolioPage() {
      const router = useRouter();

  return (
    <main className="min-h-screen bg-[#161731] flex flex-col items-center py-8 px-2">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent mb-4 text-center">
        Coinverge Dashboard
      </h1>
    {/* Action buttons */}
<div className="flex gap-4 mb-7 items-center">
  <button onClick={() => router.push("/")}  className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow">
    Add Coin
  </button>
  <button className="px-5 py-2 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded focus-visible:ring-2 focus:outline-none transition shadow">
    AI Recommendation
  </button>
</div>

      {/* Holdings Grid */}
      <section className="w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {holdings.map((coin) => (
            <div
              key={coin.id}
              className="relative bg-[#e5e7fa] rounded-xl shadow-md px-5 pt-5 pb-6 flex flex-col items-center transition ring-2 ring-transparent hover:shadow-lg hover:scale-105"
            >
              {/* Logo and select area */}
              <div className="absolute top-3 right-3">
                {/* If you have per-card selection, put checkbox here */}
              </div>
              <img
                src={coin.logo}
                alt={coin.name + " logo"}
                className="w-12 h-12 mb-4"
              />
              {/* Name & symbol */}
              <span className="font-semibold text-lg text-gray-900">
                {coin.name} <span className="text-gray-500">{coin.symbol}</span>
              </span>
              {/* Price */}
              <span className="mt-2 text-2xl font-extrabold text-gray-900">${coin.price.toLocaleString()}</span>
              {/* Change row */}
              <div className="flex mt-4 w-full justify-between text-center text-xs font-semibold">
                <div>
                  <span className="block text-gray-500">1h</span>
                  <span className={coin.change1h >= 0 ? "text-green-500" : "text-red-500"}>
                    {coin.change1h}%
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">24h</span>
                  <span className={coin.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {coin.change24h}%
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">7d</span>
                  <span className={coin.change7d >= 0 ? "text-green-500" : "text-red-500"}>
                    {coin.change7d}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
