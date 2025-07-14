import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [openedNotificationId, setOpenedNotificationId] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const userRole = useSelector((state) => state.auth.role);
  const [options, setOptions] = useState({ green: "", red: "" });
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (userRole === "hr") {
      setOptions({ green: "View", red: "Reassign" });
    }
    if (userRole === "mentor") {
      setOptions({ green: "Accept", red: "Reject" });
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/auth/fetchNotifications`, {
        userId,
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.notifications;

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const acceptIntern = async (notification) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${API_URL}/mentor/acceptIntern`, {
        mentor: userId,
        intern: notification.internId,
        noti: notification._id,
      });
      fetchNotifications();
      setOpenedNotificationId(null);
    } catch (error) {
      console.error("Error accepting intern:", error);
    }
  };
  const rejectIntern = async (notification) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
     
     
       await axios.post(`${API_URL}/mentor/rejectIntern`, {
        sender: userId,
        receiver: notification.sender,
        intern: notification.internId,
        noti: notification._id,
        remarks,
      });
      fetchNotifications();
      setOpenedNotificationId(null);
     
    } catch (error) {
      console.error("Error accepting intern:", error);
    }
  };

  return (
    <div className="border-2 border-blue-400 rounded-lg p-4 space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => {
          const formattedDate = new Date(notification.createdAt).toLocaleString(
            "en-IN",
            { dateStyle: "medium", timeStyle: "short" }
          );

          return (
            <div
              key={notification._id}
              className="p-4 bg-blue-50 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div className="text-sm text-gray-800">
                {notification.message}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setOpenedNotificationId(notification._id)}
                  className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 transition"
                >
                  {userRole === "mentor" ? "Open" : options.green}
                </button>
                {userRole === "hr" && (
                  <button className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 transition">
                    {options.red}
                  </button>
                )}
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>

              {openedNotificationId === notification._id && (
                <div className="fixed inset-0 backdrop-blur-lg bg-[#00000050] flex items-center justify-center p-4 z-50">
                  <div className="flex justify-between rounded-md bg-amber-50 items-center p-6 border border-gray-200 h-fit w-fit gap-10 flex-col">
                    <p className="text-center">{notification.message}</p>
                    {userRole === "mentor" && (
                      <input
                        type="text"
                        placeholder="Enter remarks if you want to reject"
                        name="remarks"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    )}
                    <div className="flex w-[80%] justify-evenly">
                      <button
                        onClick={() =>
                          userRole === "mentor" && acceptIntern(notification)
                        }
                        className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 transition"
                      >
                        {options.green}
                      </button>
                      <button
                        onClick={() =>
                          userRole === "mentor" && rejectIntern(notification)
                        }
                        className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 transition"
                      >
                        {options.red}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 text-sm">No notifications</div>
      )}
    </div>
  );
}

export default Notification;
