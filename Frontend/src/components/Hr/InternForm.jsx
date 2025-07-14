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
    lastName: existingIntern?.lastName ?? "",
    age: existingIntern?.age ?? "",
    address: existingIntern?.address ?? "",
    mobile: existingIntern?.mobile ?? "",
    email: existingIntern?.email ?? "",
    department: existingIntern?.department ?? "",
    university: existingIntern?.university ?? "",
  });
  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${API_URL}/hr/createIntern`, data);
     
    } catch (error) {
      if (error.response) {
        setInternError(error.response.data.message);
      } else {
        setInternError(error.message);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">
        Training Internship Registration Form
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              2. Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", {
                required: "lastName is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              4. Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              5. Phone number
            </label>
            <input
              type="number"
              id="mobile"
              {...register("mobile", { required: "mobile is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              6. Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address", { required: "Address is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="university"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              7. University
            </label>
            <input
              type="text"
              id="university"
              {...register("university", {
                required: "university is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md capitalize focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.university && (
              <p className="text-red-500 text-sm">
                {errors.university.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              8. Department
            </label>
            <input
              type="text"
              id="department"
              {...register("department", {
                required: "department is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none  focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.department && (
              <p className="text-red-500 text-sm">
                {errors.department.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              9. Start Date
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", {
                required: "Start Date is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none  focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>
        </div>
        {internError && (
          <p className="text-red-500 text-sm text-center">{internError}</p>
        )}
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
