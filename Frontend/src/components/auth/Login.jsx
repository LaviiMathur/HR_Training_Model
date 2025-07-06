import { useForm } from "react-hook-form";
import axios from "axios";
import { Logo } from "../index.components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login } from "../../store/authSlice";

function Login() {
  const status = useSelector((state) => state.auth.loggedIn);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });
      console.log("✅ Login successful:", response.data);
      dispatch(login(response.data));
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error.message);
    }
  };
  useEffect(() => {
    if (status) {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <div className="h-full pt-2.5 w-full bg-[rgb(241,241,241)] flex flex-col justify-evenly items-center  ">
      <div className="Logo mx-auto h-[10%] w-full md:w-10/12 lg:w-9/12 place-items-center">
        <Logo h={100} />
      </div>
      <div className="bg-white border-2 h-[10%] border-gray-200 rounded-2xl w-full  md:w-10/12 lg:w-9/12   mx-auto  flex items-center justify-center">
        <p className="text-4xl font-semibold  ">HR Intern Portal</p>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-2xl w-full h-[70%] md:w-10/12 lg:w-9/12  mx-auto  flex gap-5 flex-col items-center justify-center">
        <div className="h-[10%] w-11/12 md:w-10/12 lg:w-8/12 place-items-center content-center">
          <p className="text-4xl font-semibold  ">Login </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-[80%] w-11/12 md:w-10/12 lg:w-8/12 border-2 rounded-2xl flex flex-col justify-evenly items-center   border-[#9CC7FF] bg-[#f1f1f1]"
        >
          <fieldset className="flex flex-col w-11/12 md:w-8/12 gap-2.5 justify-between md:gap-5">
            <div className="role_legend">
              <legend className="text-3xl">Select Role...</legend>
            </div>
            <div className="radio_buttons h-full flex flex-col md:flex-row md:justify-around md:items-center  gap-2.5 md:gap-0 ">
              <div className="hr_option flex md:flex-col items-center gap-2.5">
                <input
                  type="radio"
                  id="hr"
                  value="hr"
                  {...register("role", { required: true })}
                  className=" w-6 h-6  accent-[#6898ff] cursor-pointer "
                />
                <label
                  htmlFor="hr"
                  className="text-gray-800 font-serif text-xl md:text-5xl"
                >
                  HR
                </label>
              </div>
              <div className="mentor_option flex md:flex-col items-center  gap-2.5 ">
                <input
                  type="radio"
                  id="mentor"
                  value="mentor"
                  {...register("role", { required: true })}
                  className="w-6 h-6  accent-[#6898ff]  cursor-pointer"
                />
                <label
                  htmlFor="mentor"
                  className="text-gray-800 text-xl  font-serif md:text-5xl"
                >
                  Mentor
                </label>
              </div>
            </div>
          </fieldset>

          <div className="username_field w-11/12 md:w-8/12 border-2 border-gray-200 h-[100px] rounded-2xl  flex flex-col py-2 px-5 gap-1.5  bg-white">
            <label htmlFor="username" className="text-xl">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: true })}
              placeholder="Enter your username"
              className=" bg-white rounded-md p-2 border-2 border-[#9CC7FF] outline-blue-600 "
            />
          </div>
          <div className="password_field w-11/12  md:w-8/12 border-2 border-gray-200 h-[100px] rounded-2xl  flex flex-col py-2  px-5  gap-1.5  bg-white">
            <label htmlFor="password" className="text-xl">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
              className=" bg-white rounded-md p-2 border-2 border-[#9CC7FF] outline-blue-600"
            />
          </div>
          <button
            className="submit text-white font-bold font-serif  tracking-wider text-3xl text-shadow-[0px_2px_4px_#00000060] bg-[#9CC7FF] py-4 px-10 rounded-md 
            drop-shadow-[4px_4px_4px_#00000025] active:scale-90"
          >
            Submit
          </button>
        </form>
      </div>

      <div></div>
    </div>
  );
}

export default Login;
