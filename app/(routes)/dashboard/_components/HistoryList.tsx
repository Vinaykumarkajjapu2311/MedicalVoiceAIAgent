"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewSessionDialog from "./AddNewSessionDialog";

function HistoryList() {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div>
      {historyList.length == 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 mt-10 border-2 border-dashed border-gray-300 rounded-lg p-8">
          <Image
            src={"/medical-assistance.png"}
            alt={"Medical Assistance"}
            width={150}
            height={150}
          />
          <div className="text-center space-y-3">
            <h2 className="font-bold text-2xl text-gray-800">
              No Recent Consultations
            </h2>
            <p className="text-gray-600">
              It looks like you haven't consulted any Doctor.
            </p>
          </div>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {historyList.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-sm border"
            >
              {/* History item content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
