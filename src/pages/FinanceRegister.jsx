import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";
import BackButton from "../components/BackButton";

export default function FinanceRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [errors, setErrors] = useState({});

  const inputClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const selectClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const handleChange = (
    e,
    section,
    subsection = null,
    subsubsection = null
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Clear error for the field being changed
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Clear error for the specific field being changed
      if (section === "departmentDetails") {
        if (subsection === "address") {
          delete newErrors[name];
        } else if (subsection === "contactPerson") {
          // Map contact person field names to their error keys
          const errorKeyMap = {
            name: "contactName",
            designation: "designation",
            phone: "phone",
            email: "email",
          };
          delete newErrors[errorKeyMap[name] || name];
        } else {
          // Handle direct departmentDetails fields (name, code)
          delete newErrors[name];
        }
      } else if (section === "financialSettings") {
        if (subsection === "paymentSchedule") {
          delete newErrors[name];
        } else {
          delete newErrors[name];
        }
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

    setFormData((prev) => {
      // Special handling for department code to convert to uppercase
      if (section === "departmentDetails" && name === "code") {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value.toUpperCase(),
          },
        };
      }

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Department Details Validation
      if (!formData.departmentDetails.name?.trim()) {
        newErrors.name = "Department name is required";
      } else if (formData.departmentDetails.name.length < 3) {
        newErrors.name = "Department name must be at least 3 characters";
      }

      if (!formData.departmentDetails.code?.trim()) {
        newErrors.code = "Department code is required";
      } else if (!/^[A-Z0-9]{2,10}$/.test(formData.departmentDetails.code)) {
        newErrors.code = "Department code must be 2-10 alphanumeric characters";
      }
    }

    if (step === 2) {
      // Address Validation
      if (!formData.departmentDetails.address.street?.trim()) {
        newErrors.street = "Street address is required";
      } else if (formData.departmentDetails.address.street.length < 5) {
        newErrors.street = "Street address must be at least 5 characters";
      }

      if (!formData.departmentDetails.address.city?.trim()) {
        newErrors.city = "City is required";
      } else if (formData.departmentDetails.address.city.length < 2) {
        newErrors.city = "City must be at least 2 characters";
      }

      if (!formData.departmentDetails.address.state?.trim()) {
        newErrors.state = "State is required";
      } else if (formData.departmentDetails.address.state.length < 2) {
        newErrors.state = "State must be at least 2 characters";
      }

      if (!formData.departmentDetails.address.pincode?.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(formData.departmentDetails.address.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }

    if (step === 3) {
      // Contact Person Validation
      if (!formData.departmentDetails.contactPerson.name?.trim()) {
        newErrors.contactName = "Contact person name is required";
      } else if (formData.departmentDetails.contactPerson.name.length < 3) {
        newErrors.contactName = "Name must be at least 3 characters";
      }

      if (!formData.departmentDetails.contactPerson.designation?.trim()) {
        newErrors.designation = "Designation is required";
      } else if (
        formData.departmentDetails.contactPerson.designation.length < 2
      ) {
        newErrors.designation = "Designation must be at least 2 characters";
      }

      if (!formData.departmentDetails.contactPerson.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^\d{10}$/.test(formData.departmentDetails.contactPerson.phone)
      ) {
        newErrors.phone = "Phone number must be 10 digits";
      }

      if (!formData.departmentDetails.contactPerson.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.departmentDetails.contactPerson.email
        )
      ) {
        newErrors.email = "Invalid email format";
      }
    }

    if (step === 4) {
      // Financial Settings Validation
      if (!formData.financialSettings.maxPaymentAmount) {
        newErrors.maxPaymentAmount = "Maximum payment amount is required";
      } else if (
        formData.financialSettings.maxPaymentAmount < 1000 ||
        formData.financialSettings.maxPaymentAmount > 1000000
      ) {
        newErrors.maxPaymentAmount =
          "Amount must be between ₹1,000 and ₹10,00,000";
      }

      if (!formData.financialSettings.autoPaymentThreshold) {
        newErrors.autoPaymentThreshold = "Auto payment threshold is required";
      } else if (
        formData.financialSettings.autoPaymentThreshold < 1000 ||
        formData.financialSettings.autoPaymentThreshold > 100000
      ) {
        newErrors.autoPaymentThreshold =
          "Threshold must be between ₹1,000 and ₹1,00,000";
      }

      if (formData.financialSettings.paymentMethods.length === 0) {
        newErrors.paymentMethods =
          "At least one payment method must be selected";
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

    if (!validateStep(4)) {
      toast.error("Please fill in all required fields correctly");
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
            className={`${inputClasses} ${errors.name ? "border-red-300" : ""}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department Code
          </label>
          <input
            type="text"
            name="code"
            required
            placeholder="e.g., FIN001"
            value={formData.departmentDetails.code}
            onChange={(e) => handleChange(e, "departmentDetails")}
            className={`${inputClasses} ${errors.code ? "border-red-300" : ""}`}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter 2-10 characters (uppercase letters and numbers only)
          </p>
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
          )}
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
            value={formData.departmentDetails.address.city}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
            className={`${inputClasses} ${errors.city ? "border-red-300" : ""}`}
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
            value={formData.departmentDetails.address.state}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
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
            value={formData.departmentDetails.address.pincode}
            onChange={(e) => handleChange(e, "departmentDetails", "address")}
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
            value={formData.departmentDetails.contactPerson.designation}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
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
            value={formData.departmentDetails.contactPerson.phone}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
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
            value={formData.departmentDetails.contactPerson.email}
            onChange={(e) =>
              handleChange(e, "departmentDetails", "contactPerson")
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

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Financial Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Payment Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="maxPaymentAmount"
              required
              min="1000"
              max="1000000"
              step="1000"
              value={formData.financialSettings.maxPaymentAmount}
              onChange={(e) => handleChange(e, "financialSettings")}
              className={`${inputClasses} pl-7 ${
                errors.maxPaymentAmount ? "border-red-300" : ""
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">.00</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Maximum amount that can be paid in a single transaction
          </p>
          {errors.maxPaymentAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxPaymentAmount}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Auto Payment Threshold
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="autoPaymentThreshold"
              required
              min="1000"
              max="100000"
              step="1000"
              value={formData.financialSettings.autoPaymentThreshold}
              onChange={(e) => handleChange(e, "financialSettings")}
              className={`${inputClasses} pl-7 ${
                errors.autoPaymentThreshold ? "border-red-300" : ""
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">.00</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Amount below which payments can be automatically approved
          </p>
          {errors.autoPaymentThreshold && (
            <p className="mt-1 text-sm text-red-600">
              {errors.autoPaymentThreshold}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Payment Methods</h4>
        <div className="space-y-2">
          {["bank_transfer", "cheque", "demand_draft"].map((method) => (
            <div key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.financialSettings.paymentMethods.includes(
                  method
                )}
                onChange={() => handlePaymentMethodChange(method)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
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
        <h4 className="text-lg font-medium text-gray-900">Payment Schedule</h4>
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
              className={`${selectClasses} ${
                errors.frequency ? "border-red-300" : ""
              }`}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semester">Semester</option>
            </select>
            {errors.frequency && (
              <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
            )}
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
              className={`${inputClasses} ${
                errors.dayOfMonth ? "border-red-300" : ""
              }`}
            />
            {errors.dayOfMonth && (
              <p className="mt-1 text-sm text-red-600">{errors.dayOfMonth}</p>
            )}
          </div>
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
              onChange={handlePasswordChange}
              className={`${inputClasses} pr-10 ${
                errors.password ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
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
              onChange={handlePasswordChange}
              className={`${inputClasses} pr-10 ${
                errors.confirmPassword ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
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
          Step {currentStep} of 4
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-emerald-600 text-white ring-4 ring-emerald-100`}
        >
          {currentStep}
        </div>
        <div className="text-sm font-medium text-emerald-600">
          {currentStep === 1 && "Department Details"}
          {currentStep === 2 && "Address"}
          {currentStep === 3 && "Contact Person"}
          {currentStep === 4 && "Settings"}
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
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-emerald-700/40" />
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
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-3xl space-y-8 py-16 sm:py-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Finance Department Registration
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
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
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-emerald-600"
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
