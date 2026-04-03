import React from "react";
import { Button } from "@windmill/react-ui";
import InputArea from "@/components/form/input/InputArea";
import Label from "@/components/form/label/Label";
import Error from "@/components/form/others/Error";
import useProductSubmit from "@/hooks/useProductSubmit";

const ProductDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, watch, isSubmitting } = useProductSubmit(id);


  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        {id ? "Update Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          {/* <Label label="Product ID" />
          <InputArea
            required={true}
            register={register}
            name="productId"
            type="text"
            placeholder="Enter Product ID"
          />
          <Error errorName={errors.productId} /> */}
        </div>

        <div className="mb-4">
          <Label label="Category" />
          <div className="flex space-x-4">
            <input
              type="radio"
              name="categoryId"
              value={1}
              // checked={watch("categoryId") === 1}
              onChange={() => setValue("categoryId", 1)}
              className={`w-full ("categoryId") === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            />
            Product
            <input
              type="radio"
              name="categoryId"
              value={2}
              // checked={watch("categoryId") === 2}
              onChange={() => setValue("categoryId", 2)}
              className={`w-full ("categoryId") === 2 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            />
            Service
          </div>
        </div>

        <div className="mb-4">
          <Label label="Type" />
          <InputArea
            required={true}
            register={register}
            name="type"
            type="text"
            placeholder="Enter Type"
          />
          <Error errorName={errors.type} />
        </div>

        <div className="mb-4">
          <Label label="Price" />
          <InputArea
            required={true}
            register={register}
            name="price"
            type="number"
            placeholder="Enter Price"
          />
          <Error errorName={errors.price} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 text-white" disabled={isSubmitting}>
            {id ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ProductDrawer);
