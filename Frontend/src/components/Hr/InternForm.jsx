import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function InternForm({ intern: existingIntern }) {
  const user = useSelector((state) => state.auth);
  const [internError, setInternError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn || user.role !== "hr") {
      console.log(user)
      console.warn("Access denied: HR status required. Redirecting to login.");
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    firstName: existingIntern?.firstName ?? "",
    secondName: existingIntern?.secondName ?? "",
    age: existingIntern?.age ?? "",
    address: existingIntern?.address ?? "",
    mobile: existingIntern?.mobile ?? "",
  });
  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/hr/createIntern`, data);
      console.log("✅ Intern created:", response.data);
    } catch (error) {
      console.error(
        "❌ Intern creation failed:",
        error.response?.data || error.message
      );
      if (error.response) {
        setInternError(error.response.data.message);
      } else {
        setInternError("Creation failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">
        Training Internship Registration Form
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        (Appendix 'A' to letter No.Admin./31106/Policy, RD-Security Dated: 10
        Nov, 97)
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">FORMAT 'A'</span>
          <span className="text-sm text-gray-600">No.1805/__/HR/SPL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              1. First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { required: "Firstname is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="secondName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              2. Second Name
            </label>
            <input
              type="text"
              id="secondName"
              {...register("secondName", {
                required: "secondName is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.secondName && (
              <p className="text-red-500 text-sm">
                {errors.secondName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              3. Age
            </label>
            <input
              type="number"
              id="age"
              {...register("age", { required: "Age is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.age && (
              <p className="text-red-500 text-sm">{errors.age.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              4. Phone Number
            </label>
            <input
              type="number"
              id="mobile"
              {...register("mobile", { required: "Phone Number is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              5. Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address", { required: "Address is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
        </div>
        {internError && <p className="text-red-500 text-sm">{internError}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
          >
            {/* <Plus className="w-5 h-5" /> */}
            <span>{existingIntern ? "Update Intern" : "Add Intern"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
