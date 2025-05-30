import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

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
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-3";

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
        address: formData.departmentDetails.address,
        contactPerson: {
          name: formData.departmentDetails.contactPerson.name,
          designation: formData.departmentDetails.contactPerson.designation,
          phone: formData.departmentDetails.contactPerson.phone,
          email: formData.departmentDetails.contactPerson.email,
        },
        settings: {
          maxPaymentsPerDay: formData.financialSettings.maxPaymentAmount,
          autoPaymentThreshold: formData.financialSettings.autoPaymentThreshold,
          notificationPreferences: {
            email: true,
            sms: true,
          },
        },
      };

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
              className={inputClasses}
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
    <div className="flex justify-between mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`flex items-center ${
            currentStep === step ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          <div className="ml-2">
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Finance Department Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicator()}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}