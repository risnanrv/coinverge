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
      
      if (response.ok) {
        return response;
      }
      
      // If response is not ok, throw with status info
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('Coin not found');
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
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
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
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
    );
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
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId.trim())}`
    );
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

// Helper function to clean up invalid coin IDs from localStorage
export function cleanupInvalidCoinIds(): string[] {
  try {
    const stored = localStorage.getItem("portfolioCoins");
    if (!stored) return [];
    
    const coinIds: string[] = JSON.parse(stored);
    if (!Array.isArray(coinIds)) return [];
    
    // Filter out obviously invalid IDs
    const validIds = coinIds.filter(id => 
      id && 
      typeof id === 'string' && 
      id.trim() !== '' && 
      !id.includes(' ') && 
      id.length > 0
    );
    
    // Update localStorage with cleaned IDs
    if (validIds.length !== coinIds.length) {
      localStorage.setItem("portfolioCoins", JSON.stringify(validIds));
      console.log(`Cleaned up ${coinIds.length - validIds.length} invalid coin IDs`);
    }
    
    return validIds;
  } catch (error) {
    console.error('Error cleaning up coin IDs:', error);
    return [];
  }
}

// Health check function to test API connectivity
export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log('Checking API health...');
    const response = await fetch('https://api.coingecko.com/api/v3/ping', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('API health check passed');
      return true;
    } else {
      console.log(`API health check failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
