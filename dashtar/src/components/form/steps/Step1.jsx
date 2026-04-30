import React, {useContext, useState, useEffect} from "react";
import {Card} from "@windmill/react-ui";
import {useForm} from "react-hook-form";
import {Select} from "@windmill/react-ui";
import axios from "axios";
import {toast} from "react-toastify";

import Label from "@/components/form/label/Label";
import {AdminContext} from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";

const API_KEY = "23701352851be653a3182fb03cde3f8ed8e26f9c81064d6c447dd8071369854e";

const FieldError = ({error}) =>
  error ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null;

// Focus ring only appears when field has validation rules
const Input = ({register, name, placeholder, type = "text", validation, className = ""}) => {
  const hasValidation = validation && Object.keys(validation).length > 0;
  return (
    <input
      {...register(name, validation)}
      type={type}
      placeholder={placeholder}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none ${hasValidation ? "focus:ring-1 focus:ring-yellow-400" : ""
        } ${className}`}
    />
  );
};

const Step1 = ({next, defaultData, type, openDetails, setOpenDetails, appId, setAppId}) => {
  const {register, handleSubmit, watch, formState: {errors}} = useForm({defaultValues: defaultData});
  const {state} = useContext(AdminContext);
  const {adminInfo} = state;

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const preference = watch("hostel");

  const getDynamicField = () => {
    switch (preference) {
      case "Hostel": return {label: "Room Type", options: ["Normal", "Attached Bathroom", "A/C Room"]};
      case "Bus": return {label: "Select Bus Route", options: ["Route 1", "Route 2", "Route 3"]};
      case "Self": return {label: "Self Type", options: ["By Walk", "Two Wheeler", "With Parents"]};
      default: return null;
    }
  };

  const ugCourses = [
    "B.A Tamil", "B.A English", "B.Sc. Apparel & Fashion Technology",
    "B.Sc. Computer Science", "B.Sc. Nutrition & Dietetics", "B.Sc. Mathematics",
    "B.Sc. Physics", "B.Sc. Psychology", "B.Com", "B.Com Computer Applications", "BBA", "BCA",
  ];
  const pgCourses = [
    "MA English", "M.Sc. Computer Science",
    "M.Sc. Food Service Management & Dietetics", "M.Sc. Psychology", "M.Com",
  ];

  useEffect(() => {
    if (type === "UG") setCourses(ugCourses);
    else if (type === "PG") setCourses(pgCourses);
  }, [type]);

  useEffect(() => {
    if (selectedCountry === "IN") {
      axios.get("https://api.countrystatecity.in/v1/countries/IN/states", {
        headers: {"X-CSCAPI-KEY": API_KEY},
      }).then((res) => setStates(res.data));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`,
        {headers: {"X-CSCAPI-KEY": API_KEY}}
      ).then((res) => setDistricts(res.data));
    }
  }, [selectedState]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        father: JSON.stringify(data.father),
        mother: JSON.stringify(data.mother),
        guardian: JSON.stringify(data.guardian),
      };
      const res = await AdminServices.createApplication(payload);
      setAppId(res.appId);
      setOpenDetails(true);
      console.log("createApplication res", res);
    } catch (err) {
      console.log("err", err);
      toast.error(err.response?.data?.message || "Failed to save Step 1")

    }
  };

  const onUpdate = async (data) => {
    try {
      // const storedAppId = localStorage.getItem("appId");
      console.log("Updating application with ID:", appId);
      await AdminServices.updateApplication(appId, data);
      next(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const req = (label) => ({required: `${label} is required`});
  const dynamicField = getDynamicField();

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-90 md:p-[50px] border rounded-lg shadow-lg">
      <Card className="w-full p-3 text-black">

        {/* ══════════ FORM 1 — Basic Info ══════════ */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
          <div className="hidden">
            <Label label="Select Graduation" />
            <Select {...register("gradType")} value={type} className="input text-black">
              <option value="">Select</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </Select>
          </div>

          <div className="px-5 py-2 bg-green-100 mb-3">
            <h2 className="text-lg font-bold text-gray-600">Course Preference</h2>
          </div>
          {/* Course Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 border-2 border-gray-600 p-5">
            <div>
              <Label label="Preference 1" />
              <Select {...register("pref1", req("Preference 1"))} className="input text-black">
                <option value="">Select Course</option>
                {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </Select>
              <FieldError error={errors.pref1} />
            </div>
            <div>
              <Label label="Preference 2" />
              <Select {...register("pref2", req("Preference 2"))} className="input text-black">
                <option value="">Select Course</option>
                {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </Select>
              <FieldError error={errors.pref2} />
            </div>
          </div>

          <div className="px-5 py-2 bg-green-100 mb-3">
            <h2 className="text-lg font-bold text-gray-600">Personal Details</h2>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label label="Full Name (As per Certificate)" />
              <Input register={register} className="h-12" name="name" placeholder="Full Name" validation={req("Full Name")} />
              <FieldError error={errors.name} />
            </div>
            <div>
              <Label label="Mobile" />
              <Input register={register} name="mobile" className="h-12" placeholder="Mobile"
                validation={{required: "Mobile is required", pattern: {value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit number"}}} />
              <FieldError error={errors.mobile} />
            </div>
            <div>
              <Label label="WhatsApp" />
              <Input register={register} name="whatsapp" className="h-12" placeholder="WhatsApp"
                validation={{required: "WhatsApp is required", pattern: {value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit number"}}} />
              <FieldError error={errors.whatsapp} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label label="Email" />
              {/* No validation = no yellow ring */}
              <Input register={register} name="email" className="h-12" type="email" placeholder="Email" />
            </div>
            <div>
              <Label label="Date of Birth" />
              <Input register={register} name="dob" className="h-12" type="date" validation={req("Date of Birth")} />
              <FieldError error={errors.dob} />
            </div>
            <div>
              <Label label="Gender" />
              <Select {...register("gender", req("Gender"))}>
                <option value="">Select type</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </Select>
              <FieldError error={errors.gender} />
            </div>
          </div>

          <button className="w-full mt-4 bg-yellow-400 py-2 rounded text-black font-bold">
            Save & Continue
          </button>
        </form>

        {/* ══════════ FORM 2 — Remaining Details (shown after first save) ══════════ */}
        {openDetails && (
          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">

            {/* Community / Blood Group / Religion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label label="Community" />
                <Select {...register("community", req("Community"))} className="input text-black">
                  <option value="">Select</option>
                  <option>SC</option><option>ST</option><option>OBC</option>
                  <option>BC</option><option>MBC</option><option>OC</option><option>Others</option>
                </Select>
                <FieldError error={errors.community} />
              </div>
              <div>
                <Label label="Blood Group" />
                <Select {...register("bloodGroup", req("Blood Group"))} className="input text-black">
                  <option value="">Select</option>
                  <option>A+ve</option><option>A-ve</option><option>B+ve</option><option>B-ve</option>
                  <option>AB+ve</option><option>AB-ve</option><option>O+ve</option><option>O-ve</option>
                </Select>
                <FieldError error={errors.bloodGroup} />
              </div>
              <div>
                <Label label="Religion" />
                <Select {...register("religion", req("Religion"))} className="input text-black">
                  <option value="">Select</option>
                  <option>Hindu</option><option>Christian</option>
                  <option>Muslim</option><option>Others</option>
                </Select>
                <FieldError error={errors.religion} />
              </div>
            </div>

            {/* Hostel / Transport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label label="Prefer what you want (Hostel/Bus/Self)?" />
                <Select {...register("hostel", req("Preference"))} className="input text-black">
                  <option value="">Select</option>
                  <option>Hostel</option><option>Bus</option><option>Self</option>
                </Select>
                <FieldError error={errors.hostel} />
              </div>
              {dynamicField && (
                <div>
                  <Label label={dynamicField.label} />
                  <Select {...register("adSource", req(dynamicField.label))} className="input text-black">
                    <option value="">Select</option>
                    {dynamicField.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </Select>
                  <FieldError error={errors.adSource} />
                </div>
              )}
            </div>

            {/* Father Details */}
            <div className="px-5 py-2 bg-green-100 mb-3">
              <h2 className="text-lg font-bold text-gray-600">Father Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <Input register={register} name="father.name" className="h-12" placeholder="Name" validation={req("Father's Name")} />
                <FieldError error={errors.father?.name} />
              </div>
              <div>
                <Input register={register} name="father.mobile" className="h-12" placeholder="Mobile" validation={req("Father's Mobile")} />
                <FieldError error={errors.father?.mobile} />
              </div>
              <div>
                <Input register={register} name="father.occupation" className="h-12" placeholder="Occupation" validation={req("Father's Occupation")} />
                <FieldError error={errors.father?.occupation} />
              </div>
              <div>
                <Input register={register} name="father.yearlyincom" className="h-12" placeholder="Annual Income" validation={req("Father's Annual Income")} />
                <FieldError error={errors.father?.yearlyincom} />
              </div>
            </div>

            {/* Mother Details — no validation, no yellow ring */}
            <div className="px-5 py-2 bg-green-100 mb-3">
              <h2 className="text-lg font-bold text-gray-600">Mother's Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <Input register={register} name="mother.name" className="h-12" placeholder="Name" />
              <Input register={register} name="mother.mobile" className="h-12" placeholder="Mobile" />
              <Input register={register} name="mother.occupation" className="h-12" placeholder="Occupation" />
              <Input register={register} name="mother.yearlyincom" placeholder="Annual Income" />
            </div>

            {/* Guardian Details — no validation, no yellow ring */}
            <div className="px-5 py-2 bg-green-100 mb-3">
              <h2 className="text-lg font-bold text-gray-600">Guardian Details</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Input register={register} name="guardian.name" placeholder="Name" />
              <Input register={register} name="guardian.mobile" placeholder="Mobile" />
              <Input register={register} name="guardian.occupation" placeholder="Occupation" />
              <Input register={register} className="h-12" name="guardian.yearlyincom" placeholder="Annual Income" />
            </div>

            {/* Address */}
            <div className="px-5 py-2 bg-green-100 mb-3">
              <h2 className="text-lg font-bold text-gray-600">Address Details</h2>
            </div>
            <div>
              <Input register={register} name="address" placeholder="Address" validation={req("Address")} />
              <FieldError error={errors.address} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Select {...register("country", req("Country"))}>
                  <option value="">Select Country</option>
                  <option value="IN">India</option>
                  <option value="NRI">NRI</option>
                </Select>
                <FieldError error={errors.country} />
              </div>
              <div>
                <Select {...register("state", req("State"))} disabled={selectedCountry !== "IN"}>
                  <option value="">Select State</option>
                  {states.map((s) => <option key={s.iso2} value={s.iso2}>{s.name}</option>)}
                </Select>
                <FieldError error={errors.state} />
              </div>
              <div>
                <Select {...register("district", req("District"))} disabled={!selectedState}>
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </Select>
                <FieldError error={errors.district} />
              </div>
              <div>
                <Input register={register} name="city" placeholder="City" validation={req("City")} />
                <FieldError error={errors.city} />
              </div>
              <div>
                <Input register={register} name="pincode" placeholder="Pincode"
                  validation={{required: "Pincode is required", pattern: {value: /^\d{6}$/, message: "Enter valid 6-digit pincode"}}} />
                <FieldError error={errors.pincode} />
              </div>
            </div>

            <button className="w-full mt-4 bg-yellow-400 py-2 rounded text-black font-bold">
              Save & Continue
            </button>

          </form>
        )}
      </Card>
    </div>
  );
};

export default Step1;


// import React, { useContext, useState, useEffect } from "react";
// import { Card } from "@windmill/react-ui";
// import { useForm } from "react-hook-form";
// import { Select } from "@windmill/react-ui";
// import axios from "axios";

// import Label from "@/components/form/label/Label";
// import InputArea from "@/components/form/input/InputArea";
// import Error from "@/components/form/others/Error";
// import { AdminContext } from "@/context/AdminContext";
// import { SidebarContext } from "@/context/SidebarContext";
// import AdminServices from "@/services/AdminServices";

// const API_KEY = "23701352851be653a3182fb03cde3f8ed8e26f9c81064d6c447dd8071369854e";

// const Step1 = ({ next, defaultData }) => {
//   const { register, handleSubmit, watch, formState: { errors } } = useForm({
//     defaultValues: defaultData
//   });
//   const { state } = useContext(AdminContext);
//   const { adminInfo } = state;
//   console.log('userInfo', adminInfo);

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);

//   const selectedCountry = watch("country");
//   const selectedState = watch("state");
//   const preference = watch("hostel");

//   const getDynamicField = () => {
//     switch (preference) {
//       case "Hostel":
//         return {
//           label: "Room Type",
//           // name: "roomType",
//           options: ["Normal", "Attached Bathroom", "A/C Room"],
//         };

//       case "Bus":
//         return {
//           label: "Select Bus Route",
//           // name: "busRoute",
//           options: ["Route 1", "Route 2", "Route 3"], // replace with your array
//         };

//       case "Self":
//         return {
//           label: "Self Type",
//           // name: "selfType",
//           options: ["By Walk", "Two Wheeler", "With Parents"],
//         };

//       default:
//         return null;
//     }
//   };

//   const dynamicField = getDynamicField();


//   useEffect(() => {
//     axios.get("https://api.countrystatecity.in/v1/countries", {
//       headers: { "X-CSCAPI-KEY": API_KEY }
//     }).then(res => setCountries(res.data));
//   }, []);

//   // Load States
//   useEffect(() => {
//     if (selectedCountry === "IN") {
//       axios.get(`https://api.countrystatecity.in/v1/countries/IN/states`, {
//         headers: { "X-CSCAPI-KEY": API_KEY }
//       }).then(res => setStates(res.data));
//     }
//   }, [selectedCountry]);

//   // Load Districts (Cities)
//   useEffect(() => {
//     if (selectedState) {
//       axios.get(
//         `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`,
//         { headers: { "X-CSCAPI-KEY": API_KEY } }
//       ).then(res => setDistricts(res.data));
//     }
//   }, [selectedState]);

//   // const onSubmit = (data) => next(data);
//   const onSubmit = async (data) => {
//     try {
//       // 🔥 convert object fields
//       const payload = {
//         ...data,
//         father: JSON.stringify(data.father),
//         mother: JSON.stringify(data.mother),
//         guardian: JSON.stringify(data.guardian),
//       };

//       const res = await AdminServices.createApplication(payload);
//       console.log('createApplication res', res);
//       // notifySuccess("Step 1 Saved");

//       // 🔥 pass appId to parent
//       next(data, res.appId);

//     } catch (err) {
//       console.log('err', err)
//       // notifyError("Failed to save Step 1");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-blue-90">
//       <Card className="w-full p-6  text-black">

//         <h2 className="text-center text-xl font-bold mb-4">
//           Personal Details
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//           {/* BASIC DETAILS */}
//           <Label label="Full Name (As per Certificate)" />
//           <InputArea register={register} name="name" defaultValue={adminInfo.admin?.name}0  />
//           <Error errorName={errors.name} />

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label label="Mobile" />
//               <InputArea register={register} name="mobile" defaultValue={adminInfo.admin?.mobile} />
//             </div>
//             <div>
//               <Label label="WhatsApp" />
//               <InputArea register={register} name="whatsapp" />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label label="Email" />
//               <InputArea register={register} name="email" type="email" defaultValue={adminInfo.admin?.email} />
//             </div>
//             <div>
//               <Label label="Alternate Email" />
//               <InputArea register={register} name="altEmail" type="email" />
//             </div>
//           </div>

//           <Label label="Date of Birth" />
//           <InputArea register={register} name="dob" type="date" defaultValue={adminInfo.admin?.dob} />

//           {/* SELECT FIELDS */}
//           <div className="grid grid-cols-4 gap-2">
//             <div>
//               <Label label="Gender" />
//               <Select
//                 // name={gender}
//                 {...register("gender")}
//               >
//                 <option value="" defaultValue hidden>
//                   Select type
//                 </option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Others</option>
//               </Select>
//               {/* <select {...register("gender")} className="input text-black">
//                 <option value="">Select</option>
//                 <option>Male</option>
//                 <option>Female</option>
//               </select> */}
//             </div>

//             <div>
//               <Label label="Community" />
//               <Select {...register("community")} className="input text-black">
//                 <option value="">Select</option>
//                 <option>SC</option>
//                 <option>ST</option>
//                 <option>OBC</option>
//                 <option>BC</option>
//                 <option>MBC</option>
//                 <option>OC</option>
//                 <option>Others</option>
//               </Select>
//             </div>

//             <div>
//               <Label label="Blood Group" />
//               <Select {...register("bloodGroup")} className="input text-black">
//                 <option value="">Select</option>
//                 <option>A+ve</option>
//                 <option>A-ve</option>
//                 <option>B+ve</option>
//                 <option>B-ve</option>
//                 <option>AB+ve</option>
//                 <option>AB-ve</option>
//                 <option>O+ve</option>
//                 <option>O-ve</option>
//               </Select>
//             </div>
//             <div>
//               <Label label="Religion" />
//               <Select {...register("religion")} className="input text-black">
//                 <option value="">Select</option>
//                 <option>Hindu</option>
//                 <option>Christian</option>
//                 <option>Mulsim</option>
//                 <option>Others</option>
//               </Select>
//             </div>
//             {/* <InputArea register={register} name="bloodGroup" placeholder="Blood Group" />
//             <InputArea register={register} name="religion" placeholder="Religion" />
//             <InputArea register={register} name="motherTongue" placeholder="Mother Tongue" /> */}
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label label="Prefer what you want(Hostel/Bus/Self)?" />
//               <Select {...register("hostel")} className="input text-black">
//                 <option>Hostel</option>
//                 <option>Bus</option>
//                 <option>Self</option>
//               </Select>
//             </div>

//             {dynamicField && (
//               <div>
//                 <Label label={dynamicField.label} />
//                 <Select
//                   {...register("adSource")} // you can change the name as needed
//                   className="input text-black"
//                 >
//                   <option value="">Select</option>
//                   {dynamicField.options.map((opt, i) => (
//                     <option key={i} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </Select>
//               </div>
//             )}

//             {/* <div>
//               <Label label="Advertisement Source" />
//               <Select {...register("adSource")} className="input text-black">
//                 <option>Magazine</option>
//                 <option>Teacher/School</option>
//                 <option>Newspaper</option>
//                 <option>Student/Alumni</option>
//               </Select>
//             </div> */}
//           </div>

//           {/* FATHER DETAILS */}
//           <h3 className="font-bold mt-4">Father's Details</h3>
//           <div className="grid grid-cols-2 gap-2">
//             <InputArea register={register} name="father.name" placeholder="Name" />
//             <InputArea register={register} name="father.mobile" placeholder="Mobile" />
//             <InputArea register={register} name="father.email" placeholder="Email" />
//             <InputArea register={register} name="father.occupation" placeholder="Occupation" />
//             <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
//             {/* <InputArea register={register} name="father.organization" placeholder="Organization" />
//             <InputArea register={register} name="father.department" placeholder="Department" /> */}
//           </div>

//           {/* MOTHER DETAILS */}
//           <h3 className="font-bold mt-4">Mother's Details</h3>
//           <div className="grid grid-cols-2 gap-2">
//             <InputArea register={register} name="mother.name" placeholder="Name" />
//             <InputArea register={register} name="mother.mobile" placeholder="Mobile" />
//             <InputArea register={register} name="mother.email" placeholder="Email" />
//             <InputArea register={register} name="mother.occupation" placeholder="Occupation" />
//             <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
//             {/* <InputArea register={register} name="mother.organization" placeholder="Organization" />
//             <InputArea register={register} name="mother.department" placeholder="Department" /> */}
//           </div>

//           {/* GUARDIAN */}
//           <h3 className="font-bold mt-4">Guardian Details</h3>
//           <div className="grid grid-cols-2 gap-2">
//             <InputArea register={register} name="guardian.name" placeholder="Name" />
//             <InputArea register={register} name="guardian.mobile" placeholder="Mobile" />
//             <InputArea register={register} name="guardian.email" placeholder="Email" />
//             <InputArea register={register} name="guardian.occupation" placeholder="Occupation" />
//             <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
//             {/* <InputArea register={register} name="guardian.organization" placeholder="Organization" />
//             <InputArea register={register} name="guardian.department" placeholder="Department" /> */}
//           </div>

//           {/* ADDRESS */}
//           <h3 className="font-bold mt-4">Address Details</h3>
//           <InputArea register={register} name="address" placeholder="Address" />

//           <div className="grid grid-cols-3 gap-2">
//             <Select {...register("country")}>
//               <option value="">Select Country</option>
//               <option value="IN">India</option>
//               <option value="NRI">NRI</option>
//             </Select>
//             <Select {...register("state")} disabled={selectedCountry !== "IN"}>
//               <option value="">Select State</option>
//               {states.map((s) => (
//                 <option key={s.iso2} value={s.iso2}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>

//             {/* District */}
//             <Select {...register("district")} disabled={!selectedState}>
//               <option value="">Select District</option>
//               {districts.map((d) => (
//                 <option key={d.id} value={d.name}>
//                   {d.name}
//                 </option>
//               ))}
//             </Select>
//             <InputArea register={register} name="city" placeholder="City" />
//             {/* <InputArea register={register} name="district" placeholder="District" />
//             <InputArea register={register} name="state" placeholder="State" />
//             <InputArea register={register} name="country" placeholder="Country" /> */}
//             <InputArea register={register} name="pincode" placeholder="Pincode" />
//           </div>

//           {/* SUBMIT */}
//           <button className="w-full mt-4 bg-yellow-400 py-2 rounded text-black font-bold">
//             Save & Continue
//           </button>

//         </form>
//       </Card>
//     </div>
//   );
// };

// export default Step1;