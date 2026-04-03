import React, { useContext } from 'react'
import { FaEye } from "react-icons/fa";
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
import useToggleDrawer from '@/hooks/useToggleDrawer';

function Renewal() {
    // const { t } = useTranslation();
    // const {searchRef} = useContext(SidebarContext);
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { toggleDrawer, openPreview, closePreview, previewData, isPreviewOpen } = useContext(SidebarContext);
    const { data, loading, error } = useAsync(() =>
        AdminServices.getAllInvoice({ email: adminInfo.email })
    );
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
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

    const currentDate = new Date();


    const filteredData = dataTable
        ?.filter((item) =>
            item.product.some((product) => product.regdate)
        )
        .map((item) => ({
            ...item,
            validateDays: item.product.map((product) => {
                const endDate = new Date(product.enddate);
                return Math.max(0, Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)));
            })[0],
        }));


    const handlePreview = (quotation) => {
        openPreview(quotation);
        console.log("Preview Data Set:", quotation);
    };

    // console.log("dataTable", dataTable)

    return (
        <div className='p-2'>
            {/* <PageTitle className='text-3xl font-'>Enquiry List</PageTitle> */}
            <div className='flex flex-row justify-between'>
                <div className='text-3xl font-bold my-3'>Renewal List</div>

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
                                            <TableCell>Date</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Product </TableCell>
                                            <TableCell>Reg Date</TableCell>
                                            <TableCell>Validate</TableCell>
                                            <TableCell>Action</TableCell>
                                        </tr>
                                    </TableHeader>
                                    {/* <EnquiryTable enquirys={dataTable} /> */}
                                    <TableBody className='border border-sky-500 '>
                                        {filteredData?.sort((a, b) => a.validateDays - b.validateDays).map((data) => (
                                            <TableRow key={data._id}>
                                                <TableCell>{data.i_Id}</TableCell>
                                                <TableCell>{new Date(data.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{data.com_name}</TableCell>
                                                <TableCell>{data.product[0]?.type}</TableCell>
                                                <TableCell>
                                                    {new Date(data.product[0]?.regdate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className={
                                                    data.validateDays < 30
                                                        ? 'text-red-500'  
                                                        : data.validateDays < 60
                                                            ? 'text-yellow-500' 
                                                            : 'text-green-500' 
                                                }
                                                >{data.validateDays} days</TableCell>
                                                <TableCell>
                                                    <button onClick={() => handlePreview(data)}>
                                                        <FaEye className="text-xl" />
                                                    </button>
                                                    <EditDeleteButton
                                                        title={data.com_name}
                                                        id={data._id}
                                                        handleUpdate={() => { }}
                                                        handleModalOpen={() => { }}
                                                    />
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

            {isPreviewOpen && (
                <div className="fixed top-0 left-0 w-4/5 ml-64 mt-5 h-full z-50 flex justify-center items-center">
                    <div className="w-full max-h-[90%] overflow-auto bg-white rounded-lg shadow-lg">
                        <InvoicePreview />
                    </div>
                </div>
            )}

        </div>

    )
}

export default Renewal