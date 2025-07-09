"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowElbowRight, IconArrowRight } from "@tabler/icons-react";
import { useState, useContext } from "react";
import { AIDoctorAgents } from "@/shared/list";
import Image from "next/image";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useRouter } from "next/navigation";

type DoctorAgent = (typeof AIDoctorAgents)[number];

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [recommendedDoctors, setRecommendedDoctors] = useState<DoctorAgent[]>(
    []
  );
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [open, setOpen] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  // Simple mapping of keywords to specialist
  const symptomToSpecialist = [
    {
      keywords: ["child", "baby", "infant", "kid", "teen", "pediatric"],
      specialist: "Pediatrician",
    },
    {
      keywords: ["skin", "rash", "acne", "eczema", "psoriasis", "dermatitis"],
      specialist: "Dermatologist",
    },
    {
      keywords: [
        "anxiety",
        "depression",
        "mental",
        "stress",
        "psychology",
        "sad",
        "emotion",
      ],
      specialist: "Psychologist",
    },
    {
      keywords: [
        "diet",
        "weight",
        "nutrition",
        "food",
        "eat",
        "obesity",
        "nutritionist",
      ],
      specialist: "Nutritionist",
    },
    {
      keywords: [
        "heart",
        "chest pain",
        "palpitation",
        "cardio",
        "blood pressure",
      ],
      specialist: "Cardiologist",
    },
    {
      keywords: ["ear", "nose", "throat", "sinus", "ent", "hearing", "voice"],
      specialist: "ENT Specialist",
    },
    {
      keywords: [
        "bone",
        "joint",
        "muscle",
        "orthopedic",
        "fracture",
        "sprain",
        "arthritis",
      ],
      specialist: "Orthopedic",
    },
    {
      keywords: [
        "period",
        "pregnancy",
        "women",
        "gynecology",
        "menstrual",
        "reproductive",
        "hormone",
      ],
      specialist: "Gynecologist",
    },
    {
      keywords: ["tooth", "teeth", "gum", "mouth", "oral", "dentist", "cavity"],
      specialist: "Dentist",
    },
  ];

  // Find the best matching doctor
  function getRecommendedDoctors(note: string): DoctorAgent[] {
    const lowerNote = note.toLowerCase();
    const matchedSpecialists = symptomToSpecialist
      .filter((map) => map.keywords.some((kw) => lowerNote.includes(kw)))
      .map((map) => map.specialist);
    const doctors = AIDoctorAgents.filter((doc) =>
      matchedSpecialists.includes(doc.specialist)
    );
    // If no specific match, recommend General Physician
    if (doctors.length === 0 && note.length >= 5) {
      const general = AIDoctorAgents.find(
        (doc) => doc.specialist === "General Physician"
      );
      return general ? [general] : [];
    }
    return doctors;
  }

  // Update recommendation as user types
  function handleNoteChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote(e.target.value);
    setShowRecommendation(false);
  }

  function handleNextClick() {
    const recommended = getRecommendedDoctors(note);
    setRecommendedDoctors(recommended);
    setShowRecommendation(true);
    // Do not close the dialog here
  }

  async function handleStartConsultation(doctor: DoctorAgent) {
    if (!userDetail?.email) return;
    const sessionId = Math.random().toString(36).substring(2, 15); // or use uuid if available
    await axios.post("/api/sessions", {
      sessionId,
      notes: note,
      createdBy: userDetail.email,
      doctor: {
        id: doctor.id,
        specialist: doctor.specialist,
        description: doctor.description,
        image: doctor.image,
      },
    });
    setOpen(false);
    setShowRecommendation(false);
    setNote("");
    setRecommendedDoctors([]);
    router.push(`/dashboard/medical-agent/${sessionId}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2>Add Symptoms or Diseases</h2>
              {!showRecommendation && (
                <Textarea
                  placeholder="Add Detail here..."
                  className="h-[250px] mt-2"
                  onChange={handleNoteChange}
                  value={note}
                />
              )}
              {showRecommendation && recommendedDoctors.length > 0 && (
                <div className="flex flex-col items-center gap-6 mt-4">
                  {recommendedDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-gray-50 w-full max-w-xs"
                    >
                      <Image
                        src={doctor.image}
                        alt={doctor.specialist}
                        width={100}
                        height={100}
                        className="rounded-full border"
                      />
                      <div className="font-bold text-lg">
                        {doctor.specialist}
                      </div>
                      <div className="text-gray-600 text-center">
                        {doctor.description}
                      </div>
                      <Button
                        className="mt-2 w-full"
                        onClick={() => handleStartConsultation(doctor)}
                      >
                        Start Consultation
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                setShowRecommendation(false);
                setNote("");
                setRecommendedDoctors([]);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          {!showRecommendation && (
            <Button
              disabled={note.length < 5}
              className="flex items-center gap-2"
              onClick={handleNextClick}
            >
              Next <IconArrowRight></IconArrowRight>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
