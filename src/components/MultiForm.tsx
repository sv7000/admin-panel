import React, { useState } from "react";
import apiClient from "../services/api-client";
import ProgressBar from "./ProgressBar";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'

const MultiForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    files: [] as File[],
    options: [] as string[],
  });
  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors, isSubmitting },
  // } = useForm<FormData>({
  //     resolver: zodResolver(schema),
  //    });

  const [error, setError] = useState("");

  const handleNext = async () => {
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
          // Create a new submission
          const response = await apiClient.post("/submissions", payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setSubmissionId(response.data.id);
        } else {
          // Update the existing submission
          await apiClient.patch(`/submissions/${submissionId}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }
        setStep(step + 1);
      } else if (step === 2 && submissionId) {
        // Retrieve existing step1_data
        const existingSubmission = await apiClient.get(
          `/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Save Step 2 data
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
        // Retrieve existing step1_data and step2_files
        const existingSubmission = await apiClient.get(
          `/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Save Step 3 data and mark submission as complete
        payload = {
          user_id: userId,
          step1_data: existingSubmission.data.step1_data, // Preserve step1_data
          step2_files: existingSubmission.data.step2_files, // Preserve step2_files
          step3_options: JSON.stringify(formData.options),
          submission_date: new Date().toISOString(),
          status: "complete",
        };

        await apiClient.patch(`/submissions/${submissionId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
    } catch (err) {
      setError("Submission failed");
    }
  };

  const handlePrevious = () => setStep(step - 1);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Step {step} of 3</h2>
        <ProgressBar currentStep={step} totalSteps={3} />
      </div>
      {step === 1 && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          />
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setFormData({ ...formData, files: Array.from(e.target.files) })
            }
            className="w-full p-2 mb-4 border rounded"
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <select
            multiple
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
            className="w-full p-2 mb-4 border rounded"
          >
            Gender
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
            className="bg-gray-500 text-white p-2 rounded"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {step === 3 ? "Submit" : "Next"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default MultiForm;
