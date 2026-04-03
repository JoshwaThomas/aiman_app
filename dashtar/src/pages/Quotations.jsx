import React, { useState, useContext } from "react";
import Step1Personal from "@/components/form/steps/Step1";
import Step2Academic from "@/components/form/steps/Step2Academic";
import Step3Course from "@/components/form/steps/Step3Course";
import Step4Upload from "@/components/form/steps/Step4Upload";

import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";

const steps = [
  "Personal",
  "Academic",
  "Course",
  "Upload"
];

const Quotations = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
//   console.log('userInfo', adminInfo);
  const [appId, setAppId] = useState(localStorage.getItem("appId") || null);

//   const next = (data) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     setStep((prev) => prev + 1);
//   };

const next = (data, idFromBackend = null) => {
  setFormData((prev) => ({ ...prev, ...data }));

  if (idFromBackend) {
    console.log('idFromBackend', idFromBackend)
    setAppId(idFromBackend);
    localStorage.setItem("appId", idFromBackend);
  }

  setStep((prev) => prev + 1);
};


  const prev = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-blu0">

      {/* 🔥 PROGRESS BAR */}
      <div className="w-full bg-blue-800 p-6">

        <div className="flex items-center justify-between relative">

          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step >= stepNumber;

            return (
              <div key={index} className="flex-1 flex flex-col items-center relative">

                {/* LINE */}
                {index !== 0 && (
                  <div
                    className={`absolute top-[12px] left-[-50%] w-full h-1 ${
                      step > stepNumber - 1 ? "bg-yellow-400" : "bg-gray-400"
                    }`}
                  />
                )}

                {/* CIRCLE */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full z-10 font-bold
                  ${isActive ? "bg-yellow-400 text-black" : "bg-gray-400 text-white"}`}
                >
                  {stepNumber}
                </div>

                {/* LABEL */}
                <span className="text-white text-sm mt-2">
                  {label}
                </span>

              </div>
            );
          })}

        </div>
      </div>

      {/* 🔽 STEP CONTENT */}
      <div className="p-6">

        {step === 1 && <Step1Personal next={next} defaultData={formData} />}
        {step === 2 && <Step2Academic next={next} prev={prev} />}
        {step === 3 && <Step3Course next={next} prev={prev} />}
        {step === 4 && <Step4Upload prev={prev} formData={formData} />}

      </div>
    </div>
  );
};

export default Quotations;