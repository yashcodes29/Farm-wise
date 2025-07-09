import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_KEY = import.meta.env.VITE_AGMARKNET_API_KEY || "***";

// Static list of all Indian states
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Static list of common commodities (can be expanded)
const COMMODITIES = [
  "Banana", "Wheat", "Rice", "Maize", "Onion", "Potato", "Tomato", "Cotton", "Sugarcane", "Soybean", "Turmeric", "Mango", "Chilli", "Groundnut", "Barley", "Paddy", "Jowar", "Bajra", "Mustard", "Sunflower", "Peas", "Apple", "Grapes", "Orange", "Lemon", "Cabbage", "Cauliflower", "Carrot", "Brinjal", "Garlic", "Ginger", "Coriander", "Coconut", "Papaya", "Pomegranate", "Guava", "Watermelon", "Muskmelon"
];

export const MarketPrices = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  // For dropdown options
  const [districts, setDistricts] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  // Fetch districts when state changes
  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setDistrict("");
      return;
    }
    async function fetchDistricts() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.data.gov.in/resource/c6e3688b-d2a7-479a-9b06-02b6a6a0a7b2?api-key=${API_KEY}&format=json&filters[State]=${encodeURIComponent(state)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        const uniqueDistricts = Array.from(new Set(data.records.map((r: any) => r.district).filter(Boolean))) as string[];
        setDistricts(uniqueDistricts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDistricts();
    // eslint-disable-next-line
  }, [state]);

  // Fetch arrival dates when filters change (state, district, commodity)
  useEffect(() => {
    if (!state && !district && !commodity) {
      setDates([]);
      setArrivalDate("");
      return;
    }
    async function fetchDates() {
      setLoading(true);
      setError(null);
      let url = `https://api.data.gov.in/resource/c6e3688b-d2a7-479a-9b06-02b6a6a0a7b2?api-key=${API_KEY}&format=json`;
      if (state) url += `&filters[State]=${encodeURIComponent(state)}`;
      if (district) url += `&filters[District]=${encodeURIComponent(district)}`;
      if (commodity) url += `&filters[Commodity]=${encodeURIComponent(commodity)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch dates");
        const data = await res.json();
        const uniqueDates = Array.from(new Set(data.records.map((r: any) => r.arrival_date).filter(Boolean))) as string[];
        setDates(uniqueDates);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDates();
    // eslint-disable-next-line
  }, [state, district, commodity]);

  // Fetch prices with filters when Fetch button is clicked
  async function fetchPrices() {
    setLoading(true);
    setError(null);
    let url = `https://api.data.gov.in/resource/c6e3688b-d2a7-479a-9b06-02b6a6a0a7b2?api-key=${API_KEY}&format=json`;
    if (state) url += `&filters[State]=${encodeURIComponent(state)}`;
    if (district) url += `&filters[District]=${encodeURIComponent(district)}`;
    if (commodity) url += `&filters[Commodity]=${encodeURIComponent(commodity)}`;
    if (arrivalDate) url += `&filters[Arrival_Date]=${encodeURIComponent(arrivalDate)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch market prices");
      const data = await res.json();
      setPrices(data.records || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="bg-accent/10">
        <CardTitle className="text-accent-foreground">Market Prices (data.gov.in)</CardTitle>
        <CardDescription>Latest mandi prices from the Government of India</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-xs mb-1 text-muted-foreground">State</label>
            <select
              className="px-3 py-2 rounded border border-border bg-background text-foreground"
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="">All States in India</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 text-muted-foreground">District</label>
            <select
              className="px-3 py-2 rounded border border-border bg-background text-foreground"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">All Districts in India</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 text-muted-foreground">Commodity</label>
            <select
              className="px-3 py-2 rounded border border-border bg-background text-foreground"
              value={commodity}
              onChange={e => setCommodity(e.target.value)}
            >
              <option value="">All Commodities</option>
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 text-muted-foreground">Arrival Date</label>
            <select
              className="px-3 py-2 rounded border border-border bg-background text-foreground"
              value={arrivalDate}
              onChange={e => setArrivalDate(e.target.value)}
              disabled={dates.length === 0}
            >
              <option value="">All Dates</option>
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded shadow-sm hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
            onClick={fetchPrices}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>
        {loading ? (
          <div className="p-6 text-center">Loading market prices...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Commodity</th>
                  <th className="px-2 py-1">Variety</th>
                  <th className="px-2 py-1">Market</th>
                  <th className="px-2 py-1">State</th>
                  <th className="px-2 py-1">Min Price</th>
                  <th className="px-2 py-1">Max Price</th>
                  <th className="px-2 py-1">Modal Price</th>
                  <th className="px-2 py-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-1">{item.commodity}</td>
                    <td className="px-2 py-1">{item.variety}</td>
                    <td className="px-2 py-1">{item.market}</td>
                    <td className="px-2 py-1">{item.state}</td>
                    <td className="px-2 py-1">{item.min_price}</td>
                    <td className="px-2 py-1">{item.max_price}</td>
                    <td className="px-2 py-1">{item.modal_price}</td>
                    <td className="px-2 py-1">{item.arrival_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};