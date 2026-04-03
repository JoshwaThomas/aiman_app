import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Button,
  Card,
  CardBody,
  Pagination,
  Input,
  Select,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

import useFilter from "@/hooks/useFilter";
import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer"
import ProductTable from "@/components/product/ProductTable";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import { SidebarContext } from "@/context/SidebarContext";
import { AdminContext } from "@/context/AdminContext";

const Products = () => {
  const { t } = useTranslation();
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const {
    lang,
    currentPage,
    handleChangePage,
    searchText,
    category,
    setCategory,
    searchRef,
    handleSubmitForAll,
    sortedField,
    setSortedField,
    limitData,
    toggleDrawer
  } = useContext(SidebarContext);
  // const { title, allId, serviceId, handleDeleteMany, handleUpdateMany } = useToggleDrawer();

  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllProducts({ email: adminInfo.email })
  );
  const {dataTable} = useFilter(data);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await ProductServices.getAllProducts({
  //         page: currentPage,
  //         limit: limitData,
  //         category,
  //         title: searchText,
  //         price: sortedField,
  //       });
  //       console.log("response@product: ",response)
  //       setData(response);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [currentPage, limitData, category, searchText, sortedField]);

  // Reset filters
  const handleResetField = () => {
    setCategory("");
    setSortedField("");
    searchRef.current.value = "";
  };
  // console.log("data-product-page", data)

  return (
    <>
      <PageTitle>{t("ProductsPage")}</PageTitle>
      <MainDrawer>
        <ProductDrawer />
      </MainDrawer>

      <div className='flex flex-row justify-between'>
        <div className='text-3xl font-bold my-3'>Product List</div>
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

      <Card>
        {/* <CardBody>
          <form onSubmit={handleSubmitForAll} className="grid gap-4 md:flex">
            <Input
              ref={searchRef}
              type="search"
              name="search"
              placeholder={t("SearchProduct")}
              className="w-full"
            />
            <Select
              onChange={(e) => setSortedField(e.target.value)}
              className="w-full"
            >
              <option value="">{t("SortBy")}</option>
              <option value="low">{t("LowtoHigh")}</option>
              <option value="high">{t("HightoLow")}</option>
            </Select>
            <Button type="submit">{t("Filter")}</Button>
            <Button type="reset" layout="outline" onClick={handleResetField}>
              {t("Reset")}
            </Button>
          </form>
        </CardBody> */}
      </Card>

      
        <TableContainer>
          <Table>
            <TableHeader>
              <tr className='bg-sky-500 text-lg font-bold text-white text-center'>
                {/* <TableCell>S. No.</TableCell> */}
                <TableCell>PRODUCT ID</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>PRODUCT NAME</TableCell>
                <TableCell>PRICE</TableCell>
                <TableCell>STATUS</TableCell>
              </tr>
            </TableHeader>
            <ProductTable products={dataTable} />
          </Table>
          <TableFooter>
            {/* <Pagination
              totalResults={data.totalDoc}
              resultsPerPage={limitData}
              onChange={handleChangePage}
              label="Page navigation"
            /> */}
          </TableFooter>
        </TableContainer>
      {/* ) : (
        <NotFound title="Products" />
      )} */}
    </>
  );
};

export default Products;