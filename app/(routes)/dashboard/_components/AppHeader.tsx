import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function AppHeader() {
  const menuOptions = [
    {
      id: 1,
      name: "Home",
      path: "/home",
    },
    {
      id: 2,
      name: "History",
      path: "/history",
    },
    {
      id: 3,
      name: "Pricing",
      path: "/pricing",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
    },
  ];
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md pd-10 md:pd-20 lg:pd-40">
      <Image src={"/logo.svg"} alt="Logo " width={50} height={50} />
      <div className="hidden md:flex justify-center items-center gap-12">
        {menuOptions.map((option) => (
          <h2
            key={option.id}
            className="hover:font-bold text-gray-700 cursor-pointer mx-2"
          >
            {option.name}
          </h2>
        ))}
      </div>
      <UserButton />
    </div>
  );
}

export default AppHeader;
