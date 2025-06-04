import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";
import BackButton from "../components/BackButton";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginAs: "student", // Default value
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const getThemeColor = (loginAs) => {
    switch (loginAs) {
      case "finance":
        return {
          bg: "bg-emerald-600",
          hover: "hover:bg-emerald-700",
          focus: "focus:ring-emerald-500",
          focusBorder: "focus:border-emerald-500",
          ring: "ring-emerald-100",
          text: "text-emerald-600",
          gradient: "from-emerald-900/40 via-emerald-800/30 to-emerald-700/40",
        };
      case "sag":
        return {
          bg: "bg-purple-600",
          hover: "hover:bg-purple-700",
          focus: "focus:ring-purple-500",
          focusBorder: "focus:border-purple-500",
          ring: "ring-purple-100",
          text: "text-purple-600",
          gradient: "from-purple-900/40 via-purple-800/30 to-purple-700/40",
        };
      default: // student
        return {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
          focus: "focus:ring-blue-500",
          focusBorder: "focus:border-blue-500",
          ring: "ring-blue-100",
          text: "text-blue-600",
          gradient: "from-blue-900/40 via-blue-800/30 to-blue-700/40",
        };
    }
  };

  const theme = getThemeColor(formData.loginAs);

  const inputClasses = `block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 ${theme.focus} ${theme.focusBorder} transition-colors duration-200 bg-white/50 backdrop-blur-sm`;

  const selectClasses = `block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 ${theme.focus} ${theme.focusBorder} transition-colors duration-200 bg-white/50 backdrop-blur-sm`;

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(
        formData.email,
        formData.password,
        formData.loginAs
      );

      // Redirect based on role
      switch (user.role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "sag_bureau":
          navigate("/sag-dashboard");
          break;
        case "finance_bureau":
          navigate("/finance-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      // Handle specific error cases
      if (error?.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error?.response?.status === 403) {
        toast.error("You don't have permission to access this role.");
      } else if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(
          error?.response?.data?.error ||
            "Unable to sign in. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      <BackButton />
      {/* Left side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "brightness(0.5)",
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.gradient}`}
        />
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg text-gray-200">
              Access your PMSSS Portal account to manage your scholarships and
              applications.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Sign in to your account
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className={`font-medium ${
                  theme.text
                } hover:${theme.text.replace(
                  "600",
                  "500"
                )} transition-colors duration-200`}
              >
                Create one now
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="loginAs"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Login as
                </label>
                <select
                  id="loginAs"
                  name="loginAs"
                  value={formData.loginAs}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="student">
                    Student
                  </option>
                  <option value="sag">
                    SAG Bureau
                  </option>
                  <option value="finance">
                    Finance Bureau
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-indigo-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${theme.bg} ${theme.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.focus} transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
