import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../store/authSlice";

function Signup() {
  const { register, handleSubmit } = useForm();
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/auth/signup`, data, {
        withCredentials: true,
      });
      // console.log("✅ Signup successful:", response.data);ONLY for testing
      dispatch(login(response.data));
      navigate("/");
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      if (error.response) {
        setAuthError(error.response.data.message);
      } else {
        setAuthError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            {...register("username")}
            placeholder="Enter username"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter password"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label>Role:</label>
          <div>
            <label>
              <input type="radio" value="hr" {...register("role")} required />
              HR
            </label>
            <label>
              <input
                type="radio"
                value="mentor"
                {...register("role")}
                required
              />
              Mentor
            </label>
          </div>
        </div>
        {authError && <p className="text-red-500 text-sm">{authError}</p>}
        <button type="submit" style={{ marginTop: "1rem" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
