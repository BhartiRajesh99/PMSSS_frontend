import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

export default function SAGRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationDetails: {
      name: "",
      type: "",
      registrationNumber: "",
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
    settings: {
      maxApplicationsPerDay: 100,
      autoApproveThreshold: 85,
      notificationPreferences: {
        email: true,
        sms: true,
      },
    },
    password: "",
    confirmPassword: "",
  });

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-2";

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

      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: newValue,
          },
        };
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate required fields
    if (
      !formData.organizationDetails.name ||
      !formData.organizationDetails.type ||
      !formData.organizationDetails.registrationNumber ||
      !formData.organizationDetails.contactPerson.email ||
      !formData.organizationDetails.contactPerson.name ||
      !formData.organizationDetails.contactPerson.designation ||
      !formData.organizationDetails.contactPerson.phone ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Format the data according to the SAG model requirements
      const registrationData = {
        name: formData.organizationDetails.name,
        email: formData.organizationDetails.contactPerson.email,
        password: formData.password,
        organizationDetails: {
          name: formData.organizationDetails.name,
          type: formData.organizationDetails.type,
          registrationNumber: formData.organizationDetails.registrationNumber,
          address: formData.organizationDetails.address,
          contactPerson: formData.organizationDetails.contactPerson,
        },
        settings: formData.settings,
      };

      console.log("Sending registration data:", registrationData);
      const response = await axios.post(
        "/api/auth/register/sag",
        registrationData
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
      <h3 className="text-lg font-medium text-gray-900">
        Organization Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.organizationDetails.name}
            onChange={(e) => handleChange(e, "organizationDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organization Type
          </label>
          <select
            name="type"
            required
            value={formData.organizationDetails.type}
            onChange={(e) => handleChange(e, "organizationDetails")}
            className={inputClasses}
          >
            <option value="">Select Type</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="autonomous">Autonomous</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Registration Number
        </label>
        <input
          type="text"
          name="registrationNumber"
          required
          value={formData.organizationDetails.registrationNumber}
          onChange={(e) => handleChange(e, "organizationDetails")}
          className={inputClasses}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="street"
              required
              value={formData.organizationDetails.address.street}
              onChange={(e) =>
                handleChange(e, "organizationDetails", "address")
              }
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
              required
              value={formData.organizationDetails.address.city}
              onChange={(e) =>
                handleChange(e, "organizationDetails", "address")
              }
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
              required
              value={formData.organizationDetails.address.state}
              onChange={(e) =>
                handleChange(e, "organizationDetails", "address")
              }
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
              required
              value={formData.organizationDetails.address.pincode}
              onChange={(e) =>
                handleChange(e, "organizationDetails", "address")
              }
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
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
            required
            value={formData.organizationDetails?.contactPerson?.name || ""}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
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
            required
            value={
              formData.organizationDetails?.contactPerson?.designation || ""
            }
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
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
            required
            value={formData.organizationDetails?.contactPerson?.phone || ""}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
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
            required
            value={formData.organizationDetails?.contactPerson?.email || ""}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
            }
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Applications Per Day
          </label>
          <input
            type="number"
            name="maxApplicationsPerDay"
            value={formData.settings?.maxApplicationsPerDay || 100}
            onChange={(e) => handleChange(e, "settings")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Auto Approve Threshold (%)
          </label>
          <input
            type="number"
            name="autoApproveThreshold"
            min="0"
            max="100"
            value={formData.settings?.autoApproveThreshold || 85}
            onChange={(e) => handleChange(e, "settings")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Notification Preferences
        </h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="email"
              checked={
                formData.settings?.notificationPreferences?.email ?? true
              }
              onChange={(e) =>
                handleChange(e, "settings", "notificationPreferences")
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="sms"
              checked={formData.settings?.notificationPreferences?.sms ?? true}
              onChange={(e) =>
                handleChange(e, "settings", "notificationPreferences")
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              SMS Notifications
            </label>
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
            value={formData.password || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
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
            value={formData.confirmPassword || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3].map((step) => (
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
            {step === 1 && "Organization Details"}
            {step === 2 && "Contact Person"}
            {step === 3 && "Settings"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SAG Registration
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
              {currentStep < 3 ? (
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
