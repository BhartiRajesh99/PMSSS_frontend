import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <main>
        {/* Hero Section with Background Image */}
        <div className="relative mx-auto ">
          <div className="relative overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                filter: "brightness(0.5)",
              }}
            />

            {/* Overlay with subtle blue gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-indigo-800/30 to-blue-700/40" />

            {/* Content */}
            <div className="relative px-4 sm:px-6 lg:px-8 py-32 md:py-40">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-indigo-200 mt-3 bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                    PMSSS Portal
                  </span>
                </h1>
                <p className="mt-8 max-w-4xl text-[1.4em] mx-auto text-white leading-relaxed">
                  Your one-stop solution for managing student scholarships and
                  financial aid. Streamline your educational journey with our
                  comprehensive platform designed for students, SAG Bureau, and
                  Finance Bureau. Experience seamless scholarship applications,
                  real-time tracking, and efficient fund management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Student Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-6 py-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  For Students
                </h3>
                <p className="text-slate-600 mb-6">
                  Apply for scholarships, track your applications, and manage
                  your financial aid.
                </p>
                <Link
                  to="/register/student"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Register as Student
                </Link>
              </div>
            </div>

            {/* SAG Bureau Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-6 py-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  For SAG Bureau
                </h3>
                <p className="text-slate-600 mb-6">
                  Manage scholarship applications and verify student
                  eligibility.
                </p>
                <Link
                  to="/register/sag"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  Register as SAG Bureau
                </Link>
              </div>
            </div>

            {/* Finance Bureau Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-6 py-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  For Finance Bureau
                </h3>
                <p className="text-slate-600 mb-6">
                  Process payments and manage financial disbursements.
                </p>
                <Link
                  to="/register/finance"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                  Register as Finance Bureau
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <p className="text-base text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-slate-500">
              <p>© 2024 PMSSS Portal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
