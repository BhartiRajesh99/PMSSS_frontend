import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";
import BackButton from "../components/BackButton";

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
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const selectClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const handleChange = (
    e,
    section,
    subsection = null,
    subsubsection = null
  ) => {
    const { name, value, type, checked } = e.target;

    // Clear error for the field being changed
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Handle nested fields
      if (section === "organizationDetails") {
        if (subsection === "address") {
          delete newErrors[name]; // For address fields (street, city, state, pincode)
        } else if (subsection === "contactPerson") {
          // Map contact person field names to their error keys
          const errorKeyMap = {
            name: "contactName",
            designation: "designation",
            phone: "phone",
            email: "email",
          };
          delete newErrors[errorKeyMap[name]];
        } else {
          delete newErrors[name]; // For direct organization fields
        }
      } else if (section === "settings") {
        delete newErrors[name]; // For settings fields
      } else {
        delete newErrors[name]; // For password fields
      }
      return newErrors;
    });

    // Special handling for registration number to convert to uppercase
    if (name === "registrationNumber") {
      const upperValue = value.toUpperCase();
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: upperValue,
        },
      }));
      return;
    }

    // Direct handling for password fields
    if (name === "password" || name === "confirmPassword") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Organization Details Validation
      if (!formData.organizationDetails.name?.trim()) {
        newErrors.name = "Organization name is required";
      } else if (formData.organizationDetails.name.length < 3) {
        newErrors.name = "Organization name must be at least 3 characters";
      }

      if (!formData.organizationDetails.type) {
        newErrors.type = "Organization type is required";
      }

      if (!formData.organizationDetails.registrationNumber?.trim()) {
        newErrors.registrationNumber = "Registration number is required";
      } else if (
        !/^[A-Z0-9]{6,12}$/.test(
          formData.organizationDetails.registrationNumber
        )
      ) {
        newErrors.registrationNumber =
          "Registration number must be 6-12 alphanumeric characters (uppercase letters and numbers only)";
      }

      // Address Validation
      if (!formData.organizationDetails.address.street?.trim()) {
        newErrors.street = "Street address is required";
      } else if (formData.organizationDetails.address.street.length < 5) {
        newErrors.street = "Street address must be at least 5 characters";
      }

      if (!formData.organizationDetails.address.city?.trim()) {
        newErrors.city = "City is required";
      } else if (formData.organizationDetails.address.city.length < 2) {
        newErrors.city = "City name must be at least 2 characters";
      }

      if (!formData.organizationDetails.address.state?.trim()) {
        newErrors.state = "State is required";
      } else if (formData.organizationDetails.address.state.length < 2) {
        newErrors.state = "State name must be at least 2 characters";
      }

      if (!formData.organizationDetails.address.pincode?.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (
        !/^\d{6}$/.test(formData.organizationDetails.address.pincode)
      ) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }

    if (step === 2) {
      // Contact Person Validation
      if (!formData.organizationDetails.contactPerson.name?.trim()) {
        newErrors.contactName = "Contact person name is required";
      } else if (formData.organizationDetails.contactPerson.name.length < 3) {
        newErrors.contactName = "Name must be at least 3 characters";
      }

      if (!formData.organizationDetails.contactPerson.designation?.trim()) {
        newErrors.designation = "Designation is required";
      } else if (
        formData.organizationDetails.contactPerson.designation.length < 2
      ) {
        newErrors.designation = "Designation must be at least 2 characters";
      }

      if (!formData.organizationDetails.contactPerson.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^\d{10}$/.test(formData.organizationDetails.contactPerson.phone)
      ) {
        newErrors.phone = "Phone number must be 10 digits";
      }

      if (!formData.organizationDetails.contactPerson.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.organizationDetails.contactPerson.email
        )
      ) {
        newErrors.email = "Invalid email format";
      }
    }

    if (step === 3) {
      // Settings Validation
      if (!formData.settings.maxApplicationsPerDay) {
        newErrors.maxApplicationsPerDay =
          "Max applications per day is required";
      } else if (
        formData.settings.maxApplicationsPerDay < 1 ||
        formData.settings.maxApplicationsPerDay > 1000
      ) {
        newErrors.maxApplicationsPerDay =
          "Max applications must be between 1 and 1000";
      }

      if (!formData.settings.autoApproveThreshold) {
        newErrors.autoApproveThreshold = "Auto approve threshold is required";
      } else if (
        formData.settings.autoApproveThreshold < 0 ||
        formData.settings.autoApproveThreshold > 100
      ) {
        newErrors.autoApproveThreshold = "Threshold must be between 0 and 100";
      }

      // Password Validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one special character (!@#$%^&*)";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      // Format the data according to the SAG model requirements
      const registrationData = {
        name: formData.organizationDetails.contactPerson.name,
        email: formData.organizationDetails.contactPerson.email,
        password: formData.password,
        organizationDetails: {
          name: formData.organizationDetails.name,
          type: formData.organizationDetails.type,
          registrationNumber: formData.organizationDetails.registrationNumber,
          address: {
            street: formData.organizationDetails.address.street,
            city: formData.organizationDetails.address.city,
            state: formData.organizationDetails.address.state,
            pincode: formData.organizationDetails.address.pincode,
          },
          contactPerson: {
            name: formData.organizationDetails.contactPerson.name,
            designation: formData.organizationDetails.contactPerson.designation,
            phone: formData.organizationDetails.contactPerson.phone,
            email: formData.organizationDetails.contactPerson.email,
          },
        },
      };

      console.log("Sending registration data:", {
        ...registrationData,
        password: "[REDACTED]",
      });
      const response = await axios.post(
        "https://pmsss-backend.vercel.app/api/auth/register/sag",
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            className={`${inputClasses} ${errors.name ? "border-red-300" : ""}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
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
            className={`${selectClasses} ${
              errors.type ? "border-red-300" : ""
            }`}
          >
            <option value="">Select Type</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="autonomous">Autonomous</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Registration Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="registrationNumber"
          required
          placeholder="Enter 6-12 alphanumeric characters"
          value={formData.organizationDetails.registrationNumber}
          onChange={(e) => handleChange(e, "organizationDetails")}
          className={`${inputClasses} ${
            errors.registrationNumber ? "border-red-300" : ""
          }`}
        />
        {errors.registrationNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.registrationNumber}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Enter your organization's registration number (uppercase letters and
          numbers only)
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Address</h4>
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
              className={`${inputClasses} ${
                errors.street ? "border-red-300" : ""
              }`}
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
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
              className={`${inputClasses} ${
                errors.city ? "border-red-300" : ""
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
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
              className={`${inputClasses} ${
                errors.state ? "border-red-300" : ""
              }`}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
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
              className={`${inputClasses} ${
                errors.pincode ? "border-red-300" : ""
              }`}
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
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
            value={formData.organizationDetails.contactPerson.name}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
            }
            className={`${inputClasses} ${
              errors.contactName ? "border-red-300" : ""
            }`}
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            required
            value={formData.organizationDetails.contactPerson.designation}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
            }
            className={`${inputClasses} ${
              errors.designation ? "border-red-300" : ""
            }`}
          />
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )}
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
            value={formData.organizationDetails.contactPerson.phone}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
            }
            className={`${inputClasses} ${
              errors.phone ? "border-red-300" : ""
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.organizationDetails.contactPerson.email}
            onChange={(e) =>
              handleChange(e, "organizationDetails", "contactPerson")
            }
            className={`${inputClasses} ${
              errors.email ? "border-red-300" : ""
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
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
          <div className="relative">
            <input
              type="number"
              name="maxApplicationsPerDay"
              min="1"
              max="1000"
              required
              value={formData.settings.maxApplicationsPerDay}
              onChange={(e) => handleChange(e, "settings")}
              className={`${inputClasses} ${
                errors.maxApplicationsPerDay ? "border-red-300" : ""
              }`}
            />
            <div className="absolute inset-y-0 right-2 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">apps</span>
            </div>
          </div>
          {errors.maxApplicationsPerDay && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxApplicationsPerDay}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Maximum number of applications that can be processed per day
            (1-1000)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Auto Approve Threshold
          </label>
          <div className="relative">
            <input
              type="number"
              name="autoApproveThreshold"
              min="0"
              max="100"
              required
              value={formData.settings.autoApproveThreshold}
              onChange={(e) => handleChange(e, "settings")}
              className={`${inputClasses} ${
                errors.autoApproveThreshold ? "border-red-300" : ""
              }`}
            />
            <div className="absolute inset-y-0 right-2 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          {errors.autoApproveThreshold && (
            <p className="mt-1 text-sm text-red-600">
              {errors.autoApproveThreshold}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Applications scoring above this percentage will be auto-approved
            (0-100)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Account Password</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
              className={`${inputClasses} pr-10 ${
                errors.password ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
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
                    strokeWidth="2"
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
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Password must be at least 8 characters long and include uppercase,
            lowercase, number, and special character
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={(e) => handleChange(e, "confirmPassword")}
              className={`${inputClasses} pr-10 ${
                errors.confirmPassword ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-12">
      <div className="flex items-center space-x-3">
        <div className="text-sm font-medium text-gray-500">
          Step {currentStep} of 3
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-purple-600 text-white ring-4 ring-purple-100`}
        >
          {currentStep}
        </div>
        <div className="text-sm font-medium text-purple-600">
          {currentStep === 1 && "Organization Details"}
          {currentStep === 2 && "Contact Person"}
          {currentStep === 3 && "Settings"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <BackButton />
      {/* Left side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 fixed h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "brightness(0.5)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-700/40" />
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Join as SAG Bureau</h1>
            <p className="text-lg text-gray-200">
              Register your organization to manage and verify scholarship
              applications.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-3xl space-y-8 py-16 sm:py-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              SAG Bureau Registration
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
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

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className=" flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <>
                        Complete Registration
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </>
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
