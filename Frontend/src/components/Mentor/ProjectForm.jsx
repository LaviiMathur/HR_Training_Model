import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function ProjectForm({ project: existingProject }) {
  const user = useSelector((state) => state.auth);
  const [projectError, setProjectError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn || user.role !== "mentor") {
      console.warn("Access denied: Mentor status required.");
      console.warn(user);
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    name: existingProject?.name ?? "",
    description: existingProject?.description ?? "",
  });
  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/mentor/createProject`, {
        ...data,
        mentorId: user.userId,
      });
      console.log("✅ Project created:", response.data);
      navigate("/");
    } catch (error) {
      console.error(
        "❌ Project creation failed:",
        error.response?.data || error.message
      );
      if (error.response) {
        setProjectError(error.response.data.message);
      } else {
        setProjectError("Creation failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-amber-50">
      <h2 className="text-xl font-semibold mb-6">
        Training Projects Creation Form
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid  gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              1. Project Name
            </label>
            <input
              type="text"
              id="projectName"
              {...register("name", { required: "Project name is required" })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              2. Description about the Project
            </label>
            <input
              type="text"
              id="projectDescription"
              {...register("description", {
                required: "Project Description is required",
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        {projectError && <p className="text-red-500 text-sm">{projectError}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>{existingProject ? "Update Project" : "Create Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
