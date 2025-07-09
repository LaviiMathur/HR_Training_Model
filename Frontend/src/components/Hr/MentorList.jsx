import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function MentorList() {
  const status = useSelector((state) => state.auth.loggedIn);
  const [mentors, setMentors] = useState([]);

  const navigate = useNavigate();
  const fetchMentors = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = (await axios.get(`${API_URL}/hr/fetchMentors`)).data;
      
      setMentors(response.data);
    } catch (error) {
      console.error("❌ MentorFetch error:", error.message);
    }
  };
  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    if (!status) {
      navigate("/auth/login");
    }
  }, [status, navigate]);

  return (
    <div className="h-full pt-2.5 w-full bg-[rgb(241,241,241)] flex flex-col justify-evenly items-center  ">
      {mentors.map((mentor, i) => {
        return (
          <p className="" key={i}>
            {mentor}
          </p>
        );
      })}
    </div>
  );
}

export default MentorList;
