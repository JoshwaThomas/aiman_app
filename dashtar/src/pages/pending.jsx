import React, { useContext, useState } from 'react'
import {
    Table,
    TableHeader,
    TableCell,
    TableFooter,
    TableContainer,
    Select,
    Input,
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
import EnquiryDrawer from '@/components/drawer/EnquiryDrawer';
import { SidebarContext } from "@/context/SidebarContext";
import EnquiryTable from '@/components/enquiry/EnquiryTable';
import useFilter from "@/hooks/useFilter";

function Pending() {
    // const { t } = useTranslation();
    // const {searchRef} = useContext(SidebarContext);
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { toggleDrawer } = useContext(SidebarContext);
    const [searchQuery, setSearchQuery] = useState("");
    const { data, loading, error } = useAsync(() =>
        AdminServices.getAllEnquiry({ email: adminInfo.email })
    );

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

    const [deleteModel, setDeleteModel] = useState(false)
    const [deleteData, setDeleteData] = useState([])
    const [show, setShow] = useState(false)

    const handleDetails = (enquiry) => {
        setDeleteData(enquiry)
        console.log("show", enquiry)
        setShow(true)
    }

    const handleDelete = (enquiry) => {
        console.log("Delete user", enquiry)
        setDeleteData(enquiry)
        setDeleteModel(true)
    }
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = dataTable.filter((enquiry) => {
        const companyName = enquiry.com_name.toLowerCase();
        const searchQueryLower = searchQuery.toLowerCase();

        return companyName.includes(searchQueryLower);
    });

    

    console.log("pending data", data)

    return (
        <div className='p-2'>
            {/* <PageTitle className='text-3xl font-'>Enquiry List</PageTitle> */}
            <MainDrawer>
                <EnquiryDrawer />
            </MainDrawer>
            <div className='flex flex-row justify-between'>
                <div className='text-3xl font-bold my-3'>Enquiry List</div>
                <div className=''>
                    <Button
                        // layout="outline"
                        onClick={toggleDrawer}
                        className="px-4 md:py-1 py-2 h-12 text-sm m-2 bg-green-600 hover:bg-green-700 dark:bg-gray-700"
                    >
                        <span className="text-white font-bold dark:text-gray-200">Add Enquiry</span>
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
                                placeholder="Search by Company Name"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-56 border border-gray-300 rounded-md p-3"
                            />
                            <div className='w-30 flex flex-row'>
                                <label htmlFor="nofpage">Per Page</label>
                                <Select onChange={(e) => setSortedField(e.target.value)} name='nofpage' className="">
                                    <option value="05" defaultValue>05</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                </Select>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <TableContainer className="mb-8 rounded-b-lg border border-sky-500">
                                <Table>
                                    <TableHeader>
                                        <tr className='bg-sky-500 text-lg font-bold border border-sky-500  text-white text-center capitalize'>
                                            <TableCell>DATE</TableCell>
                                            <TableCell>COMPANY</TableCell>
                                            <TableCell>MOBILE</TableCell>
                                            <TableCell>PARTICULARS</TableCell>
                                            <TableCell>ACTION</TableCell>
                                            <TableCell>STATUS</TableCell>
                                        </tr>
                                    </TableHeader>
                                    <EnquiryTable
                                        enquirys={filteredData}
                                        deleteModel={deleteModel}
                                        deleteData={deleteData}
                                        adminInfo={adminInfo}
                                        show={show}
                                        setDeleteModel={setDeleteModel}
                                        handleDelete={handleDelete}
                                        handleDetails={handleDetails}
                                        setShow={setShow}
                                    />
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
        </div>

    )
}

export default Pending