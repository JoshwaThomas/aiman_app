import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useEnqirySubmit = (id, selectedProducts, selectedServices) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);

  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  // const { handlerTextTranslateHandler } = useTranslationValue();

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
    // console.log("obj", obj);
    return obj;
  };

  const onSubmit = async (data) => {
    try {
        console.log("Triggered the fuction", data)
        console.log("Selected Products:", selectedProducts);
        console.log("Selected Services:", selectedServices);

      setIsSubmitting(true);
      const EnquiryData = {
        com_name: data.com_name,
        email: data.email,
        con_person: data.con_person,
        mobile: data.mobile,
        alter_mobile: data.alter_mobile,
        city: data.city,
        services: selectedServices,
        products: selectedProducts,
        remark: data.remark
      };
      console.log("EnquiryData",EnquiryData)
      const res = id
        ? await AdminServices.updateStaff(id, EnquiryData)
        : await AdminServices.addEnquiry(EnquiryData);
  
      setIsUpdate(true);
      notifySuccess(res.message);
      closeDrawer();
    } catch (err) {
      console.error("Submission Error:", err);
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnquiryData = async () => {
    try {
      const res = await AdminServices.getStaffById(id, {
        email: adminInfo.email,
      });
      if (res) {
        setResData(res);
        setValue("name", res.name[language ? language : "en"]);
        setValue("email", res.email);
        setValue("password");
        setValue("phone", res.phone);
        setValue("role", res.role);
        setSelectedDate(dayjs(res.joiningData).format("YYYY-MM-DD"));
        setImageUrl(res.image);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("com_name");
      setValue("con_person");
      setValue("email");
      setValue("mobile");
      setValue("alter_mobile");
      setValue("city");
      return;
    }
    if (id) {
      getEnquiryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getEnquiryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useEnqirySubmit;
