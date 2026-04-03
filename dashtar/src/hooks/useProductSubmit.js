import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "@/context/SidebarContext";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useProductSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Product data", data)
      const productData = {
        categoryId: data.categoryId,
        category: data.category,
        type: data.type,
        price: data.price,
      };

      const response = id
        ? await ProductServices.updateProduct(id, productData)
        : await ProductServices.addProduct(productData);

      setIsUpdate(true);
      notifySuccess(response.message);
      closeDrawer();
    } catch (err) {
      console.error("Submission Error:", err);
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductData = async () => {
    try {
      const res = await AdminServices.getProductById(id);
      if (res) {
        setValue("productId", res.productId);
        setValue("categoryId", res.categoryId);
        setValue("category", res.category);
        setValue("type", res.type);
        setValue("price", res.price);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("categoryId", 1); 
      setValue("category", "");
      setValue("type", "");
      setValue("price", 0);
      clearErrors();
      return;
    }
    if (id) {
      getProductData();
    }
  }, [id, isDrawerOpen, setValue, clearErrors]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
};

export default useProductSubmit;
