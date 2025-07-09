import React from "react";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";

function Dashboard() {
  return (
    <div className="mx-10">
      <div className="flex justify-between items-center mt-4 ">
        <h2 className="font-bold text-2xl">DashBoard</h2>
        <AddNewSessionDialog />
      </div>
      <HistoryList />
      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;
