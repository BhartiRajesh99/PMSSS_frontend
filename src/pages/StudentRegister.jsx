import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      aadharNumber: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      category: "",
      domicile: "",
    },
    academicDetails: {
      currentCourse: "",
      currentYear: "",
      previousCourse: "",
      previousMarks: "",
      boardOrUniversity: "",
      admissionYear: "",
      college: {
        name: "",
        code: "",
        address: "",
      },
      rollNumber: "",
      branch: "",
      semester: "",
    },
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    },
    password: "",
    confirmPassword: "",
  });

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-2";

  const handleChange = (e, section, subsection = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [name]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Format the data according to the backend's expected structure
      const formattedData = {
        name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
        email: formData.personalDetails.email,
        password: formData.password,
        registrationNumber: formData.academicDetails.rollNumber,
        course: formData.academicDetails.currentCourse,
        institution: formData.academicDetails.college.name,
        yearOfStudy: parseInt(formData.academicDetails.currentYear, 10),
        personalDetails: {
          firstName: formData.personalDetails.firstName,
          lastName: formData.personalDetails.lastName,
          dob: formData.personalDetails.dob,
          gender: formData.personalDetails.gender,
          aadharNumber: formData.personalDetails.aadharNumber,
          phone: formData.personalDetails.phone,
          address: formData.personalDetails.address,
          category: formData.personalDetails.category,
          domicile: formData.personalDetails.domicile,
        },
        academicDetails: {
          currentCourse: formData.academicDetails.currentCourse,
          currentYear: parseInt(formData.academicDetails.currentYear, 10),
          previousCourse: formData.academicDetails.previousCourse,
          previousMarks: parseInt(formData.academicDetails.previousMarks, 10),
          boardOrUniversity: formData.academicDetails.boardOrUniversity,
          admissionYear: parseInt(formData.academicDetails.admissionYear, 10),
          college: formData.academicDetails.college,
          rollNumber: formData.academicDetails.rollNumber,
          branch: formData.academicDetails.branch,
          semester: parseInt(formData.academicDetails.semester, 10),
        },
        bankDetails: formData.bankDetails,
      };

      console.log("Sending registration data:", {
        ...formattedData,
        password: "[REDACTED]",
      });

      const response = await axios.post(
        "https://pmsss-backend.vercel.app/api/auth/register/student",
        formattedData
      );
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.personalDetails.firstName}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.personalDetails.lastName}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            required
            value={formData.personalDetails.dob}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            required
            value={formData.personalDetails.gender}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Aadhar Number
        </label>
        <input
          type="text"
          name="aadharNumber"
          required
          value={formData.personalDetails.aadharNumber}
          onChange={(e) => handleChange(e, "personalDetails")}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.personalDetails.email}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.personalDetails.phone}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
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
              value={formData.personalDetails.address.street}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
              value={formData.personalDetails.address.city}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
              value={formData.personalDetails.address.state}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
              value={formData.personalDetails.address.pincode}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            required
            value={formData.personalDetails.category}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          >
            <option value="">Select Category</option>
            <option value="GEN">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Domicile
          </label>
          <input
            type="text"
            name="domicile"
            required
            value={formData.personalDetails.domicile}
            onChange={(e) => handleChange(e, "personalDetails")}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Academic Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Course
          </label>
          <input
            type="text"
            name="currentCourse"
            required
            value={formData.academicDetails.currentCourse}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Year
          </label>
          <input
            type="number"
            name="currentYear"
            required
            value={formData.academicDetails.currentYear}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Previous Course
          </label>
          <input
            type="text"
            name="previousCourse"
            value={formData.academicDetails.previousCourse}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Previous Marks
          </label>
          <input
            type="number"
            name="previousMarks"
            value={formData.academicDetails.previousMarks}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Board/University
          </label>
          <input
            type="text"
            name="boardOrUniversity"
            value={formData.academicDetails.boardOrUniversity}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Admission Year
          </label>
          <input
            type="number"
            name="admissionYear"
            value={formData.academicDetails.admissionYear}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">College Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              College Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.academicDetails.college.name}
              onChange={(e) => handleChange(e, "academicDetails", "college")}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              College Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.academicDetails.college.code}
              onChange={(e) => handleChange(e, "academicDetails", "college")}
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            College Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.academicDetails.college.address}
            onChange={(e) => handleChange(e, "academicDetails", "college")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            type="text"
            name="rollNumber"
            value={formData.academicDetails.rollNumber}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <input
            type="text"
            name="branch"
            value={formData.academicDetails.branch}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Semester
        </label>
        <input
          type="number"
          name="semester"
          value={formData.academicDetails.semester}
          onChange={(e) => handleChange(e, "academicDetails")}
          className={inputClasses}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Holder Name
        </label>
        <input
          type="text"
          name="accountHolderName"
          required
          value={formData.bankDetails.accountHolderName}
          onChange={(e) => handleChange(e, "bankDetails")}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Number
        </label>
        <input
          type="text"
          name="accountNumber"
          required
          value={formData.bankDetails.accountNumber}
          onChange={(e) => handleChange(e, "bankDetails")}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            IFSC Code
          </label>
          <input
            type="text"
            name="ifscCode"
            required
            value={formData.bankDetails.ifscCode}
            onChange={(e) => handleChange(e, "bankDetails")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            required
            value={formData.bankDetails.bankName}
            onChange={(e) => handleChange(e, "bankDetails")}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Branch
        </label>
        <input
          type="text"
          name="branch"
          value={formData.bankDetails.branch}
          onChange={(e) => handleChange(e, "bankDetails")}
          className={inputClasses}
        />
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
            value={formData.confirmPassword}
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
            {step === 1 && "Personal Details"}
            {step === 2 && "Academic Details"}
            {step === 3 && "Bank Details"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Student Registration
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
