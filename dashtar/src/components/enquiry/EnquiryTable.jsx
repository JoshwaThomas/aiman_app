import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";


//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EnquiryDrawer from "../drawer/EnquiryDrawer";
import useEnqirySubmit from "@/hooks/useEnquirySubmit";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const EnquiryTable = ({ enquirys, deleteModel, deleteData, setDeleteModel, handleDelete, handleDetails, setShow, show }) => {
    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        isSubmitting,
        handleResetPassword,
    } = useToggleDrawer();
    // const [deleteModel, setDeleteModel] = useState(false)
    // const [show, setShow] = useState(false)
    // const [deleteData, setDeleteData] = useState([])


    // const handleDelete = (enquiry) => {
    //     console.log("Delete user", enquiry)
    //     setDeleteData(enquiry)
    //     setDeleteModel(true)
    // }

    const handleDeleteCon = async (deleteData) => {
        console.log("handleDeleteCon", deleteData)
        try {
            const res = await AdminServices.deleteEnquiry(deleteData._id);
            console.log("deleted data", res)
            // setIsUpdate(true);
            notifySuccess(res.message);
            setDeleteModel(false);
            AdminServices.getAllEnquiry()
        } catch (err) {
            console.error("Submission Error:", err);
            notifyError(err?.response?.data?.message || err?.message)
        };
    }
    const handleAccept = async (user) => {
        console.log("user Approve", user)
        try {
            const res = await AdminServices.approveEnquiry(user._id);
            console.log("deleted data", res)
            AdminServices.getAllEnquiry()
            notifySuccess(res.message);
            
        } catch (err) {
            console.error("Submission Error:", err);
            notifyError(err?.response?.data?.message || err?.message)
        };
    }

    const handleReject = async (user) => {
        console.log("user Reject", user);
        try {
            const res = await AdminServices.rejectEnquiry(user._id);
            AdminServices.getAllEnquiry()
            notifySuccess(res.message);
        } catch (err) {
            console.error("Submission Error:", err);
            notifyError(err?.response?.data?.message || err?.message)
        };
    }


    // console.log("deleteModel", deleteModel)
    return (
        <>
            <DeleteModal id={serviceId} title={title} />
            {deleteModel && (
                <div className="fixed inset-0 flex items-center justify-center ">
                    <div className=" bg-slate-100 w-72 h-56 text-center rounded-lg shadow-xl shadow-zinc-900 shadow-lg overflow-auto p-6">
                        <h1 className="font-bold text-2xl my-2">{deleteData.com_name}</h1>
                        <h1 className="font-bold text-lg my-4">Are Sure Delete the Enquiry?</h1>
                        <button

                            type="button"
                            className={`px-4 py-1 font-bold m-4 rounded-lg bg-gray-400  text-white hover:bg-indigo-600`}
                            onClick={() => {
                                setDeleteModel(false);
                            }}
                        >Cancel</button>
                        <button
                            type="button"

                            className={`px-4 py-1 ml-1 font-bold rounded-lg bg-red-500  text-white hover:bg-red-700`}
                            onClick={() => handleDeleteCon(deleteData)}
                        >Confirm</button>
                    </div>
                </div>
            )}

            {show && (
                <div className="fixed inset-0 flex items-center justify-center ">
                    <div className=" bg-slate-100 w-full h-4/5 font-semibold text-center rounded-lg shadow-xl shadow-zinc-900 shadow-lg overflow-auto p-6">
                        <h1 className="font-bold text-2xl my-2">{deleteData.com_name}</h1>
                        <h1 className="font-bold text-lg my-4"> {deleteData.con_person}</h1>
                        <div className="grid grid-cols-3">
                            <div> <label className="font-extrabold">Email</label> {deleteData.email}</div>
                            <div> <label className="font-extrabold">Mobile</label> {deleteData.mobile}</div>
                            <div> <label className="font-extrabold">Alternative Mobile</label> {deleteData.alter_mobile}</div>
                        </div>
                        <div className="grid grid-cols-2 p-5">
                            <div className="text-left">
                                <span className="text-md font-semibold">Products</span>
                                {deleteData.product.map((item, index) =>
                                    <div key={index} className="font-medium flex items-center">
                                        <MdKeyboardDoubleArrowRight className='text-lg text-pink-600' /><span className="text-sm">{item.type}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <span className="text-md font-semibold">Service</span>
                                {deleteData.service.map((item, index) =>
                                    <div key={index} className="font-medium flex items-center">
                                        <MdKeyboardDoubleArrowRight className='text-lg text-pink-600' /> <span className="text-sm">{item.type}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-left mt-2">Remark {deleteData.remark}</div>
                        </div>
                        <button

                            type="button"
                            className={`px-4 py-1 font-bold m-4 rounded-lg bg-gray-400  text-white hover:bg-indigo-600`}
                            onClick={() => { setShow(false); }}
                        >Close</button>
                    </div>
                </div>
            )}

            <MainDrawer>
                <EnquiryDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {enquirys?.sort((a, b) => {
                    if (a.status !== b.status) {
                        return a.status === 0 ? 2 : 1;
                    }
                    return new Date(b.date) - new Date(a.date);
                })?.map((enquiry) => (
                    <TableRow key={enquiry._id} className='font-semibold border border-sky-500'>
                        <TableCell>
                            <div className="flex items-center justify-center">
                                <div>
                                    <h2 className="text-sm font-semibold">
                                        {new Date(enquiry.date).toLocaleDateString()}
                                    </h2>
                                </div>
                            </div>
                        </TableCell>

                        <TableCell className='text-center'>
                            <div className="flex items-center justify-center">
                                <div>
                                    <h2 className="text-sm ">
                                        {enquiry.com_name}
                                    </h2>
                                </div>
                            </div>
                        </TableCell>

                        <TableCell className='text-center'>
                            <span className="text-sm text-center">{enquiry.mobile}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-md font-semibold text-left">Products</span>
                            {enquiry.product.map((item, index) =>
                                <div key={index} className="font-medium flex items-center">
                                    <MdKeyboardDoubleArrowRight className='text-lg text-pink-600' /><span className="text-sm">{item.type}</span>
                                </div>
                            )}
                            <span className="text-md font-semibold text-left">Service</span>
                            {enquiry.service.map((item, index) =>
                                <div key={index} className="font-medium flex items-center">
                                    <MdKeyboardDoubleArrowRight className='text-lg text-pink-600' /> <span className="text-sm">{item.type}</span>
                                </div>
                            )}
                        </TableCell>

                        <TableCell className='text-center'>
                            <span className="text-sm flex justify-center">
                                <FaEye className='text-xl' onClick={() => handleDetails(enquiry)} />
                                {/* {enquiry.status} */}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className=" flex justify-between text-sm font-semibold text-center">
                                <button
                                    type="button"
                                    onClick={() => handleAccept(enquiry)}
                                    className={`px-4 py-1 ml-1 rounded-lg ${enquiry.status === 1 ? 'bg-green-400 text-green-700' : enquiry.status === 0 ? 'bg-green-500 text-white hover:bg-black' : 'bg-gray-300 text-gray-500'}`}
                                    disabled={enquiry.status !== 0}
                                >Approve</button>
                                <button
                                    type="button"
                                    onClick={() => handleReject(enquiry)}
                                    className={`px-4 py-1 ml-1 rounded-lg ${enquiry.status === 2 ? 'bg-red-400 text-red-700' : enquiry.status === 0 ? 'bg-red-500 text-white hover:bg-black' : 'bg-gray-300 text-gray-500'}`}
                                    disabled={enquiry.status !== 0}
                                >Reject</button>
                                <MdDeleteOutline className='text-red-500 hover:text-red-600 text-3xl'
                                    onClick={() => handleDelete(enquiry)}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/* {show && (
                <div className="w-1/2 h-1/2 bg-white">
                    hello
                </div>
            )} */}

        </>
    );
};

export default EnquiryTable;
