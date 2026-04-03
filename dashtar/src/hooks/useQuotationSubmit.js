import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useLocation } from "react-router";

// Internal imports
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";


const useQuotationSubmit = (id) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  // const navigate = useNavigate();
  const { openPreview } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleRemoveEmptyKey = (obj) => {
    for (const key in obj) {
      if (obj[key].trim() === "") {
        delete obj[key];
      }
    }
    return obj;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Quotation Submitted", data);

      let QuotationData = {
        // customerType: data.customerType,
        company_name: data.company_name,
        email: data.email,
        mobile: data.mobile,
        // alternateMobile: data.alternateMobile,
        city: data.city,
        // category: data.products.category,
        // type: data.products.type,
        // quantity: data.products.quantity,
        // price: data.products.price,
        products: data.products.map((product) => ({
            category: product.category,
            type: product.type,
            quantity: product.quantity,
            price: product.price,
            remark: product.remark,
          })),
          netAmount: data.netAmount,
          discount: data.discount,
          tax: data.tax,
          totalAmount: data.totalAmount,
          remarks: data.remarks,
          moveIn: data.moveIn
      };

      console.log("Quotation Data", QuotationData);
      
      const res = id
        ? await AdminServices.updateQuotation(id, QuotationData)
        : await AdminServices.addQuotation(QuotationData);
      console.log('res',res)
      setIsUpdate(true);
      notifySuccess(res.message);
      QuotationData = res.savedData
      openPreview(QuotationData)
      closeDrawer();
    } catch (err) {
      console.error("Submission Error:", err);
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuotationData = async () => {
    try {
      const res = await AdminServices.getQuotationById(id, {
        email: adminInfo.email,
      });
      if (res) {
        setResData(res);
        setValue("customerName", res.customerName);
        setValue("contactPerson", res.contactPerson);
        setValue("mobile", res.mobile);
        setValue("alternateMobile", res.alternateMobile);
        setValue("city", res.city);
        setValue("products", res.products);
        setValue("discount", res.discount);
        setValue("tax", res.tax);
        setValue("totalAmount", res.totalAmount);
        setValue("remarks", res.remarks);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("customerName");
      setValue("contactPerson");
      setValue("mobile");
      setValue("alternateMobile");
      setValue("city");
      setValue("products");
      setValue("discount");
      setValue("tax");
      setValue("totalAmount");
      setValue("remarks");
      return;
    }
    if (id) {
      getQuotationData();
    }
  }, [id, isDrawerOpen, setValue, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-quotation" && Cookies.get("adminInfo")) {
      getQuotationData();
    }
  }, [location.pathname]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    setValue,
  };
};

export default useQuotationSubmit;