export async function getMarketPrices(apiKey: string) {
  const resourceId = "c6e3688b-d2a7-479a-9b06-02b6a6a0a7b2"; // Daily market prices
  const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch market prices");
  const data = await res.json();
  return data.records; // Array of price records
} 