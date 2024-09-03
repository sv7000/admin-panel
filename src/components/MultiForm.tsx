import React, { useState } from "react";
import apiClient from "../services/api-client";
import ProgressBar from "./ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NotificationBadge from "./NotificationBadge";
import TableButton from "./TableButton";


const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
});

type Step1Data = z.infer<typeof step1Schema>;

const MultiForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    files: [] as File[],
    options: [] as string[],
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const handleNext = handleSubmit(async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    try {
      let payload = {};

      if (step === 1) {
        // Save Step 1 data
        payload = {
          user_id: userId,
          step1_data: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
          }),
          status: "incomplete",
        };

        if (!submissionId) {
         
          const response = await apiClient.post("/submissions", payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setSubmissionId(response.data.id);
        } else {
         
          await apiClient.patch(`/submissions/${submissionId}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }
        setStep(step + 1);
      } else if (step === 2 && submissionId) {
       
        const existingSubmission = await apiClient.get(
          `/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

       
        payload = {
          user_id: userId,
          step1_data: existingSubmission.data.step1_data, // Preserve step1_data
          step2_files: JSON.stringify(formData.files.map((file) => file.name)),
        };

        await apiClient.patch(`/submissions/${submissionId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStep(step + 1);
      } else if (step === 3 && submissionId) {
       
        const existingSubmission = await apiClient.get(
          `/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        
        payload = {
          user_id: userId,
          step1_data: existingSubmission.data.step1_data, 
          step2_files: existingSubmission.data.step2_files,
          step3_options: JSON.stringify(formData.options),
          submission_date: new Date().toISOString(),
          status: "complete",
        };

        await apiClient.patch(`/submissions/${submissionId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          files: [] as File[],
          options: [] as string[],
        });
        setSubmissionId(null);
        setStep(1);
      }
    } catch (err) {
      setError("Submission failed", { message: "Invalid" });
    }
  });

  const handlePrevious = () => setStep(step - 1);

  return (
    <>
      
      {showNotification && (
        <NotificationBadge
          message="Form successfully submitted! Fill Out a new form"
          onClose={() => setShowNotification(false)}
        />
      )}
      <TableButton/>
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
      
        <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white text-center">
              Step {step} of 3
            </h2>
            <ProgressBar currentStep={step} totalSteps={3} />
          </div>
          {step === 1 && (
            <form>
              <input
                type="text"
                placeholder="Name"
                {...register("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phoneNumber")}
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
              <input
                type="text"
                placeholder="Address"
                {...register("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </form>
          )}
          {step === 2 && (
            <div>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    files: Array.from(e.target.files),
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <select
                
                value={formData.options}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    options: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
               
                
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          )}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-600 text-white p-3 rounded hover:bg-gray-500"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              {step === 3 ? "Submit" : "Next"}
            </button>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default MultiForm;
