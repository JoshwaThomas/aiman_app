import React, {useState, useContext} from "react";
import { useHistory } from "react-router-dom";


import Step1Personal from "@/components/form/steps/Step1";
import Step2Academic from "@/components/form/steps/Step2Academic";
import Step3Course from "@/components/form/steps/Step3Course";
import Step4Upload from "@/components/form/steps/Step4Upload";
import Logo from "@/assets/img/logo/logo-dark.png";

import {AdminContext} from "@/context/AdminContext";
import {SidebarContext} from "@/context/SidebarContext";

const steps = [
  "Personal",
  "Academic",
  "Course",
  // "Upload"
];

const Quotations = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const {state} = useContext(AdminContext);
  const {adminInfo} = state;
  //   console.log('userInfo', adminInfo);
  const [appId, setAppId] = useState(localStorage.getItem("appId") || null);

  //   const next = (data) => {
  //     setFormData((prev) => ({ ...prev, ...data }));
  //     setStep((prev) => prev + 1);
  //   };

  const history = useHistory();

  const handleLoginNav = () => {
    history.push("/login");
  };

  const next = (data, idFromBackend = null) => {
    setFormData((prev) => ({...prev, ...data}));

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
      <div className="md:hidden bg-[#172272] text-white py-2 px-4 flex justify-between items-center text-[11px] font-bold tracking-wider uppercase">
        <a href="tel:+917339548002" className="flex items-center gap-1">
          📞 Call Support
        </a>
        <a href="https://www.aimancollege.edu.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1">
          🌐 Visit Website
        </a>
      </div>

      {/* 🔹 Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">

          {/* 🔹 Logo Section */}
          <div className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={Logo}
              alt="Aiman College Logo"
              className="h-12 md:h-16 lg:h-20 w-auto object-contain"
            />
          </div>

          {/* 🔹 Right Side: Support & Actions */}
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">

            {/* Phone Support (Clean & Minimal) */}
            <div className="hidden md:flex flex-col items-end">
              <a
                href="tel:+917339548002"
                className="text-base font-bold text-[#172272] hover:text-[#4EAB27] transition-colors flex items-center gap-2"
              >
                <span className="text-lg">📞</span> +91 733 954 8002
              </a>
            </div>

            {/* 🔹 Admission Help + Visit Website Cluster */}
            <div className="hidden md:flex flex-col items-center">

              <a
                href="https://www.aimancollege.edu.in/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border-2 border-[#172272] text-[#172272] text-xs font-bold rounded-full hover:bg-[#172272] hover:text-white transition-all uppercase tracking-wide"
              >
                Visit Website
              </a>
            </div>

            {/* 🔹 Vertical Divider (Desktop Only) */}
            <div className="hidden md:block h-10 w-[1px] bg-slate-200"></div>

            {/* 🔹 Primary Login Button */}
            <button
              onClick={handleLoginNav}
              className="px-8 py-3 bg-yellow-400 text-[#172272] text-sm font-extrabold rounded-full shadow-[0_4px_14px_0_rgba(250,204,21,0.4)] hover:bg-yellow-500 hover:shadow-yellow-500/30 transition-all active:scale-95 uppercase tracking-wider"
            >
              Login
            </button>
          </div>
        </div>
      </header>
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
                    className={`absolute top-[12px] left-[-50%] w-full h-1 ${step > stepNumber - 1 ? "bg-yellow-400" : "bg-gray-400"
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
        {/* {step === 4 && <Step4Upload prev={prev} formData={formData} />} */}

      </div>
    </div>
  );
};

export default Quotations;