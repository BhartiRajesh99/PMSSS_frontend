import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import backgroundImage from "../assets/iewek-gnos-hhUx08PuYpc-unsplash.jpg";
import BackButton from "../components/BackButton";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
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
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const selectClasses =
    "block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm";

  const getYearOptions = (course) => {
    // Engineering Courses
    if (
      ["b.tech", "b.e.", "b.arch", "b.plan"].includes(course?.toLowerCase())
    ) {
      return [1, 2, 3, 4];
    }
    if (
      ["m.tech", "m.e.", "m.arch", "m.plan"].includes(course?.toLowerCase())
    ) {
      return [1, 2];
    }

    // Medical Courses
    if (
      ["mbbs", "bds", "bams", "bhms", "bums"].includes(course?.toLowerCase())
    ) {
      return [1, 2, 3, 4, 5];
    }
    if (["md", "ms", "mds", "dm", "mch"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }

    // Pharmacy Courses
    if (["b.pharm", "d.pharm"].includes(course?.toLowerCase())) {
      return [1, 2, 3, 4];
    }
    if (["m.pharm", "pharm.d"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Management Courses
    if (["mba", "pgdm", "mhm", "mfm"].includes(course?.toLowerCase())) {
      return [1, 2];
    }
    if (["bba", "bhm", "bfm"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }

    // Computer Applications
    if (["bca", "bsc it", "bsc cs"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }
    if (["mca", "msc it", "msc cs"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Science Courses
    if (["bsc", "bsc (hons)"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }
    if (["msc", "msc (hons)"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Commerce Courses
    if (["b.com", "b.com (hons)"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }
    if (["m.com", "m.com (hons)"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Arts Courses
    if (["ba", "ba (hons)"].includes(course?.toLowerCase())) {
      return [1, 2, 3];
    }
    if (["ma", "ma (hons)"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Law Courses
    if (
      ["llb", "ba llb", "b.com llb", "bba llb"].includes(course?.toLowerCase())
    ) {
      return [1, 2, 3, 4, 5];
    }
    if (["llm"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Education Courses
    if (["bed", "d.el.ed"].includes(course?.toLowerCase())) {
      return [1, 2];
    }
    if (["med"].includes(course?.toLowerCase())) {
      return [1, 2];
    }

    // Research Courses
    if (["phd", "m.phil"].includes(course?.toLowerCase())) {
      return [1, 2, 3, 4, 5, 6];
    }

    // Default case
    return [1, 2, 3, 4];
  };

  const getAdmissionYearOptions = (currentYear, course) => {
    const currentDate = new Date();
    const currentYearNum = currentDate.getFullYear();
    const courseDuration = getYearOptions(course).length;

    // Calculate the range of possible admission years
    const maxYear = currentYearNum;
    const minYear = currentYearNum - courseDuration;

    // Generate array of years from min to max
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }

    return years;
  };

  const getSemesterOptions = (currentYear, course) => {
    const courseDuration = getYearOptions(course).length;
    const semestersPerYear = 2; // Most courses have 2 semesters per year
    const totalSemesters = courseDuration * semestersPerYear;

    // Calculate the valid semesters based on current year
    const validSemesters = [];
    const startSemester = (currentYear - 1) * semestersPerYear + 1;
    const endSemester = Math.min(
      currentYear * semestersPerYear,
      totalSemesters
    );

    for (let i = startSemester; i <= endSemester; i++) {
      validSemesters.push(i);
    }

    return validSemesters;
  };

  const getBranchOptions = (course) => {
    const courseLower = course?.toLowerCase() || "";

    // Engineering Branches
    if (["b.tech", "b.e.", "m.tech", "m.e."].includes(courseLower)) {
      return [
        "Computer Science Engineering",
        "Information Technology",
        "Electronics & Communication",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Biotechnology",
        "Artificial Intelligence",
        "Data Science",
        "Robotics",
        "Automation",
        "Instrumentation",
        "Production Engineering",
      ];
    }

    // Medical Branches
    if (["mbbs", "md", "ms"].includes(courseLower)) {
      return [
        "General Medicine",
        "Surgery",
        "Pediatrics",
        "Obstetrics & Gynecology",
        "Orthopedics",
        "Dermatology",
        "Ophthalmology",
        "ENT",
        "Psychiatry",
        "Radiology",
        "Anesthesiology",
        "Pathology",
      ];
    }

    // Pharmacy Branches
    if (["b.pharm", "m.pharm", "pharm.d"].includes(courseLower)) {
      return [
        "Pharmaceutics",
        "Pharmacology",
        "Pharmaceutical Chemistry",
        "Pharmacognosy",
        "Pharmacy Practice",
        "Industrial Pharmacy",
        "Quality Assurance",
      ];
    }

    // Management Branches
    if (["mba", "pgdm", "bba"].includes(courseLower)) {
      return [
        "Finance",
        "Marketing",
        "Human Resource",
        "Operations",
        "Information Technology",
        "International Business",
        "Business Analytics",
        "Entrepreneurship",
        "Supply Chain Management",
        "Healthcare Management",
      ];
    }

    // Computer Applications
    if (
      ["bca", "mca", "bsc it", "msc it", "bsc cs", "msc cs"].includes(
        courseLower
      )
    ) {
      return [
        "Software Development",
        "Web Development",
        "Mobile Application Development",
        "Cloud Computing",
        "Cyber Security",
        "Data Science",
        "Artificial Intelligence",
        "Machine Learning",
        "Database Management",
        "Networking",
      ];
    }

    // Science Branches
    if (["bsc", "msc", "bsc (hons)", "msc (hons)"].includes(courseLower)) {
      return [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Computer Science",
        "Electronics",
        "Statistics",
        "Environmental Science",
        "Biotechnology",
        "Microbiology",
      ];
    }

    // Commerce Branches
    if (
      ["b.com", "m.com", "b.com (hons)", "m.com (hons)"].includes(courseLower)
    ) {
      return [
        "Accounting",
        "Finance",
        "Taxation",
        "Banking",
        "Insurance",
        "Business Administration",
        "E-Commerce",
        "Financial Markets",
      ];
    }

    // Arts Branches
    if (["ba", "ma", "ba (hons)", "ma (hons)"].includes(courseLower)) {
      return [
        "English",
        "History",
        "Political Science",
        "Economics",
        "Sociology",
        "Psychology",
        "Geography",
        "Philosophy",
        "Journalism",
        "Mass Communication",
      ];
    }

    // Law Branches
    if (
      ["llb", "llm", "ba llb", "b.com llb", "bba llb"].includes(courseLower)
    ) {
      return [
        "Corporate Law",
        "Criminal Law",
        "Civil Law",
        "Constitutional Law",
        "International Law",
        "Tax Law",
        "Intellectual Property Law",
        "Environmental Law",
        "Cyber Law",
        "Human Rights Law",
      ];
    }

    // PhD Branches
    if (["phd"].includes(courseLower)) {
      return [
        // Engineering & Technology
        "Computer Science & Engineering",
        "Information Technology",
        "Electronics & Communication",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Biotechnology",
        "Artificial Intelligence",
        "Data Science",
        "Robotics",
        "Automation",
        "Instrumentation",
        "Production Engineering",
        "Material Science",
        "Nanotechnology",
        "Renewable Energy",
        "Environmental Engineering",
        "Structural Engineering",
        "Transportation Engineering",
        "Power Systems",
        "Control Systems",
        "VLSI Design",
        "Wireless Communication",

        // Medical Sciences
        "Medical Biotechnology",
        "Molecular Medicine",
        "Clinical Research",
        "Public Health",
        "Epidemiology",
        "Pharmacology",
        "Toxicology",
        "Medical Microbiology",
        "Immunology",
        "Genetics",
        "Neuroscience",
        "Cancer Biology",
        "Stem Cell Research",
        "Regenerative Medicine",

        // Basic Sciences
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Statistics",
        "Environmental Science",
        "Geology",
        "Astronomy",
        "Meteorology",
        "Oceanography",
        "Biochemistry",
        "Microbiology",
        "Botany",
        "Zoology",

        // Management & Commerce
        "Business Administration",
        "Finance",
        "Marketing",
        "Human Resource Management",
        "Operations Management",
        "Strategic Management",
        "International Business",
        "Economics",
        "Accounting",
        "Banking",
        "Insurance",

        // Social Sciences
        "Psychology",
        "Sociology",
        "Political Science",
        "Economics",
        "History",
        "Geography",
        "Anthropology",
        "Social Work",
        "Public Administration",
        "International Relations",

        // Humanities
        "English Literature",
        "Philosophy",
        "Linguistics",
        "Education",
        "Journalism",
        "Mass Communication",
        "Fine Arts",
        "Music",
        "Theatre",
        "Cultural Studies",

        // Agriculture & Allied Sciences
        "Agricultural Sciences",
        "Horticulture",
        "Forestry",
        "Veterinary Science",
        "Food Technology",
        "Dairy Technology",
        "Fisheries",
        "Agricultural Economics",
        "Soil Science",
        "Plant Pathology",

        // Architecture & Planning
        "Architecture",
        "Urban Planning",
        "Landscape Architecture",
        "Housing",
        "Transportation Planning",
        "Environmental Planning",
        "Regional Planning",

        // Pharmacy
        "Pharmaceutics",
        "Pharmacology",
        "Pharmaceutical Chemistry",
        "Pharmacognosy",
        "Pharmacy Practice",
        "Industrial Pharmacy",
        "Quality Assurance",

        // Law
        "Constitutional Law",
        "Criminal Law",
        "Corporate Law",
        "International Law",
        "Environmental Law",
        "Intellectual Property Law",
        "Human Rights Law",
        "Tax Law",
        "Cyber Law",
        "Family Law",
      ];
    }

    // M.Phil Branches
    if (["m.phil"].includes(courseLower)) {
      return [
        // Social Sciences
        "Psychology",
        "Sociology",
        "Political Science",
        "Economics",
        "History",
        "Geography",
        "Anthropology",
        "Social Work",
        "Public Administration",
        "International Relations",
        "Development Studies",
        "Gender Studies",
        "Population Studies",
        "Urban Studies",
        "Rural Development",

        // Humanities
        "English Literature",
        "Philosophy",
        "Linguistics",
        "Education",
        "Journalism",
        "Mass Communication",
        "Fine Arts",
        "Music",
        "Theatre",
        "Cultural Studies",
        "Comparative Literature",
        "Translation Studies",
        "Folklore Studies",
        "Archaeology",
        "Museology",

        // Management & Commerce
        "Business Administration",
        "Finance",
        "Marketing",
        "Human Resource Management",
        "Operations Management",
        "Strategic Management",
        "International Business",
        "Economics",
        "Accounting",
        "Banking",
        "Insurance",
        "Business Ethics",
        "Corporate Governance",
        "Entrepreneurship",
        "Supply Chain Management",

        // Basic Sciences
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Statistics",
        "Environmental Science",
        "Geology",
        "Astronomy",
        "Meteorology",
        "Oceanography",
        "Biochemistry",
        "Microbiology",
        "Botany",
        "Zoology",
        "Biotechnology",

        // Medical Sciences
        "Medical Biotechnology",
        "Molecular Medicine",
        "Clinical Research",
        "Public Health",
        "Epidemiology",
        "Pharmacology",
        "Toxicology",
        "Medical Microbiology",
        "Immunology",
        "Genetics",
        "Neuroscience",
        "Cancer Biology",
        "Stem Cell Research",
        "Regenerative Medicine",
        "Medical Ethics",

        // Computer Applications
        "Computer Science",
        "Information Technology",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Machine Learning",
        "Cyber Security",
        "Cloud Computing",
        "Database Management",
        "Computer Networks",
        "Human-Computer Interaction",
        "Computer Vision",
        "Natural Language Processing",
        "Robotics",
        "Internet of Things",

        // Law
        "Constitutional Law",
        "Criminal Law",
        "Corporate Law",
        "International Law",
        "Environmental Law",
        "Intellectual Property Law",
        "Human Rights Law",
        "Tax Law",
        "Cyber Law",
        "Family Law",
        "Labour Law",
        "Administrative Law",
        "Banking Law",
        "Competition Law",
        "Media Law",

        // Education
        "Educational Psychology",
        "Educational Technology",
        "Curriculum Development",
        "Educational Administration",
        "Special Education",
        "Early Childhood Education",
        "Higher Education",
        "Teacher Education",
        "Educational Planning",
        "Educational Measurement",
        "Educational Policy",
        "Educational Leadership",
        "Educational Sociology",
        "Educational Philosophy",
        "Educational Research",

        // Library & Information Science
        "Library Science",
        "Information Science",
        "Digital Libraries",
        "Knowledge Management",
        "Information Systems",
        "Archival Science",
        "Documentation",
        "Information Retrieval",
        "Information Architecture",
        "Metadata Management",
      ];
    }

    // Default case - return empty array
    return [];
  };

  const handleChange = (e, section, subsection = null) => {
    const { name, value } = e.target;

    // Clear error for the field being changed
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (subsection) {
        delete newErrors[name];
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

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

  // Add this new function to handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    // Clear password-related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.password;
      delete newErrors.confirmPassword;
      return newErrors;
    });

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Details Validation
      if (!formData.personalDetails.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.personalDetails.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.personalDetails.dob) {
        newErrors.dob = "Date of birth is required";
      }
      if (!formData.personalDetails.gender) {
        newErrors.gender = "Gender is required";
      }
      if (!formData.personalDetails.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalDetails.email)
      ) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.personalDetails.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.personalDetails.phone)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
      if (!formData.personalDetails.aadharNumber?.trim()) {
        newErrors.aadharNumber = "Aadhar number is required";
      } else if (!/^\d{12}$/.test(formData.personalDetails.aadharNumber)) {
        newErrors.aadharNumber = "Aadhar number must be 12 digits";
      }
      if (!formData.personalDetails.address.street?.trim()) {
        newErrors.street = "Street address is required";
      }
      if (!formData.personalDetails.address.city?.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.personalDetails.address.state?.trim()) {
        newErrors.state = "State is required";
      }
      if (!formData.personalDetails.address.pincode?.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(formData.personalDetails.address.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
      if (!formData.personalDetails.category) {
        newErrors.category = "Category is required";
      }
      if (!formData.personalDetails.domicile?.trim()) {
        newErrors.domicile = "Domicile is required";
      }
    }

    if (step === 2) {
      // Academic Details Validation
      if (!formData.academicDetails.currentCourse?.trim()) {
        newErrors.currentCourse = "Current course is required";
      }
      if (!formData.academicDetails.currentYear) {
        newErrors.currentYear = "Current year is required";
      }
      if (!formData.academicDetails.college.name?.trim()) {
        newErrors.collegeName = "College name is required";
      }
      if (!formData.academicDetails.college.code?.trim()) {
        newErrors.collegeCode = "College code is required";
      }
      if (!formData.academicDetails.rollNumber?.trim()) {
        newErrors.rollNumber = "Roll number is required";
      }
      if (!formData.academicDetails.branch?.trim()) {
        newErrors.branch = "Branch is required";
      }
      if (!formData.academicDetails.semester) {
        newErrors.semester = "Semester is required";
      }
      if (!formData.academicDetails.admissionYear) {
        newErrors.admissionYear = "Admission year is required";
      }

      // Previous marks validation
      if (formData.academicDetails.previousMarks) {
        const marks = parseFloat(formData.academicDetails.previousMarks);
        if (isNaN(marks) || marks < 0 || marks > 100) {
          newErrors.previousMarks = "Marks must be between 0 and 100";
        }
      }
    }

    if (step === 3) {
      // Bank Details Validation
      if (!formData.bankDetails.accountHolderName?.trim()) {
        newErrors.accountHolderName = "Account holder name is required";
      }
      if (!formData.bankDetails.accountNumber?.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!/^\d{9,18}$/.test(formData.bankDetails.accountNumber)) {
        newErrors.accountNumber =
          "Account number must be between 9 and 18 digits";
      }
      if (!formData.bankDetails.ifscCode?.trim()) {
        newErrors.ifscCode = "IFSC code is required";
      } else if (
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)
      ) {
        newErrors.ifscCode = "Invalid IFSC code format";
      }
      if (!formData.bankDetails.bankName?.trim()) {
        newErrors.bankName = "Bank name is required";
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
            className={`${inputClasses} ${
              errors.firstName ? "border-red-300" : ""
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
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
            className={`${inputClasses} ${
              errors.lastName ? "border-red-300" : ""
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
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
            className={`${inputClasses} ${errors.dob ? "border-red-300" : ""}`}
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
          )}
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
            className={`${selectClasses} ${
              errors.gender ? "border-red-300" : ""
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
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
          className={`${inputClasses} ${
            errors.aadharNumber ? "border-red-300" : ""
          }`}
        />
        {errors.aadharNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
        )}
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
            className={`${inputClasses} ${
              errors.email ? "border-red-300" : ""
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
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
            className={`${inputClasses} ${
              errors.phone ? "border-red-300" : ""
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
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
              value={formData.personalDetails.address.city}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
              value={formData.personalDetails.address.state}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
              value={formData.personalDetails.address.pincode}
              onChange={(e) => handleChange(e, "personalDetails", "address")}
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
            className={`${selectClasses} ${
              errors.category ? "border-red-300" : ""
            }`}
          >
            <option value="">Select Category</option>
            <option value="GEN">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
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
            className={`${inputClasses} ${
              errors.domicile ? "border-red-300" : ""
            }`}
          />
          {errors.domicile && (
            <p className="mt-1 text-sm text-red-600">{errors.domicile}</p>
          )}
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
          <select
            name="currentCourse"
            required
            value={formData.academicDetails.currentCourse}
            onChange={(e) => {
              handleChange(e, "academicDetails");
              // Reset year when course changes
              setFormData((prev) => ({
                ...prev,
                academicDetails: {
                  ...prev.academicDetails,
                  currentYear: "",
                },
              }));
            }}
            className={`${selectClasses} ${
              errors.currentCourse ? "border-red-300" : ""
            }`}
          >
            <option value="">Select Course</option>

            {/* Engineering Courses */}
            <optgroup label="Engineering">
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.E.">B.E.</option>
              <option value="M.E.">M.E.</option>
              <option value="B.Arch">B.Arch</option>
              <option value="M.Arch">M.Arch</option>
              <option value="B.Plan">B.Plan</option>
              <option value="M.Plan">M.Plan</option>
            </optgroup>

            {/* Medical Courses */}
            <optgroup label="Medical">
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="BUMS">BUMS</option>
              <option value="MD">MD</option>
              <option value="MS">MS</option>
              <option value="MDS">MDS</option>
              <option value="DM">DM</option>
              <option value="MCH">MCH</option>
            </optgroup>

            {/* Pharmacy Courses */}
            <optgroup label="Pharmacy">
              <option value="B.Pharm">B.Pharm</option>
              <option value="M.Pharm">M.Pharm</option>
              <option value="D.Pharm">D.Pharm</option>
              <option value="Pharm.D">Pharm.D</option>
            </optgroup>

            {/* Management Courses */}
            <optgroup label="Management">
              <option value="MBA">MBA</option>
              <option value="PGDM">PGDM</option>
              <option value="BBA">BBA</option>
              <option value="MHM">MHM</option>
              <option value="BHM">BHM</option>
              <option value="MFM">MFM</option>
              <option value="BFM">BFM</option>
            </optgroup>

            {/* Computer Applications */}
            <optgroup label="Computer Applications">
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BSc IT">BSc IT</option>
              <option value="MSc IT">MSc IT</option>
              <option value="BSc CS">BSc CS</option>
              <option value="MSc CS">MSc CS</option>
            </optgroup>

            {/* Science Courses */}
            <optgroup label="Science">
              <option value="BSc">BSc</option>
              <option value="BSc (Hons)">BSc (Hons)</option>
              <option value="MSc">MSc</option>
              <option value="MSc (Hons)">MSc (Hons)</option>
            </optgroup>

            {/* Commerce Courses */}
            <optgroup label="Commerce">
              <option value="B.Com">B.Com</option>
              <option value="B.Com (Hons)">B.Com (Hons)</option>
              <option value="M.Com">M.Com</option>
              <option value="M.Com (Hons)">M.Com (Hons)</option>
            </optgroup>

            {/* Arts Courses */}
            <optgroup label="Arts">
              <option value="BA">BA</option>
              <option value="BA (Hons)">BA (Hons)</option>
              <option value="MA">MA</option>
              <option value="MA (Hons)">MA (Hons)</option>
            </optgroup>

            {/* Law Courses */}
            <optgroup label="Law">
              <option value="LLB">LLB</option>
              <option value="BA LLB">BA LLB</option>
              <option value="B.Com LLB">B.Com LLB</option>
              <option value="BBA LLB">BBA LLB</option>
              <option value="LLM">LLM</option>
            </optgroup>

            {/* Education Courses */}
            <optgroup label="Education">
              <option value="B.Ed">B.Ed</option>
              <option value="M.Ed">M.Ed</option>
              <option value="D.El.Ed">D.El.Ed</option>
            </optgroup>

            {/* Research Courses */}
            <optgroup label="Research">
              <option value="PhD">PhD</option>
              <option value="M.Phil">M.Phil</option>
            </optgroup>
          </select>
          {errors.currentCourse && (
            <p className="mt-1 text-sm text-red-600">{errors.currentCourse}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Year
          </label>
          <select
            name="currentYear"
            required
            value={formData.academicDetails.currentYear}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={`${selectClasses} ${
              errors.currentYear ? "border-red-300" : ""
            }`}
            disabled={!formData.academicDetails.currentCourse}
          >
            <option value="">Select Year</option>
            {getYearOptions(formData.academicDetails.currentCourse).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
          {errors.currentYear && (
            <p className="mt-1 text-sm text-red-600">{errors.currentYear}</p>
          )}
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
            placeholder="e.g., 12th Standard, Diploma"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Previous Marks (%)
          </label>
          <div className="relative">
            <input
              type="number"
              name="previousMarks"
              value={formData.academicDetails.previousMarks}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (value >= 0 && value <= 100)) {
                  handleChange(e, "academicDetails");
                }
              }}
              className={`${inputClasses} ${
                errors.previousMarks ? "border-red-300" : ""
              }`}
              min="0"
              max="100"
              step="1"
              placeholder="Enter percentage"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          {errors.previousMarks && (
            <p className="mt-1 text-sm text-red-600">{errors.previousMarks}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter your percentage marks (0-100)
          </p>
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
          <select
            name="admissionYear"
            required
            value={formData.academicDetails.admissionYear}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={`${selectClasses} ${
              errors.admissionYear ? "border-red-300" : ""
            }`}
            disabled={
              !formData.academicDetails.currentCourse ||
              !formData.academicDetails.currentYear
            }
          >
            <option value="">Select Year</option>
            {getAdmissionYearOptions(
              formData.academicDetails.currentYear,
              formData.academicDetails.currentCourse
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.admissionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.admissionYear}</p>
          )}
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
              className={`${inputClasses} ${
                errors.collegeName ? "border-red-300" : ""
              }`}
            />
            {errors.collegeName && (
              <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
            )}
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
              className={`${inputClasses} ${
                errors.collegeCode ? "border-red-300" : ""
              }`}
            />
            {errors.collegeCode && (
              <p className="mt-1 text-sm text-red-600">{errors.collegeCode}</p>
            )}
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
            className={`${inputClasses} ${
              errors.rollNumber ? "border-red-300" : ""
            }`}
          />
          {errors.rollNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            name="branch"
            required
            value={formData.academicDetails.branch}
            onChange={(e) => handleChange(e, "academicDetails")}
            className={`${selectClasses} ${
              errors.branch ? "border-red-300" : ""
            }`}
            disabled={!formData.academicDetails.currentCourse}
          >
            <option value="">Select Branch</option>
            {getBranchOptions(formData.academicDetails.currentCourse).map(
              (branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              )
            )}
          </select>
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Semester
        </label>
        <select
          name="semester"
          required
          value={formData.academicDetails.semester}
          onChange={(e) => handleChange(e, "academicDetails")}
          className={`${selectClasses} ${
            errors.semester ? "border-red-300" : ""
          }`}
          disabled={
            !formData.academicDetails.currentCourse ||
            !formData.academicDetails.currentYear
          }
        >
          <option value="">Select Semester</option>
          {getSemesterOptions(
            parseInt(formData.academicDetails.currentYear),
            formData.academicDetails.currentCourse
          ).map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
        {errors.semester && (
          <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Select your current semester based on your year of study
        </p>
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
          className={`${inputClasses} ${
            errors.accountHolderName ? "border-red-300" : ""
          }`}
        />
        {errors.accountHolderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.accountHolderName}
          </p>
        )}
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
          className={`${inputClasses} ${
            errors.accountNumber ? "border-red-300" : ""
          }`}
        />
        {errors.accountNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
        )}
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
            className={`${inputClasses} ${
              errors.ifscCode ? "border-red-300" : ""
            }`}
          />
          {errors.ifscCode && (
            <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
          )}
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
            className={`${inputClasses} ${
              errors.bankName ? "border-red-300" : ""
            }`}
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
          )}
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handlePasswordChange}
              className={`${inputClasses} ${
                errors.password ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-indigo-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
              className={`${inputClasses} ${
                errors.confirmPassword ? "border-red-300" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-indigo-600"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
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
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-indigo-600 text-white ring-4 ring-indigo-100`}
        >
          {currentStep}
        </div>
        <div className="text-sm font-medium text-indigo-600">
          {currentStep === 1 && "Personal Details"}
          {currentStep === 2 && "Academic Details"}
          {currentStep === 3 && "Bank Details"}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-indigo-800/30 to-blue-700/40" />
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Join PMSSS Portal</h1>
            <p className="text-lg text-gray-200">
              Create your account to access scholarship opportunities and manage
              your educational journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-3xl space-y-8 py-16 sm:py-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Student Registration
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

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-indigo-600"
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
