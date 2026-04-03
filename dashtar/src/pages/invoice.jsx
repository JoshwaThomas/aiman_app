import React, { useContext, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

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
// import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from '@/components/drawer/MainDrawer';
// import QutationDrawer from '@/components/drawer/QuotationDrawer';
import { SidebarContext } from "@/context/SidebarContext";
// import EnquiryTable from '@/components/enquiry/EnquiryTable';
import useFilter from "@/hooks/useFilter";
import InvoiceDrawer from '@/components/drawer/InvoiceDrawer';
import InvoicePreview from "@/components/invoice/InvoicePreview";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import DeleteModal from '@/components/modal/DeleteModal';
import useToggleDrawer from '@/hooks/useToggleDrawer';
import Recipet from '@/components/invoice/Recipet';

function InvoicePage() {
    // const { t } = useTranslation();
    // const {searchRef} = useContext(SidebarContext);
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { toggleDrawer, openPreview, closePreview, previewData, isPreviewOpen } = useContext(SidebarContext);
    const { data, loading, error } = useAsync(() =>
        AdminServices.getAllInvoice({ email: adminInfo.email })
    );
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
    const [searchQuery, setSearchQuery] = useState("");
    const {
        userRef,
        setRole,
        totalResults,
        resultsPerPage,
        dataTable,
        serviceData,
        handleChangePage,
        handleSubmitUser,
    } = useFilter(data);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [selectedCusId, setSelectedCusId] = useState(null);
    const [detaildata, setDetailData] = useState([]);
    const [fulldata, setFulldata] = useState(false)

    const handlePreview = (quotation) => {
        console.log('it worked')
        openPreview(quotation);
        console.log("Preview Data Set:", quotation);
    };

    console.log("dataTable", dataTable)
    const groupedData = data.reduce((acc, current) => {
        if (!acc[current.cus_Id] || new Date(current.date) > new Date(acc[current.cus_Id].date)) {
            acc[current.cus_Id] = current;
        }
        return acc;
    }, {});

    const latestData = Object.values(groupedData);
    const handleViewAll = (cusId) => {
        console.log("cusId", cusId)
        setSelectedCusId(cusId);
        const patdata = data.filter((data) => data.cus_Id === cusId)
        setDetailData(patdata)
        setFulldata(true)
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = latestData.filter((enquiry) => {
        const companyName = enquiry.com_name.toLowerCase();
        const searchQueryLower = searchQuery.toLowerCase();

        return companyName.includes(searchQueryLower);
    });


    return (
        <div className='p-2'>
            {/* <PageTitle className='text-3xl font-'>Enquiry List</PageTitle> */}

            <DeleteModal id={serviceId} title={title} />
            <MainDrawer>
                <InvoiceDrawer id={serviceId} />
            </MainDrawer>
            <div className='flex flex-row justify-between'>
                <div className='text-3xl font-bold my-3'>Invoice List</div>
                <div className=''>
                    <Button
                        // layout="outline"
                        onClick={toggleDrawer}
                        className="px-4 md:py-1 py-2 h-12 text-sm m-2 bg-green-600 hover:bg-green-700 dark:bg-gray-700"
                    >
                        <span className="text-white font-bold dark:text-gray-200">Add Invoice</span>
                    </Button>
                    <Button
                        // layout="outline"
                        // onClick={handleResetField}
                        // type="reset"
                        className="px-4 md:py-1 py-2 h-12 text-sm m-2 bg-red-500 dark:bg-gray-700"
                    >
                        <span className="text-white font-bold dark:text-gray-200">Back</span>
                    </Button>
                </div>
            </div>
            <AnimatedContent >
                <Card className="min-w-0 shadow-xs overflow-hidden border border-slate-300 bg-white dark:bg-gray-800 mb-5">
                    <CardBody className="">
                        <div className='flex flex-row justify-between'>
                            <input
                                // ref={searchRef}
                                type="search"
                                name="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
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
                                            <TableCell>Date</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Mobile</TableCell>
                                            <TableCell>Invoice TO</TableCell>
                                            <TableCell>Preview</TableCell>
                                            <TableCell>Action</TableCell>
                                        </tr>
                                    </TableHeader>
                                    {/* <EnquiryTable enquirys={dataTable} /> */}
                                    <TableBody className='border border-sky-500 '>
                                        {filteredData?.map((data) => (
                                            <TableRow key={data._id} className='border border-b-sky-500 border-white'>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <h2 className="text-base font-medium">
                                                                {data.i_Id}
                                                            </h2>
                                                            <button onClick={() => handleViewAll(data.cus_Id)} className="bg-gray-300 hover:bg-blue-500 rounded-lg text-white px-2 py-1">
                                                                View All
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <h2 className="text-base font-medium">
                                                                {new Date(data.date).toLocaleDateString()}

                                                            </h2>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className='border border-y-sky-500 border-white text-wrap'>
                                                    <span className="text-base text-wrap">{data.com_name}</span>{" "}
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base ">{data.mobile}</span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base ">{data.city}</span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
                                                    <span className="text-base">
                                                        <button onClick={() => handlePreview(data)}>
                                                            <FaEye className='text-xl' />
                                                        </button>
                                                        {/* {enquiry.status} */}
                                                    </span>
                                                </TableCell>
                                                <TableCell className='border border-y-sky-500 border-white'>
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
                                        ))}
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



            {selectedCusId && fulldata && (
                <div className="fixed top-0 left-0 w-4/5 ml-64 mt-40 h-2/3 z-50 bg-white flex justify-center items-center">
                    <div className="w-full max-h-[90%] overflow-auto bg-white rounded-lg shadow-lg p-3">
                        <div className='text-right items-end text-xl block relative mb-10'>
                            <FiXCircle onClick={() => setFulldata(false)} className="absolute right-0 cursor-pointer text-red-500 hover:text-red-700" />
                        </div>
                        {/* <div className='grid grid-cols-4 my-10'>
                            <div> Coustomer ID </div>
                            <div>{detaildata.cus_Id}</div>
                            <div>Company Name</div>
                            <div>{detaildata.com_name}</div>
                            <div>Email</div>
                            <div>{detaildata.email}</div>
                            <div></div>
                            <div></div>
                        </div> */}
                        <TableContainer className="mb-8 rounded-b-lg border border-sky-500">
                            <Table>
                                <TableHeader>
                                    <tr className='bg-sky-500 text-lg font-bold text-white capitalize border border-sky-500'>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Mobile</TableCell>
                                        <TableCell>Invoice TO</TableCell>
                                        <TableCell>Preview</TableCell>
                                        <TableCell>Action</TableCell>
                                    </tr>
                                </TableHeader>
                                {/* <EnquiryTable enquirys={dataTable} /> */}
                                <TableBody className='border border-sky-500'>
                                    {detaildata?.map((data) => (
                                        <TableRow key={data._id} className='border  border-y-sky-500 border-white' >
                                            <TableCell className='border border-y-sky-500 border-white'>
                                                <div className="flex items-center">
                                                    <div>
                                                        <h2 className="text-base font-medium">
                                                            {data.i_Id}
                                                        </h2>
                                                        <button onClick={() => handleViewAll(data.cus_Id)} className="bg-gray-300 hover:bg-blue-500 rounded-lg text-white px-2 py-1">
                                                            View All
                                                        </button>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className='border border-y-sky-500 border-white'>
                                                <div className="flex items-center">
                                                    <div>
                                                        <h2 className="text-base font-medium">
                                                            {new Date(data.date).toLocaleDateString()}

                                                        </h2>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className='border border-y-sky-500 border-white text-wrap'>
                                                <span className="text-base text-wrap">{data.com_name}</span>{" "}
                                            </TableCell>
                                            <TableCell className='border border-y-sky-500 border-white'>
                                                <span className="text-base ">{data.mobile}</span>
                                            </TableCell>
                                            <TableCell className='border border-y-sky-500 border-white'>
                                                <span className="text-base ">{data.city}</span>
                                            </TableCell>
                                            <TableCell className='border border-y-sky-500 border-white'>
                                                <span className="text-base">
                                                    <button onClick={() => handlePreview(data)}>
                                                        <FaEye className='text-xl' />
                                                    </button>
                                                    {/* {enquiry.status} */}
                                                </span>
                                            </TableCell>
                                            <TableCell className='border border-y-sky-500 border-white'>
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
                                    ))}
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
                </div>
            )}

            {isPreviewOpen && (
                <div className="fixed top-0 left-0 w-4/5 ml-64 mt-5 h-full z-50 flex justify-center items-center">
                    <div className="w-full max-h-[90%] overflow-auto bg-white rounded-lg shadow-lg">
                        <InvoicePreview />
                        <Recipet />
                    </div>
                </div>
            )}
        </div>

    )
}

export default InvoicePage