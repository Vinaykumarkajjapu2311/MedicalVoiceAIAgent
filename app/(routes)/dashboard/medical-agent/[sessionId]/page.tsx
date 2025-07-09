"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiPhone } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { PhoneOff } from "lucide-react";

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  // Demo conversation
  const conversation = [
    { from: "assistant", text: "Assistant Msg" },
    { from: "user", text: "User Msg" },
  ];

  useEffect(() => {
    sessionId && GetSessionDetails();
    // eslint-disable-next-line
  }, [sessionId]);

  const GetSessionDetails = async () => {
    setLoading(true);
    const result = await axios.get(`/api/users?sessionId=${sessionId}`);
    setSession(result.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-lg">
        Loading...
      </div>
    );
  }

  // Start voice conversation

  const startCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);
    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_API_KEY || "");

    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });
  };

  const endCall = () => {
    if (!vapiInstance) return;
    if (vapiInstance) {
      vapiInstance.stop();
    }

    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");
    setVapiInstance(null);
    setCallStarted(false);
  };

  const doctor = session?.report?.doctor;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div
        className="bg-white rounded-2xl shadow-xl border max-w-2xl w-full flex flex-col"
        style={{ minHeight: 600 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            </span>
            <span
              className={`${
                callStarted ? "text-green-500" : "text-red-700"
              } font-medium text-base`}
            >
              {callStarted ? "Connected..." : "Not Connected"}
            </span>
          </div>
          <span className="text-gray-400 font-mono text-base">00:00</span>
        </div>
        {/* Doctor Info */}
        <div className="flex flex-col items-center mt-6 mb-2">
          <div className="w-28 h-28 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden bg-white shadow">
            {doctor?.image ? (
              <Image
                src={doctor.image}
                alt={doctor.specialist}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">Doctor Image</span>
            )}
          </div>
          <div className="text-xl font-bold mt-4 text-gray-900">
            {doctor?.specialist || "Doctor"}
          </div>
          <div className="text-gray-500 text-base mt-1">
            AI Medical Voice Agent
          </div>
        </div>
        {/* Conversation Area */}
        <div className="flex-1 flex flex-col justify-end px-6 pb-6">
          <div className="w-full max-w-lg mx-auto h-48 md:h-56 bg-gray-100 rounded-lg border border-gray-200 shadow-inner p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.from === "assistant"
                    ? "text-gray-400 text-sm"
                    : "text-lg font-medium text-gray-800"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        {/* Start Call Button */}
        <div className="flex justify-center pb-8">
          {!callStarted ? (
            <Button onClick={startCall}>
              <FiPhone className="text-xl" /> Start Call
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={endCall}>
              {" "}
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
