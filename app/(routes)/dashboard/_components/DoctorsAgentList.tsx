import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

function DoctorsAgentList() {
  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">Doctors Specialist AI Agents</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-5">
        {AIDoctorAgents.map((doctor, index) => (
          <DoctorAgentCard doctorAgent={doctor} key={index} />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
