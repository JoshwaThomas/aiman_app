import React, { useState, useEffect } from "react";
import { Card, Select } from "@windmill/react-ui";
import { useForm } from "react-hook-form";

import Label from "@/components/form/label/Label";
import InputArea from "@/components/form/input/InputArea";
import { notifyError, notifySuccess } from "@/utils/toast";
import AdminServices from "@/services/AdminServices";


const Step2Academic = ({ next, prev }) => {
    const { register, handleSubmit, setValue, watch, getValues } = useForm();
    const watchAll = watch();
    const [rows, setRows] = useState([]);

    const qualificationType = watch("eduType");

    // 🔥 Set rows based on selection
    useEffect(() => {
        if (qualificationType === "10+2") {
            setRows([{ id: 1 }, { id: 2 }]);
        } else if (qualificationType === "UG") {
            setRows([{ id: 1 }, { id: 2 }, { id: 3 }]);
        }
    }, [qualificationType]);

    // ➕ Add row manually
    const addRow = () => {
        setRows([...rows, { id: Date.now() }]);
    };

    // 🔥 Auto percentage calculation
    const calculatePercentage = (index, field, value) => {
        // get current values
        const current = getValues(`edu[${index}]`) || {};

        const max = field === "maxMark" ? value : current.maxMark;
        const mark = field === "mark" ? value : current.mark;

        if (max && mark && Number(max) > 0) {
            const percent = ((Number(mark) / Number(max)) * 100).toFixed(2);

            setValue(`edu[${index}].percentage`, percent);
        } else {
            setValue(`edu[${index}].percentage`, "");
        }
    };

    // const onSubmit = (data) => {
    //     next(data);
    // };

    const onSubmit = async (data) => {
        try {
            const appId = localStorage.getItem("appId");
            console.log('appId', appId);
            const payload = {
                ...data,
                edu: JSON.stringify(data.edu),
            };

            await AdminServices.updateApplication(appId, payload);

            // notifySuccess("Step 2 Saved");

            next(data);

        } catch (err) {
            console.error('Error updating application:', err);
            notifyError("Step 2 failed");
        }
    };

    return (
        <div className="flex justify-center min-h-screen ">
            <Card className="w-full p-6 text-black h-[90vh] overflow-y-auto">

                <h2 className="text-xl font-bold mb-4">
                    Academic Details
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* BASIC DETAILS */}
                    <Label label="Current Education Qualification Status" />
                    <InputArea register={register} name="currentStatus" />

                    <Label label="School/College Last Attended" />
                    <InputArea register={register} name="lastCollege" />

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label label="Year of Passing" />
                            <InputArea register={register} name="passingYear" />
                        </div>
                        <div>
                            <Label label="Marks / Grade" />
                            <InputArea register={register} name="grade" />
                        </div>
                    </div>

                    {/* AADHAR */}
                    <Label label="Aadhar Updated Recently?" />
                    <Select {...register("aadhar")} className="input text-black">
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                    </Select>

                    {/* EDUCATION TYPE */}
                    <Label label="Education Type" />
                    <Select {...register("eduType")} className="input text-black">
                        <option value="">Select</option>
                        <option value="10+2">10+2</option>
                        <option value="UG">UG</option>
                    </Select>

                    {/* DYNAMIC ROWS */}
                    {rows.map((row, index) => (
                        <div key={row.id} className="border p-3 rounded bg-gray-300">

                            <h4 className="mb-2">Qualification {index + 1}</h4>

                            <div className="grid grid-cols-2 gap-2">

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].qualification`}
                                    placeholder="Qualification"
                                />

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].board`}
                                    placeholder="Board / University"
                                />

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].maxMark`}
                                    placeholder="Max Mark"
                                    onChange={(e) =>
                                        calculatePercentage(index, "maxMark", e.target.value)
                                    }
                                />

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].mark`}
                                    placeholder="Secured Mark"
                                    onChange={(e) =>
                                        calculatePercentage(index, "mark", e.target.value)
                                    }
                                />

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].percentage`}
                                    placeholder="Percentage"
                                    defaultValue={watch(`edu[${index}].percentage`) || ""}
                                    readOnly
                                />

                                <InputArea
                                    register={register}
                                    name={`edu[${index}].year`}
                                    placeholder="Passed Year"
                                />

                            </div>
                        </div>
                    ))}

                    {/* ADD ROW BUTTON */}
                    {rows.length > 0 && (
                        <button
                            type="button"
                            onClick={addRow}
                            className="bg-green-500 px-3 py-2 rounded text-white font-bold"
                        >
                            + Add Row
                        </button>
                    )}

                    {/* EMIS */}
                    <Label label="EMIS No" />
                    <InputArea register={register} name="emis" />

                    {/* BUTTONS */}
                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={prev} className="bg-gray-300 px-3 py-2 rounded text-black">
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

export default Step2Academic;