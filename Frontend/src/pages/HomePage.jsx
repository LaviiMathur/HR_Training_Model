import React, { useEffect } from "react";
import { Logout } from "../components/index.components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.loggedIn);

  useEffect(() => {
    if (!status) {
      navigate("/auth/login");
    }
  }, [status, navigate]);
  return (
    <div className=" bg-[#232323]  w-dvw h-dvh place-items-center grid">
      <h1 className="text-9xl text-white">Home</h1>
      <Logout />
    </div>
  );
}
