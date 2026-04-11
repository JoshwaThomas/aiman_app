import React from "react";
import { Card } from "@windmill/react-ui";

import Label from "@/components/form/label/Label";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import DrawerButton from "@/components/form/button/DrawerButton";
import AdminServices from '@/services/AdminServices';
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try{
        const res = await AdminServices.registerSignUp(data);
        notifySuccess("Registration Successfully Completed!");
    }catch(err){
        console.error("Error fetching SignupForm data:", err);
        notifyError("Error occurred while fetching data.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-ilife-gradient">
      <Card className="w-[400px] p-6 rounded-xl shadow-lg bg-blue-800 text-black">

        <h2 className="text-center text-xl font-bold mb-4">
          Admissions Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 gap-4">

            {/* Name */}
            <div>
              <Label label="Name" />
              <InputArea
                register={register}
                name="name"
                type="text"
                placeholder="Enter your name"
                required={true}
              />
              <Error errorName={errors.name} />
            </div>

            {/* Mobile */}
            <div>
              <Label label="Mobile" />
              <InputArea
                register={register}
                name="mobile"
                type="text"
                placeholder="Enter mobile number"
                required={true}
                pattern={/^[0-9]{10}$/}
              />
              <Error errorName={errors.mobile} />
            </div>

            {/* Email */}
            <div>
              <Label label="Email" />
              <InputArea
                register={register}
                name="email"
                type="email"
                placeholder="Enter email"
                required={true}
              />
              <Error errorName={errors.email} />
            </div>

             <div>
              <Label label="DoB" />
              <InputArea
                register={register}
                name="dob"
                type="date"
                // placeholder="Enter email"
                required={true}
              />
              <Error errorName={errors.dob} />
            </div>

            {/* Address */}
            {/* <div>
              <Label label="Address" />
              <InputArea
                  register={register}
                  name="address"
                  type="text"
                  placeholder="Address"
                  required={true}
                />
              <Error errorName={errors.address} />
            </div> */}

            {/* State & City (Side by side like your UI) */}
            {/* <div className="grid grid-cols-2 gap-2">
              <div>
                <Label label="State" />
                <InputArea
                  register={register}
                  name="state"
                  type="text"
                  placeholder="State"
                  required={true}
                />
                <Error errorName={errors.state} />
              </div>

              <div>
                <Label label="City" />
                <InputArea
                  register={register}
                  name="city"
                  type="text"
                  placeholder="City"
                  required={true}
                />
                <Error errorName={errors.city} />
              </div>
            </div> */}

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-5 bg-yellow-400 text-black py-2 rounded font-bold"
          >
            APPLY NOW
          </button>

        </form>
      </Card>
    </div>
  );
};

export default SignupForm;