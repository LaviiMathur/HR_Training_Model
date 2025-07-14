import { useEffect } from "react";
import { Logo, NavBar } from "../components/index.components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user.loggedIn) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  return (
    <div className="  h-dvh w-8/10  grid m-auto">
      <Logo h={150} className="m-auto w-full" />

      <h2 className="text-4xl text-left capitalize font-[300]">
        Welcome Back, <span className="font-[600]">{user.user}</span>{" "}
        {user.role}
      </h2>

      <NavBar />
    </div>
  );
}
