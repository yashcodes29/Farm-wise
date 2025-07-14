import { Sprout } from "lucide-react";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

export function TopNavBar() {
  const { user } = useUser();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between h-16">
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-3">
          {/* Back button, only show if not on home page */}
          {location.pathname !== '/' && (
            <button
              onClick={() => window.history.back()}
              className="mr-2 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-700"
              aria-label="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          <Sprout className="h-7 w-7 text-white" />
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow">FarmWise</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`hidden sm:inline-block px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-white/10 text-white hover:bg-white/20 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-700 ${location.pathname === '/' ? 'bg-white/20 text-yellow-300' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/"
            className={`sm:hidden flex items-center justify-center px-2 py-1 rounded-md text-base font-bold bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-700 ${location.pathname === '/' ? 'bg-white/20 text-yellow-300' : ''}`}
            aria-label="Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
          </Link>
          {user ? (
            <UserButton afterSignOutUrl="/" />
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