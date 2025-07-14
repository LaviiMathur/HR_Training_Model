import { useSelector } from "react-redux";
import Logout from "./Logout";

function Profile() {
  const user = useSelector((state) => state.auth);
  
  return (
    <div className="w-full h-full bg-blue-300 flex flex-col justify-center items-center">
      <p>{user.user}</p>
      <p>{user.role}</p>
      <Logout />
    </div>
  );
}

export default Profile;
