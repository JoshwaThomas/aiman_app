import React, { useContext, useState } from 'react';
import { FiXCircle } from "react-icons/fi";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TableContainer,
    Button,
    Card,
    CardBody,
    Pagination,
} from "@windmill/react-ui";
// import { useTranslation } from "react-i18next";

import useAsync from "@/hooks/useAsync";
import AdminServices from "@/services/AdminServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import Recipet from '@/components/invoice/Recipet';
import MainDrawer from '@/components/drawer/MainDrawer';
import PaymentDrawer from '@/components/drawer/PaymentDrawer';
import useToggleDrawer from '@/hooks/useToggleDrawer';
import EditDeleteButton from "@/components/table/EditDeleteButton";
import DeleteModal from '@/components/modal/DeleteModal';
// import useFilter from "@/hooks/useFilter";


function Payment() {

    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { data, loading, error } = useAsync(() =>
        AdminServices.getPayment({ email: adminInfo.email })
    );
    const { toggleDrawer, openPayPreview, closePayPreview, previewPayData, isPreviewPayOpen } = useContext(SidebarContext);
    const [paymentmodel, setPaymentmodel] = useState(false);
    const [paymentdata, setPaymentdata] = useState([]);
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
    // const {
    //     userRef,
    //     setRole,
    //     totalResults,
    //     resultsPerPage,
    //     dataTable,
    //     serviceData,
    //     handleChangePage,
    //     handleSubmitUser,
    // } = useFilter(data);

    console.log("dataTable", data)

    // const groupedPayments = data.payments.reduce((acc, curr) => {
    //     if (acc[curr.i_Id]) {
    //         acc[curr.i_Id].rec_amt += curr.rec_amt;
    //     } else {
    //         acc[curr.i_Id] = { ...curr, rec_amt: curr.rec_amt };
    //     }
    //     return acc;
    // }, {});

    // const uniquePayments = Object.values(groupedPayments);

    const groupedPayments = (data.payments && Array.isArray(data.payments))
        ? data.payments.reduce((acc, curr) => {
            // If the i_Id exists, sum the rec_amt, otherwise initialize it
            if (acc[curr.i_Id]) {
                acc[curr.i_Id].rec_amt += curr.rec_amt;
            } else {
                acc[curr.i_Id] = { ...curr, rec_amt: curr.rec_amt };
            }
            return acc;
        }, {})
        : {}; // Return an empty object if data.payments is undefined or not an array

    // Now, map over the grouped data to render rows
    const uniquePayments = Object.values(groupedPayments);



    const handleHistory = (per_data) => {
        const filterData = data.payments.filter((items) => items.cus_Id === per_data.cus_Id)
        setPaymentdata({ filterData, per_data })
        setPaymentmodel(true)
        console.log("filterData", filterData)
    }

    const handlePayPreview = (pay) => {
        console.log("pay id", pay.i_Id)
        const filterData = data.payments.filter((items) => items.i_Id === pay.i_Id)
        openPayPreview(filterData);
        console.log("Preview Data Set:", filterData);
    };



    return (
        <div className='p-2'>
            <MainDrawer>
                <PaymentDrawer id={serviceId} />
            </MainDrawer>
            <div className='flex flex-row justify-between'>
                <div className='text-3xl font-bold my-3'>Payment List</div>
            </div>
            <AnimatedContent >
                <Card className="min-w-0 shadow-xs overflow-hidden border border-slate-300 bg-white dark:bg-gray-800 mb-5">
                    <CardBody className="">
                        <div className='flex flex-row justify-between'>
                            <input
                                // ref={searchRef}
                                type="search"
                                name="search"
                                placeholder="Search Product"
                                className="w-52 p-2 rounded-lg border border-slate-300"
                            />
                            <div className='flex flex-row justify-center items-center'>
                                <label htmlFor="nofpage" >Per Page</label>
                                <select onChange={(e) => setSortedField(e.target.value)} name='nofpage' className="w-auto p-2 rounded-lg border border-slate-300">
                                    <option value="05" defaultValue>05</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                </select>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <TableContainer className="mb-8 rounded-b-lg border border-sky-500">
                                <Table>
                                    <TableHeader>
                                        <tr className='bg-sky-500 text-lg font-bold text-white capitalize border border-sky-500'>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Recived</TableCell>
                                            <TableCell>Balance</TableCell>
                                            <TableCell>Next Due</TableCell>
                                            <TableCell>Details</TableCell>
                                            <TableCell>Action</TableCell>
                                            {/* <TableCell>Action</TableCell> */}
                                        </tr>
                                    </TableHeader>
                                    {/* <EnquiryTable enquirys={dataTable} /> */}
                                    <TableBody className='border border-sky-500 '>
                                        {uniquePayments?.map((data) => {
                                            const balance = data.totalPrice - data.rec_amt;
                                            return (
                                                <TableRow key={data._id} className='border border-b-sky-500 border-white'>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <div className="flex items-center">
                                                            <div>
                                                                <h2 className="text-base font-medium">
                                                                    {data.i_Id}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* <TableCell className='border border-y-sky-500 border-white'>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <h2 className="text-base font-medium">
                                                                {new Date(data.date).toLocaleDateString()}

                                                            </h2>
                                                        </div>
                                                    </div>
                                                </TableCell> */}

                                                    <TableCell className='border border-y-sky-500 border-white text-wrap'>
                                                        <span className="text-base text-wrap">{data.com_name}</span>{" "}
                                                    </TableCell>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <span className="text-base ">{data.totalPrice}</span>
                                                    </TableCell>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <span className="text-base ">{data.rec_amt}</span>
                                                    </TableCell>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <span className="text-base ">{balance}</span>
                                                    </TableCell>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <span className="text-base ">{new Date(data.nextdue).toLocaleDateString()}</span>
                                                    </TableCell>
                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        <span className="text-base">
                                                            <span className="text-base">
                                                                <button onClick={() => handlePayPreview(data)}>
                                                                    Recipet
                                                                </button>
                                                            </span>
                                                            {/* <button onClick={() => handleHistory(data)}>
                                                            History
                                                        </button> */}

                                                        </span>
                                                    </TableCell>

                                                    <TableCell className='border border-y-sky-500 border-white'>
                                                        {/* <Button
                                                            id={data._id}
                                                            onClick={toggleDrawer}
                                                            className="px-2 md:py-1 py-1 h-8 text-sm m-2 bg-green-600 hover:bg-green-700 dark:bg-gray-700"
                                                        >
                                                            <span className="text-white font-bold dark:text-gray-200">Pay</span>
                                                        </Button> */}
                                                        <div className=" flex justify-between text-sm font-semibold text-center">
                                                            <EditDeleteButton
                                                                title={data.com_name}
                                                                id={data._id}
                                                                handleUpdate={handleUpdate}
                                                                handleModalOpen={handleModalOpen}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                                <TableFooter>
                                    {/* <Pagination
                                                totalResults={data?.totalDoc}
                                                resultsPerPage={limitData}
                                                onChange={handleChangePage}
                                                label="Product Page Navigation"
                                            /> */}
                                </TableFooter>
                            </TableContainer>
                        </div>
                    </CardBody>
                </Card>
            </AnimatedContent>
            <div>
                {/* {paymentmodel && (
                <div className="fixed top-0 left-0 w-4/5 ml-64 mt-40 h-2/3 z-50 bg-white flex justify-center items-center">
                    <div className="w-full max-h-[90%] overflow-auto bg-white rounded-lg shadow-lg p-3">
                        <div className='text-right items-end text-xl block relative mb-10'>
                            <FiXCircle onClick={() => setPaymentmodel(false)} className="absolute right-0 cursor-pointer text-red-500 hover:text-red-700" />
                        </div>
                        <div className='grid grid-cols-4'>
                            <div>Company Name</div>
                            <div>Contanct</div>
                            <div>Pending Amount</div>
                            <div>Total Amount</div>
                            <div>{paymentdata.per_data.com_name}</div>
                            <div>{paymentdata.per_data.mobile}</div>
                            <div>{paymentdata.per_data.bal}</div>
                            <div>{paymentdata.per_data.totalPrice}</div>
                        </div>
                        <div className='mt-5'>
                            <TableContainer className="mb-8 rounded-b-lg border border-sky-500">
                                <Table>
                                    <TableHeader>
                                        <tr className='bg-sky-500 text-lg font-bold text-white capitalize border border-sky-500'>
                                            <TableCell>Pay Id</TableCell>
                                            <TableCell>Invoice Id</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Pending</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Next Due</TableCell>
                                            <TableCell>Details</TableCell>
                                        </tr>
                                    </TableHeader>
                                    <TableBody className='border border-sky-500 '>
                                        {paymentdata.filterData?.map((data) => (
                                            <TableRow key={data._id} className='border border-b-sky-500 border-white'>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <h2 className="text-base font-medium">
                                                                {data.pay_id}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <h2 className="text-base font-medium">
                                                                {data.i_Id}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white text-wrap'>
                                                    <span className="text-base text-wrap"> {new Date(data.dop).toLocaleDateString()}</span>{" "}
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base ">{data.bal}</span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base ">{data.totalPrice}</span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base ">{new Date(data.nextdue).toLocaleDateString()}</span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base">
                                                        <button onClick={() => handlePayPreview(paymentdata)}>
                                                            Recipet
                                                        </button>

                                                    </span>
                                                </TableCell>
                                                
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table> */}
                {/* <TableFooter> */}
                {/* <Pagination
                                                totalResults={data?.totalDoc}
                                                resultsPerPage={limitData}
                                                onChange={handleChangePage}
                                                label="Product Page Navigation"
                                            /> */}
                {/* </TableFooter>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            )} */}
            </div>
            {isPreviewPayOpen && (
                <div className="fixed top-0 left-0 w-4/5 ml-64 mt-5 h-full z-50 flex justify-center items-center">
                    <div className="w-full max-h-[90%] overflow-auto bg-white rounded-lg shadow-lg">
                        <Recipet />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Payment