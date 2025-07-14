import React from "react";

function InternList() {
  const fetchIntern = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = (await axios.get(`${API_URL}/mentor/fetchIntern`)).data;

      setMentors(response.data);
    } catch (error) {
      console.error("❌ InternFetch error:", error.message);
    }
  };
  return <div>internList</div>;
}

export default InternList;
