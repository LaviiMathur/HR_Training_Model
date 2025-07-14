import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MentorList,
  InternList,
  ProjectForm,
  InternForm,
  Profile,
  AssignMentors,
  Notification
} from "../index.components";

function NavBar() {
  const user = useSelector((state) => state.auth);
  const [navItems, setNavItems] = useState([]);
  const [renderComponent, setRenderComponent] = useState(<MentorList />);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    const hrNav = [
      { label: "Mentor list", icon: "article_person" },
      { label: "New Intern", icon: "person_add" },
      { label: "Profile", icon: "account_circle" },
      { label: "Assign Mentor", icon: "account_circle" },
      { label: "notification", icon: "notifications" },
    ];

    const mentorNav = [
      { label: "Intern list", icon: "group" },
      { label: "Project List", icon: "list_alt" },
      { label: "Profile", icon: "account_circle" },
      { label: "notification", icon: "notifications" },
    ];

    if (user.role === "hr" && navItems !== hrNav) {
      setNavItems(hrNav);
    }
    if (user.role === "mentor" && navItems !== mentorNav) {
      setNavItems(mentorNav);
    }
  }, [user]);
  const handleClick = (i) => {
    setSelectedIndex(i);
    if (user.role === "hr") {
      if (i == 0) setRenderComponent(<MentorList />);
      if (i == 1) setRenderComponent(<InternForm />);
      if (i == 2) setRenderComponent(<Profile />);
      if (i == 3) setRenderComponent(<AssignMentors />);
      if (i == 4) setRenderComponent(<Notification />);
    }
    if (user.role === "mentor") {
      if (i == 0) setRenderComponent(<InternList />);
      if (i == 1) setRenderComponent(<MentorList />);
      if (i == 2) setRenderComponent(<Profile />);
      if (i == 3) setRenderComponent(<Notification />);
    }
  };
  return (
    <div className="bg-amber-50 w-3/4 h-[500px]   flex flex-col">
      <div className="flex justify-center  items-center">
        {navItems.map((item, i) => {
          const isFirst = i === 0;
          const isLast = i === navItems.length - 1;
          const isSelected = selectedIndex === i;

          return (
            <span
              key={i}
              tabIndex={0}
              role="button"
              onClick={() => handleClick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedIndex(i);
              }}
              className={`
        cursor-pointer
        bg-blue-200
        p-2
        border-blue-400 border-0
        ${isFirst ? "rounded-tl-md" : ""}
        ${isLast ? "rounded-tr-md" : ""}
        ${
          isSelected
            ? "bg-blue-500 text-white scale-110 z-10"
            : "hover:bg-blue-300"
        }
      `}
              style={{
                borderLeftWidth: isFirst ? "1px" : "0",
                borderRightWidth: isLast ? "1px" : "0",
              }}
            >
              <>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </>
            </span>
          );
        })}
      </div>
      <div className="bg-blue-500 h-full w-full">{renderComponent}</div>
    </div>
  );
}

export default NavBar;
