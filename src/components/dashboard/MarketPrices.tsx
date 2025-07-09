import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_KEY = import.meta.env.VITE_AGMARKNET_API_KEY || "***";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

// Static list of all Indian states and union territories
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Comprehensive mapping of state/UT to districts
const stateDistricts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"],
  "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar", "SBS Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Ganganagar", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim", "Pakyong", "Soreng"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sant Kabir Nagar", "Sant Ravidas Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Agatti", "Amini", "Andrott", "Bithra", "Chetlat", "Kadmat", "Kalpeni", "Kavaratti", "Kilthan", "Minicoy"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// Static list of common commodities (can be expanded)
const commodities = [
  "Banana", "Wheat", "Rice", "Maize", "Onion", "Potato", "Tomato", "Cotton", "Sugarcane", "Soybean", "Turmeric", "Mango", "Chilli", "Groundnut", "Barley", "Paddy", "Jowar", "Bajra", "Mustard", "Sunflower", "Peas", "Apple", "Grapes", "Orange", "Lemon", "Cabbage", "Cauliflower", "Carrot", "Brinjal", "Garlic", "Ginger", "Coriander", "Coconut", "Papaya", "Pomegranate", "Guava", "Watermelon", "Muskmelon"
];

// Helper to parse DD/MM/YYYY to Date
function parseDDMMYYYY(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// Helper to format Date to DD/MM/YYYY
function formatDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const MarketPrices = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [multiDayData, setMultiDayData] = useState<{ date: string, records: any[], url: string }[]>([]);
  const [fallbackData, setFallbackData] = useState<any[]>([]);
  const [fallbackDate, setFallbackDate] = useState<string | null>(null);

  // Filter state
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");

  // Get districts for the selected state
  const availableDistricts = stateDistricts[state] || [];

  // Fetch only the most recent available data for the selected filters
  async function fetchMostRecent() {
    setLoading(true);
    setError(null);
    setFallbackData([]);
    setFallbackDate(null);
    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json`;
    if (state) url += `&filters[state.keyword]=${encodeURIComponent(state)}`;
    if (district) url += `&filters[district]=${encodeURIComponent(district)}`;
    if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch market prices");
      const data = await res.json();
      if (data.records && data.records.length > 0) {
        // Find the most recent date in the records
        const sorted = [...data.records].sort((a, b) => {
          const da = parseDDMMYYYY(a.arrival_date);
          const db = parseDDMMYYYY(b.arrival_date);
          return db && da ? db.getTime() - da.getTime() : 0;
        });
        setFallbackData(sorted);
        setFallbackDate(sorted[0]?.arrival_date || null);
      } else {
        setFallbackData([]);
        setFallbackDate(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className="bg-accent/10">
        <CardTitle className="text-accent-foreground">Market Prices (data.gov.in)</CardTitle>
        <CardDescription>Latest mandi prices from the Government of India</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6 items-end justify-center">
          <div>
            <label className="block text-xs mb-1 text-muted-foreground">State</label>
            <select
              className="px-3 py-2 rounded border border-border bg-background text-foreground"
              value={state}
              onChange={e => {
                setState(e.target.value);
                setDistrict(""); // Reset district when state changes
              }}
            >
              <option value="">All States in India</option>
              {states.map(s => (
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
              disabled={!state || availableDistricts.length === 0}
            >
              <option value="">{state ? "All Districts" : "Select State First"}</option>
              {availableDistricts.map(d => (
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
              {commodities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded shadow-sm hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
            onClick={fetchMostRecent}
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
          <div className="w-full flex flex-col items-center">
            {fallbackData.length > 0 ? (
              <div className="w-full flex flex-col items-center">
                <div className="mb-2 font-semibold text-base text-center text-primary">Most Recent Available Data (Arrival: {fallbackDate})</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
                  {fallbackData.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-card border border-border rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-center justify-between transition-shadow duration-200 hover:shadow-xl mx-auto min-w-[260px] max-w-xs mb-4"
                    >
                      <div className="flex flex-col items-center w-full mb-2 gap-1">
                        <span className="font-bold text-xl text-primary text-center">{item.commodity}</span>
                        <span className="text-xs bg-accent px-3 py-1 rounded-full text-accent-foreground mt-1">{item.variety}</span>
                      </div>
                      <div className="text-sm text-muted-foreground text-center mb-2 w-full">{item.market}, {item.district}, {item.state}</div>
                      <div className="flex flex-row flex-wrap gap-3 justify-center w-full mb-2">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-xs font-semibold">Min: ₹{item.min_price}</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs font-semibold">Max: ₹{item.max_price}</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-semibold">Modal: ₹{item.modal_price}</span>
                      </div>
                      <div className="text-xs text-center text-muted-foreground w-full mt-auto pt-2 border-t border-border">Arrival: {item.arrival_date}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">No data found for the selected filters.</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};