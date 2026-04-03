import React, { useState } from "react";
import { Card } from "@windmill/react-ui";
import { useForm } from "react-hook-form";

import Label from "@/components/form/label/Label";
import { notifyError, notifySuccess } from "@/utils/toast";
import AdminServices from "@/services/AdminServices";


const Step3Course = ({ next, prev }) => {
    const { register, handleSubmit, watch } = useForm();

    const gradType = watch("gradType");

    // 🎯 Course Lists
    const ugCourses = [
        "B.A Tamil",
        "B.A English",
        "B.Sc. Apparel & Fashion Technology",
        "B.Sc. Computer Science",
        "B.Sc. Nutrition & Dietetics",
        "B.Sc. Mathematics",
        "B.Sc. Physics",
        "B.Sc. Psychology",
        "B.Com",
        "B.Com Computer Applications",
        "BBA",
        "BCA"
    ];

    const pgCourses = [
        "MA English",
        "M.Sc. Computer Science",
        "M.Sc. Food Service Management & Dietetics",
        "M.Sc. Psychology",
        "M.Com",
    ];

    // 🔥 Dynamic course list
    const courses = gradType === "PG" ? pgCourses : ugCourses;

    const onSubmit = async (data) => {
        try {
            const appId = localStorage.getItem("appId");

            await AdminServices.updateApplication(appId, data);

            // notifySuccess("Step 3 Saved");

            next(data);

        } catch (err) {
            notifyError("Step 3 failed");
        }
    };

    return (
        <div className="flex justify-center min-h-screen ">
            <Card className="w-full p-6  text-black">

                <h2 className="text-xl font-bold mb-4">
                    Course Selection
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Graduation Type */}
                    <div>
                        <Label label="Select Graduation" />
                        <select {...register("gradType")} className="input text-black">
                            <option value="">Select</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                        </select>
                    </div>

                    {/* Preference 1 */}
                    <div>
                        <Label label="Preference 1" />
                        <select {...register("pref1")} className="input text-black">
                            <option value="">Select Course</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Preference 2 */}
                    <div>
                        <Label label="Preference 2" />
                        <select {...register("pref2")} className="input text-black">
                            <option value="">Select Course</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
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

                        <button className="px-3 mt-4 bg-yellow-400 py-2 rounded text-black font-bold">
                            Save & Continue
                        </button>
                    </div>

                </form>
            </Card>
        </div>
    );
};

export default Step3Course;