
import { useUser } from "@clerk/clerk-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { CloudSun, Leaf, Activity, ShoppingCart, Users, BarChart3 } from "lucide-react";

const navItems = [
  { title: "Weather", path: "/weather", icon: <CloudSun className="inline-block mr-2 h-5 w-5 text-blue-400" />, emoji: "🌦️" },
  { title: "Crop Health", path: "/crop-health", icon: <Leaf className="inline-block mr-2 h-5 w-5 text-green-500" />, emoji: "🌱" },
  { title: "Resource Management", path: "/resources", icon: <Activity className="inline-block mr-2 h-5 w-5 text-orange-400" />, emoji: "🛠️" },
  { title: "Market Prices", path: "/market", icon: <ShoppingCart className="inline-block mr-2 h-5 w-5 text-yellow-500" />, emoji: "💹" },
  { title: "Community", path: "/community", icon: <Users className="inline-block mr-2 h-5 w-5 text-pink-500" />, emoji: "🤝" },
  { title: "Analytics", path: "/analytics", icon: <BarChart3 className="inline-block mr-2 h-5 w-5 text-purple-500" />, emoji: "📈" },
];

const Index = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-96 text-lg text-primary animate-pulse">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in px-4">
        <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow mb-4 animate-bounce">🌱🚜</span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-primary drop-shadow mb-2 text-center">Welcome to <span className="inline-block animate-wiggle">FarmWise</span>!</h1>
        <p className="text-base sm:text-lg md:text-xl text-secondary-foreground mb-4 max-w-xl text-center animate-fade-in">
          <span className="font-semibold text-accent">FarmWise</span> is your all-in-one smart farming assistant. Sign in to get started!
        </p>
        {/* Context message before sign in */}
        <div className="mb-4 text-center text-lg text-primary font-semibold bg-yellow-100 border border-yellow-300 rounded px-4 py-2 shadow animate-fade-in">
          Sign in to use all the features.
        </div>
        <div className="flex gap-4 mb-4">
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-base">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-secondary text-secondary-foreground font-semibold px-5 py-2 rounded-md border border-primary/20 shadow-sm hover:bg-secondary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-base">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in gap-8 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary drop-shadow mb-1 text-center flex items-center gap-2">👋 Welcome, {user.fullName || user.username || "Farmer"}!</h1>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-accent mb-2 mt-2 text-center flex items-center gap-2">How can I help you today? <span className="animate-bounce">🤔</span></h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-3xl">
        {navItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className="w-full px-4 py-4 sm:px-6 sm:py-5 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-500 text-white text-base sm:text-lg font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-center gap-2 animate-fade-in"
            style={{ minHeight: '56px' }}
          >
            <span className="text-xl sm:text-2xl md:text-3xl mr-2">{item.emoji}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className="mt-8 text-muted-foreground text-sm text-center animate-fade-in">🌾 <span className="font-semibold text-primary">FarmWise</span> — Smart, beautiful, and made for you! 🚀</div>
    </div>
  );
};

export default Index;
