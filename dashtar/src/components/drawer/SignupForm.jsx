import React, {useState} from "react";
import {Card} from "@windmill/react-ui";
import {useHistory} from "react-router-dom";
import Label from "@/components/form/label/Label";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import DrawerButton from "@/components/form/button/DrawerButton";
import AdminServices from '@/services/AdminServices';
import {useForm} from "react-hook-form";
import {notifyError, notifySuccess} from "@/utils/toast";


const SignupForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const history = useHistory();
  const [appId, setAppId] = useState(null)


  const id = "69f1f8a0559cd02a20d91ff8"
  const onSubmit = async (data) => {


    try {
      // console.log("Data", data)
      const res = await AdminServices.checkApplicationStatus({
        applicationNumber: data.applicationNumber,
        dob: data.dob
      });
      // notifySuccess(res.message, ");
      console.log("fdhg cuyg", res)
      history.push(`/application-preview/${res.data._id}`)
    } catch (err) {
      console.error("Error fetching SignupForm data:", err);
      notifyError(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[500px] p-6 rounded-xl text-black">
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 gap-4">

            {/* Name */}
            <div>
              <Label label="Application Number or Mobile No" />
              <InputArea
                register={register}
                name="applicationNumber"
                type="text"
                placeholder="Enter your  number"
                required={true}
              />
              <Error errorName={errors.applicationNumber} />
            </div>

            {/* Mobile */}
            {/* <div>
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
            </div> */}

            {/* Email */}
            {/* <div>
              <Label label="Email" />
              <InputArea
                register={register}
                name="email"
                type="email"
                placeholder="Enter email"
                required={true}
              />
              <Error errorName={errors.email} />
            </div> */}

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
            className="w-full mt-5 border-2 p-4 border-[#172272] text-[#172272] text-xs font-bold rounded-full hover:bg-[#172272] hover:text-white transition-all uppercase tracking-wide"
          >
            Check Status
          </button>

          <div className="text-sm text-gray-600 text-center mt-4">
            Don’t have an application yet?{" "}
            <span
              onClick={props.applicationTypePopup}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Apply Now
            </span>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default SignupForm;