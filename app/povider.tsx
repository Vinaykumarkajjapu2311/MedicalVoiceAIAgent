"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  const [hasCreatedUser, setHasCreatedUser] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !hasCreatedUser) {
      createNewUser();
    }
  }, [user, isLoaded, hasCreatedUser]);

  const createNewUser = async () => {
    try {
      setHasCreatedUser(true); // Prevent multiple calls
      const result = await axios.post("/api/users");
      console.log(result.data);
      setUserDetail(result.data);
    } catch (error) {
      console.error("Error creating user:", error);
      setHasCreatedUser(false); // Reset on error
    }
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
