import { Link, useLocation } from "react-router-dom";
import { Sprout } from "lucide-react";
import { UserButton, SignInButton, SignUpButton, useUser, useClerk } from "@clerk/clerk-react";

const navItems = [
  { title: "Dashboard", path: "/" },
  { title: "Weather", path: "/weather" },
  { title: "Crop Health", path: "/crop-health" },
  { title: "Resource Management", path: "/resources" },
  { title: "Market Prices", path: "/market" },
  { title: "Community", path: "/community" },
  { title: "Analytics", path: "/analytics" },
];

export function TopNavBar() {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Sprout className="h-7 w-7 text-white" />
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow">FarmWise</span>
        </div>
        <div className="flex gap-2 md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/20 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-700 ${location.pathname === item.path ? "bg-white/20 text-yellow-300" : "text-white"}`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-md shadow-sm hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-secondary text-secondary-foreground font-semibold px-3 py-1.5 rounded-md border border-primary/20 shadow-sm hover:bg-secondary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 