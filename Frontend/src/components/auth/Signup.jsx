
import { useForm } from "react-hook-form";
import axios from "axios";

function Signup() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      console.log("✅ Signup successful:", response.data);
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
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

        <button type="submit" style={{ marginTop: "1rem" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
