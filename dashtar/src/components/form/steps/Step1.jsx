import React, { useContext, useState, useEffect } from "react";
import { Card } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { Select } from "@windmill/react-ui";
import axios from "axios";

import Label from "@/components/form/label/Label";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";

const API_KEY = "23701352851be653a3182fb03cde3f8ed8e26f9c81064d6c447dd8071369854e";

const Step1 = ({ next, defaultData }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: defaultData
  });
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  console.log('userInfo', adminInfo);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    axios.get("https://api.countrystatecity.in/v1/countries", {
      headers: { "X-CSCAPI-KEY": API_KEY }
    }).then(res => setCountries(res.data));
  }, []);

  // Load States
  useEffect(() => {
    if (selectedCountry === "IN") {
      axios.get(`https://api.countrystatecity.in/v1/countries/IN/states`, {
        headers: { "X-CSCAPI-KEY": API_KEY }
      }).then(res => setStates(res.data));
    }
  }, [selectedCountry]);

  // Load Districts (Cities)
  useEffect(() => {
    if (selectedState) {
      axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`,
        { headers: { "X-CSCAPI-KEY": API_KEY } }
      ).then(res => setDistricts(res.data));
    }
  }, [selectedState]);

  // const onSubmit = (data) => next(data); 
  const onSubmit = async (data) => {
    try {
      // 🔥 convert object fields
      const payload = {
        ...data,
        father: JSON.stringify(data.father),
        mother: JSON.stringify(data.mother),
        guardian: JSON.stringify(data.guardian),
      };

      const res = await AdminServices.createApplication(payload);
      console.log('createApplication res', res);
      // notifySuccess("Step 1 Saved");

      // 🔥 pass appId to parent
      next(data, res.appId);

    } catch (err) {
      console.log('err', err)
      // notifyError("Failed to save Step 1");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-90">
      <Card className="w-full p-6  text-black">

        <h2 className="text-center text-xl font-bold mb-4">
          Personal Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* BASIC DETAILS */}
          <Label label="Full Name (As per Certificate)" />
          <InputArea register={register} name="name" defaultValue={adminInfo.admin?.name} readOnly/>
          <Error errorName={errors.name} />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label label="Mobile" />
              <InputArea register={register} name="mobile" defaultValue={adminInfo.admin?.mobile} />
            </div>
            <div>
              <Label label="WhatsApp" />
              <InputArea register={register} name="whatsapp" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label label="Email" />
              <InputArea register={register} name="email" type="email" defaultValue={adminInfo.admin?.email} />
            </div>
            <div>
              <Label label="Alternate Email" />
              <InputArea register={register} name="altEmail" type="email" />
            </div>
          </div>

          <Label label="Date of Birth" />
          <InputArea register={register} name="dob" type="date" defaultValue={adminInfo.admin?.dob} />

          {/* SELECT FIELDS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label label="Gender" />
              <Select
                // name={gender}
                {...register("gender")}
              >
                <option value="" defaultValue hidden>
                  Select type
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </Select>
              {/* <select {...register("gender")} className="input text-black">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select> */}
            </div>

            <div>
              <Label label="Community" />
              <Select {...register("community")} className="input text-black">
                <option value="">Select</option>
                <option>SC</option>
                <option>ST</option>
                <option>OBC</option>
                <option>BC</option>
                <option>MBC</option>
                <option>OC</option>
                <option>Others</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Select {...register("bloodGroup")} className="input text-black">
              <option value="">Select</option>
              <option>A+ve</option>
              <option>A-ve</option>
              <option>B+ve</option>
              <option>B-ve</option>
              <option>AB+ve</option>
              <option>AB-ve</option>
              <option>O+ve</option>
              <option>O-ve</option>
            </Select>
            <Select {...register("religion")} className="input text-black">
              <option value="">Select</option>
              <option>Hindu</option>
              <option>Christian</option>
              <option>Mulsim</option>
              <option>Others</option>
            </Select>
            <InputArea register={register} name="bloodGroup" placeholder="Blood Group" />
            <InputArea register={register} name="religion" placeholder="Religion" />
            <InputArea register={register} name="motherTongue" placeholder="Mother Tongue" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label label="Hostel Required?" />
              <Select {...register("hostel")} className="input text-black">
                <option>Yes</option>
                <option>No</option>
              </Select>
            </div>

            <div>
              <Label label="Advertisement Source" />
              <Select {...register("adSource")} className="input text-black">
                <option>Magazine</option>
                <option>Teacher/School</option>
                <option>Newspaper</option>
                <option>Student/Alumni</option>
              </Select>
            </div>
          </div>

          {/* FATHER DETAILS */}
          <h3 className="font-bold mt-4">Father's Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <InputArea register={register} name="father.name" placeholder="Name" />
            <InputArea register={register} name="father.mobile" placeholder="Mobile" />
            <InputArea register={register} name="father.email" placeholder="Email" />
            <InputArea register={register} name="father.occupation" placeholder="Occupation" />
            <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
            {/* <InputArea register={register} name="father.organization" placeholder="Organization" />
            <InputArea register={register} name="father.department" placeholder="Department" /> */}
          </div>

          {/* MOTHER DETAILS */}
          <h3 className="font-bold mt-4">Mother's Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <InputArea register={register} name="mother.name" placeholder="Name" />
            <InputArea register={register} name="mother.mobile" placeholder="Mobile" />
            <InputArea register={register} name="mother.email" placeholder="Email" />
            <InputArea register={register} name="mother.occupation" placeholder="Occupation" />
            <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
            {/* <InputArea register={register} name="mother.organization" placeholder="Organization" />
            <InputArea register={register} name="mother.department" placeholder="Department" /> */}
          </div>

          {/* GUARDIAN */}
          <h3 className="font-bold mt-4">Guardian Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <InputArea register={register} name="guardian.name" placeholder="Name" />
            <InputArea register={register} name="guardian.mobile" placeholder="Mobile" />
            <InputArea register={register} name="guardian.email" placeholder="Email" />
            <InputArea register={register} name="guardian.occupation" placeholder="Occupation" />
            <InputArea register={register} name="father.yearlyincom" placeholder="Annual Income" />
            {/* <InputArea register={register} name="guardian.organization" placeholder="Organization" />
            <InputArea register={register} name="guardian.department" placeholder="Department" /> */}
          </div>

          {/* ADDRESS */}
          <h3 className="font-bold mt-4">Address Details</h3>
          <InputArea register={register} name="address" placeholder="Address" />

          <div className="grid grid-cols-3 gap-2">
            <Select {...register("country")}>
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="NRI">NRI</option>
            </Select>
            <Select {...register("state")} disabled={selectedCountry !== "IN"}>
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.iso2} value={s.iso2}>
                  {s.name}
                </option>
              ))}
            </Select>

            {/* District */}
            <Select {...register("district")} disabled={!selectedState}>
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>
            <InputArea register={register} name="city" placeholder="City" />
            {/* <InputArea register={register} name="district" placeholder="District" />
            <InputArea register={register} name="state" placeholder="State" />
            <InputArea register={register} name="country" placeholder="Country" /> */}
            <InputArea register={register} name="pincode" placeholder="Pincode" />
          </div>

          {/* SUBMIT */}
          <button className="w-full mt-4 bg-yellow-400 py-2 rounded text-black font-bold">
            Save & Continue
          </button>

        </form>
      </Card>
    </div>
  );
};

export default Step1;