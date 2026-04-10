import React, {useState} from "react";
import {Card} from "@windmill/react-ui";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";

import Label from "@/components/form/label/Label";
import {notifyError, notifySuccess} from "@/utils/toast";
import AdminServices from "@/services/AdminServices";

const Step4Upload = ({prev, formData}) => {
  const {register, handleSubmit, watch} = useForm();

  const gradType = formData?.gradType;
  const history = useHistory();
  // 🔥 PREVIEW STATES
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  // 🔥 FILE VALIDATION
  const validateFile = (file, type, size) => {
    if (!file) return true;

    const allowedTypes =
      type === "image"
        ? ["image/png", "image/jpeg", "image/jpg"]
        : ["application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type";
    }

    if (file.size > size) {
      return `File exceeds ${size / 1024} KB`;
    }

    return true;
  };

  // 🔥 IMAGE PREVIEW HANDLER
  const handlePreview = (file, type) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (type === "photo") setPhotoPreview(url);
    if (type === "sign") setSignPreview(url);
  };

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      const appId = localStorage.getItem("appId");

      Object.keys(formData).forEach((key) => {
        finalData.append(key, formData[key]);
      });

      finalData.append("photo", data.photo[0]);
      finalData.append("signature", data.signature[0]);
      finalData.append("marksheet", data.marksheet[0]);
      finalData.append("community", data.community[0]);

      if (gradType === "UG" && data.provisional) {
        finalData.append("provisional", data.provisional[0]);
      }

      await AdminServices.updateApplication(appId, finalData);
      // const res = await AdminServices.createApplication(finalData);


      toast.success({
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.push(`/application-preview/${appId}`);

    } catch (err) {
      console.error("Upload error:", err);
      notifyError("Upload failed!");
    }
  };

  return (
    <div className="flex justify-center min-h-screen ">
      <Card className="w-full p-6  text-black">

        <h2 className="text-xl font-bold mb-4">
          Upload Documents
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* PHOTO */}
          <div>
            <Label label="Photo (Max 500KB)" />
            <input
              type="file"
              {...register("photo", {
                required: true,
                validate: (file) =>
                  validateFile(file[0], "image", 500 * 1024),
              })}
              onChange={(e) => handlePreview(e.target.files[0], "photo")}
              className="input border border-slate-300 w-auto rounded-lg py-3"
              style={{visibility: 'visible', display: 'block', height: '50px', width: '250px'}}
            />

            {photoPreview && (
              <img
                src={photoPreview}
                alt="preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>

          {/* SIGNATURE */}
          <div>
            <Label label="Signature (Max 500KB)" />
            <input
              type="file"
              {...register("signature", {
                required: true,
                validate: (file) =>
                  validateFile(file[0], "image", 500 * 1024),
              })}
              onChange={(e) => handlePreview(e.target.files[0], "sign")}
              className="input border border-slate-300 w-auto rounded-lg py-3"
              style={{visibility: 'visible', display: 'block', height: '50px', width: '250px'}}
            />

            {signPreview && (
              <img
                src={signPreview}
                alt="preview"
                className="mt-2 w-24 h-16 object-cover rounded bg-white"
              />
            )}
          </div>

          {/* MARKSHEET */}
          <div>
            <Label label="12th Marksheet (PDF, Max 1MB)" />
            <input
              type="file"
              {...register("marksheet", {
                required: true,
                validate: (file) =>
                  validateFile(file[0], "pdf", 1024 * 1024),
              })}
              className="input border border-slate-300 w-auto rounded-lg py-3"
              style={{visibility: 'visible', display: 'block', height: '50px', width: '250px'}}
            />
          </div>

          {/* PROVISIONAL */}
          {gradType === "UG" && (
            <div>
              <Label label="Provisional Certificate (PDF)" />
              <input
                type="file"
                {...register("provisional")}
                className="input"
              />
            </div>
          )}

          {/* COMMUNITY */}
          <div>
            <Label label="Community Certificate (PDF)" />
            <input
              type="file"
              {...register("community", {required: true})}
              className="input border border-slate-300 w-auto rounded-lg py-3"
              style={{visibility: 'visible', display: 'block', height: '50px', width: '250px'}}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={prev}
              className="bg-gray-300 px-3 py-2 rounded text-black"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-yellow-400 px-3 py-2 rounded text-black font-bold"
            >
              Submit Application
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default Step4Upload;