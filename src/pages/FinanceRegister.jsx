import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";
import BackButton from "../components/BackButton";

export default function FinanceRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    departmentDetails: {
      name: "",
      code: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      contactPerson: {
        name: "",
        designation: "",
        phone: "",
        email: "",
      },
    },
    financialSettings: {
      maxPaymentAmount: 100000,
      paymentMethods: ["bank_transfer"],
      autoPaymentThreshold: 10000,
      paymentSchedule: {
        frequency: "semester",
        dayOfMonth: 1,
      },
    },
    password: "",
    confirmPassword: "",
  });

  const inputClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const selectClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const handleChange = (
    e,
    section,
    subsection = null,
    subsubsection = null
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newValue = type === "checkbox" ? checked : value;

      if (subsubsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [subsubsection]: {
                ...prev[section][subsection][subsubsection],
                [name]: newValue,
              },
            },
          },
        };
      }

      if (subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [name]: newValue,
            },
          },
        };
      }

      // For top-level fields like password and confirmPassword
      if (section === "password" || section === "confirmPassword") {
        return {
          ...prev,
          [section]: newValue,
        };
      }

      // For other sections
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: newValue,
        },
      };
    });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => {
      const currentMethods = [...prev.financialSettings.paymentMethods];
      const index = currentMethods.indexOf(method);

      if (index === -1) {
        currentMethods.push(method);
      } else {
        currentMethods.splice(index, 1);
      }

      return {
        ...prev,
        financialSettings: {
          ...prev.financialSettings,
          paymentMethods: currentMethods,
        },
      };
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Format the data to match the server's expected structure
      const formattedData = {
        name: formData.departmentDetails.contactPerson.name,
        email: formData.departmentDetails.contactPerson.email,
        password: formData.password,
        departmentName: formData.departmentDetails.name,
        departmentCode: formData.departmentDetails.code,
        address: {
          street: formData.departmentDetails.address.street,
          city: formData.departmentDetails.address.city,
          state: formData.departmentDetails.address.state,
          pincode: formData.departmentDetails.address.pincode,
        },
        contactPerson: {
          name: formData.departmentDetails.contactPerson.name,
          designation: formData.departmentDetails.contactPerson.designation,
          phone: formData.departmentDetails.contactPerson.phone,
          email: formData.departmentDetails.contactPerson.email,
        },
      };

      console.log("Sending registration data:", {
        ...formattedData,
        password: "[REDACTED]",
      });

      const response = await axios.post(
        "https://pmsss-backend.vercel.app/api/auth/register/finance",
        formattedData
      );
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Department Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.departmentDetails.name}
            onChange={(e) => handleChange(e, "departmentDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department Code
          </label>
          <input
            type="text"
            name="code"
            required
            value={formData.departmentDetails.code}
            onChange={(e) => handleChange(e, "departmentDetails")}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Department Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Street
          </label>
          <input
            type="text"
            name="street"
            value={formData.departmentDetails.address.street}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.departmentDetails.address.city}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
            className={inputClasses}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.departmentDetails.address.state}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.departmentDetails.address.pincode}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Contact Person Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.departmentDetails.contactPerson.name}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
            }
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.departmentDetails.contactPerson.designation}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
            }
            className={inputClasses}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.departmentDetails.contactPerson.phone}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
            }
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.departmentDetails.contactPerson.email}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
            }
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Financial Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Payment Amount (₹)
          </label>
          <input
            type="number"
            name="maxPaymentAmount"
            required
            value={formData.financialSettings.maxPaymentAmount}
            onChange={(e) => handleChange(e, "financialSettings")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Auto Payment Threshold (₹)
          </label>
          <input
            type="number"
            name="autoPaymentThreshold"
            value={formData.financialSettings.autoPaymentThreshold}
            onChange={(e) => handleChange(e, "financialSettings")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Payment Methods</h4>
        <div className="space-y-2">
          {["bank_transfer", "cheque", "demand_draft"].map((method) => (
            <div key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.financialSettings.paymentMethods.includes(
                  method
                )}
                onChange={() => handlePaymentMethodChange(method)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                {method
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Payment Schedule</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.financialSettings.paymentSchedule.frequency}
              onChange={(e) =>
                handleChange(e, "financialSettings", "paymentSchedule")
              }
              className={selectClasses}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semester">Semester</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Day of Month
            </label>
            <input
              type="number"
              name="dayOfMonth"
              min="1"
              max="31"
              value={formData.financialSettings.paymentSchedule.dayOfMonth}
              onChange={(e) =>
                handleChange(e, "financialSettings", "paymentSchedule")
              }
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Account Password</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handlePasswordChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handlePasswordChange}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`flex items-center ${
            currentStep === step ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep === step
                ? "bg-indigo-600 text-white scale-110"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          <div className="ml-3 text-sm font-medium">
            {step === 1 && "Department Details"}
            {step === 2 && "Address"}
            {step === 3 && "Contact Person"}
            {step === 4 && "Settings"}
          </div>
        </div>
      ))}
    </div>
  );

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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-indigo-800/30 to-blue-700/40" />
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Join as Finance Bureau</h1>
            <p className="text-lg text-gray-200">
              Register your department to manage scholarship payments and
              financial disbursements.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-3xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Finance Department Registration
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl sm:px-10">
            {renderStepIndicator()}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Registering...
                      </span>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
