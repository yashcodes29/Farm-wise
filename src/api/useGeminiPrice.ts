import axios from "axios";

const GEMINI_API_KEY = "AIzaSyAFNstzZClkph0txiAArEhYnJ6oKwimHAk";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export async function getLatestPrices(commodities: string[]) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key not found. Please check your .env file.");
  }

  const prompt = `Give the latest wholesale market prices in India for: ${commodities.join(", ")}. 
  Format it as a bullet list with ₹/quintal.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, body);
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No data received.";
  } catch (error: any) {
    console.error("Gemini API error:", error.response || error.message);
    throw new Error("Failed to fetch prices from Gemini.");
  }
}
