// /lib/coingecko.ts

// Helper function to handle fetch with better error handling
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      // Create the fetch promise
      const fetchPromise = fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Don't retry for certain status codes
      if (response.status === 404) {
        // 404 means the resource wasn't found - don't retry
        return response;
      }
      
      if (response.ok) {
        return response;
      }
      
      // If response is not ok, throw with status info
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed for ${url}:`, error);
      
      if (i === retries - 1) {
        // Last retry, throw the error
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Define the expected coin data structure
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    thumb: string;
    [key: string]: string;
  };
  market_data: {
    current_price: {
      usd: number;
      [currency: string]: number;
    };
    price_change_percentage_1h_in_currency?: {
      usd: number;
      [currency: string]: number;
    };
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    // Add more specific properties as needed, or use unknown for unknown structure
    market_cap?: { [currency: string]: number };
    total_volume?: { [currency: string]: number };
  };
  // Add more specific properties as needed, or use unknown for unknown structure
  description?: { [language: string]: string };
  links?: { [key: string]: unknown };
}

// Helper function to validate coin data
function validateCoinData(data: CoinData): boolean {
  return !!(data &&
         typeof data.id === 'string' && data.id.trim() !== '' &&
         typeof data.name === 'string' && data.name.trim() !== '' &&
         typeof data.symbol === 'string' && data.symbol.trim() !== '' &&
         data.image && typeof data.image.thumb === 'string' && data.image.thumb.trim() !== '' &&
         data.market_data &&
         data.market_data.current_price &&
         typeof data.market_data.current_price.usd === 'number' && !isNaN(data.market_data.current_price.usd));
}

export async function searchCoins(query: string) {
  try {
    console.log(`Searching for coins with query: ${query}`);
    const res = await fetchWithRetry(
      `/api/coins/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    
    // Validate the response structure
    if (!data || !data.coins || !Array.isArray(data.coins)) {
      throw new Error('Invalid API response format');
    }
    
    console.log(`Found ${data.coins.length} coins for query: ${query}`);
    return data;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw new Error(`Failed to search coins: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getCoinDetails(id: string) {
  try {
    console.log(`Getting details for coin: ${id}`);
    const res = await fetchWithRetry(
      `/api/coins/${encodeURIComponent(id)}`
    );
    
    // Check if the response indicates the coin was not found
    if (res.status === 404) {
      throw new Error('Coin not found');
    }
    
    // Check if the response is not ok
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!validateCoinData(data)) {
      throw new Error('Invalid coin data received from API');
    }
    
    console.log(`Successfully fetched details for coin: ${id}`);
    return data;
  } catch (error) {
    console.error('Error getting coin details:', error);
    throw new Error(`Failed to get coin details for ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchCoinDetails(coinId: string) {
  try {
    // Validate coin ID format (basic validation)
    if (!coinId || typeof coinId !== 'string' || coinId.trim() === '') {
      console.error('Invalid coin ID:', coinId);
      return null;
    }
    
    console.log(`Fetching details for coin: ${coinId}`);
    const res = await fetchWithRetry(
      `/api/coins/${encodeURIComponent(coinId.trim())}`
    );
    
    // Check if the response indicates the coin was not found
    if (res.status === 404) {
      console.log(`Coin not found: ${coinId}`);
      return null;
    }
    
    // Check if the response is not ok
    if (!res.ok) {
      console.error(`HTTP error ${res.status} for coin ${coinId}`);
      return null;
    }
    
    const data = await res.json();
    
    if (!validateCoinData(data)) {
      console.error('Invalid coin data received for:', coinId);
      return null;
    }
    
    console.log(`Successfully fetched details for coin: ${coinId}`);
    return data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    
    // Don't throw the error, return null instead to allow graceful handling
    return null;
  }
}
