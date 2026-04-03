import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { t } from "i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";


const ProductTable = ({ products }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();
  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();

  // const handleClick = (e) => {
  //   const { id, checked } = e.target;
  //   // console.log("id", id, checked);

  //   setIsCheck([...isCheck, id]);
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== id));
  //   }
  // };

  return (
    <>
      {/* {isCheck?.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck?.length < 2 && ( */}
      <MainDrawer>
        <ProductDrawer currency={currency} id={serviceId} />
      </MainDrawer>
      {/* )} */}

      <TableBody>
        {products?.map((product, index) => (
          <TableRow key={product._id || index} className='text-center uppercase'>
            {/* <TableCell>{index + 1}</TableCell> */}
            <TableCell>
              <span>{product.productId || "N/A"}</span>
            </TableCell>
            <TableCell>
              <span>{product.category || "N/A"}</span>
            </TableCell>
            <TableCell>
              <span>{product.type || "N/A"}</span>
            </TableCell>
            <TableCell>
              <span>${product.price?.toFixed(2) || "0.00"}</span>
            </TableCell>
            <TableCell className='text-center'>
              <button
                className="px-3 py-2 bg-red-500 hover:bg-red-600 font-bold border rounded-xl text-white "
              >
                Edit
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </>
  );
};

export default ProductTable;
