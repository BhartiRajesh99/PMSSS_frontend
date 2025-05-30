import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const roles = [
  { id: "student", label: "Student" },
  { id: "sag_bureau", label: "SAG Officer" },
  { id: "finance_bureau", label: "Finance Officer" },
];

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    switch (role) {
      case "sag_bureau":
        navigate("https://pmsss-backend.vercel.app/register/sag");
        break;
      case "finance_bureau":
        navigate("https://pmsss-backend.vercel.app/register/finance");
        break;
      case "student":
        navigate("https://pmsss-backend.vercel.app/register/student");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Select Your Role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="https://pmsss-backend.vercel.app/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register as {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
