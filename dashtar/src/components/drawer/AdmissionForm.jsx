import React, { useState } from "react";
import Step1Personal from "../components/form/steps/Step1Personal";
import Step2Academic from "../components/form/steps/Step2Academic";
import Step3Course from "../components/form/steps/Step3Course";
import Step4Upload from "../components/form/steps/Step4Upload";

const AdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data) => {
  setFormData((prev) => ({ ...prev, ...data }));
  setStep((prev) => prev + 1);
};

  const prev = () => setStep(step - 1);

  return (
    <div className="p-6 min-h-screen">

      {step === 1 && <Step1Personal next={next} defaultData={formData} />}
      {step === 2 && <Step2Academic next={next} prev={prev} />}
      {step === 3 && <Step3Course next={next} prev={prev} />}
      {step === 4 && <Step4Upload prev={prev} formData={formData} />}

    </div>
  );
};

export default AdmissionForm;