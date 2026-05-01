import React, {useEffect, useState} from "react";
import AdminServices from "@/services/AdminServices";
import {toast} from "react-toastify";

function StatusModal({onClose, onSave, appId, reloadData}) {
    const [formData, setFormData] = useState({
        status: "",
        paymentStatus: "",
        modeOfPayment: "",
        admissionAmount: 0,
        mubalikkaAmount: 0,
    });

    const [applicationdata, setApplicationdata] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const getPaymentStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-700";
            case "unpaid":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getAppStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const fetchData = async () => {
        try {
            const res = await AdminServices.getApplication(appId);

            setFormData({
                status: res?.status || "",
                paymentStatus: res?.paymentStatus || "",
                modeOfPayment: res?.modeOfPayment || "",
                admissionAmount: res?.admissionAmount || 0,
                mubalikkaAmount: res?.mubalikkaAmount || 0,
            });

            setApplicationdata(res || {});
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // console.log("Update app", formData);
        try {
            const res = await AdminServices.updateApplicationStatus(appId, formData);
            toast.success(`${res.message}`)
            onClose()
            reloadData()
        } catch (err) {
            console.log(err)
            toast.error(`${err.response.message}`)
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-[560px] rounded-2xl p-7 shadow-2xl">

                {/* Header */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Update Application Status
                </h2>

                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-5 mb-6">

                    {/* Application Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Application Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">Select</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <div className="mt-2 text-sm">
                            Current Status 
                            <span
                                className={`px-3 ml-2 py-1.5 text-sm font-semibold rounded-full ${getAppStatusStyle(applicationdata.status)}`}
                            >
                                {applicationdata.status || "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Status
                        </label>

                        <select
                            name="paymentStatus"
                            value={formData.paymentStatus}
                            onChange={handleChange}
                            className="w-full  border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">Select</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>

                        <div className="mt-2 text-sm">
                            Current Status
                            <span
                                className={`px-3 ml-2 py-1.5 text-sm font-semibold rounded-full ${getPaymentStatusStyle(applicationdata.paymentStatus)}`}
                            >
                                {applicationdata.paymentStatus || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t my-5"></div>

                {/* Admission Section */}
                <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-base font-semibold text-gray-700 mb-4">
                        Admission Confirmation
                    </h3>

                    <div className="grid grid-cols-3 gap-4">

                        {/* Mode */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Payment Mode
                            </label>

                            <select
                                disabled={formData.paymentStatus !== "paid"}
                                name="modeOfPayment"
                                value={formData.modeOfPayment}
                                onChange={handleChange}
                                className={`w-full border rounded-lg p-3 text-sm ${formData.paymentStatus !== "paid"
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:ring-2 focus:ring-blue-400"
                                    }`}
                            >
                                <option value="">Mode</option>
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                            </select>
                        </div>

                        {/* Admission Amount */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Admission Amount
                            </label>

                            <input
                                type="number"
                                name="admissionAmount"
                                placeholder="Amount"
                                readOnly={formData.paymentStatus !== "paid"}
                                value={formData.admissionAmount}
                                onChange={handleChange}
                                className={`w-full border rounded-lg p-3 text-sm ${formData.paymentStatus !== "paid"
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:ring-2 focus:ring-blue-400"
                                    }`}
                            />
                        </div>

                        {/* Mobile/App Amount */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Muballiga
                            </label>

                            <input
                                type="number"
                                name="mubalikkaAmount"
                                placeholder="Mobile Amount"
                                readOnly={formData.paymentStatus !== "paid"}
                                value={formData.mubalikkaAmount}
                                onChange={handleChange}
                                className={`w-full border rounded-lg p-3 text-sm ${formData.paymentStatus !== "paid"
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:ring-2 focus:ring-blue-400"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
}

export default StatusModal;