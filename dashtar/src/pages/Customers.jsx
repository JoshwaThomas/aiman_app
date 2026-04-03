import {
  Card,
  Button,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

//internal import
import UploadMany from "@/components/common/UploadMany";
import CustomerTable from "@/components/customer/CustomerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import CustomerServices from "@/services/CustomerServices";
import { SidebarContext } from "@/context/SidebarContext";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";

const Customers = () => {
  const { data, loading, error } = useAsync(CustomerServices.getAllCustomers);

  // console.log('customer',data)

  const {
    userRef,
    dataTable,
    serviceData,
    filename,
    isDisabled,
    setSearchUser,
    totalResults,
    resultsPerPage,
    handleSubmitUser,
    handleSelectFile,
    handleChangePage,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);
  const {
    toggleDrawer
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const handleResetField = () => {
    setSearchUser("");
    userRef.current.value = "";
  };

  return (
    <>
      <PageTitle>{t("CustomersPage")}</PageTitle>

      <MainDrawer>
        <CustomerDrawer />
      </MainDrawer>

      <div className='flex flex-row justify-between'>
        <div className='text-3xl font-bold my-3'>Customer List</div>
        <div className=''>
          <Button
            // layout="outline"
            onClick={toggleDrawer}
            className="px-4 md:py-1 py-2 h-12 text-sm m-2 bg-green-600 hover:bg-green-700 dark:bg-gray-700"
          >
            <span className="text-white font-bold dark:text-gray-200">Add Product</span>
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
      <AnimatedContent>

        <form
          onSubmit={handleSubmitUser}
          className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
        >
          {/* <div className="items-center">
                <UploadMany
                  title="Customers"
                  exportData={data}
                  filename={filename}
                  isDisabled={isDisabled}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                />
              </div> */}

        </form>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            <form
              onSubmit={handleSubmitUser}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <input
                  ref={userRef}
                  type="search"
                  name="search"
                  className="w-56 border border-gray-300 rounded-md p-3"
                  placeholder={t("CustomersPageSearchPlaceholder")}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>
              {/* <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-emerald-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full mx-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div> */}
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="">
          <Table>
            <TableHeader>
              <tr className='bg-sky-500 text-lg font-bold text-white text-center'>
                <TableCell>{t("CustomersId")}</TableCell>
                <TableCell>{t("CustomersJoiningDate")}</TableCell>
                <TableCell>{t("CustomersName")}</TableCell>
                <TableCell>{t("CustomersEmail")}</TableCell>
                <TableCell>{t("CustomersPhone")}</TableCell>
                <TableCell className="text-right">
                  {t("CustomersActions")}
                </TableCell>
              </tr>
            </TableHeader>
            <CustomerTable customers={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no customers right now." />
      )}
    </>
  );
};

export default Customers;
