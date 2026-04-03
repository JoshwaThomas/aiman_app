import React, { useState, useEffect } from 'react';
import { Card } from "@windmill/react-ui";

import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import Label from "@/components/form/label/Label";
import DrawerButton from "@/components/form/button/DrawerButton";
import useQuotationSubmit from '@/hooks/useQuotationSubmit';
import useAsync from '@/hooks/useAsync';
import ProductServices from '@/services/ProductServices';
import CustomerServices from '@/services/CustomerServices';
import AdminServices from '@/services/AdminServices';

const QuotationDrawer = ({ id }) => {
    const [categoryID, setCategoryID] = useState(2);
    const [customer, setCustomer] = useState();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [catData, setCatdata] = useState();
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        setValue
    } = useQuotationSubmit(id);

    const [isExisting, setIsExisting] = useState(false);
    const [productRows, setProductRows] = useState([{ id: 1, price: 0 }]);
    const [netAmount, setNetAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [moveIn, setMoveIn] = useState('0')
    console.log("id Data", id)
    useEffect(() => {
        const QuotationData = async () => {
            if (id) {
                const data = await AdminServices.getQuotationById(id);
                console.log("fetch the Quotation data using ID", data)
                if (data) {
                    const dis = data.discount
                    console.log("dis", dis)
                    setValue("company_name", data.com_name);
                    setValue("city", data.city);
                    setValue("mobile", data.mobile);
                    setValue("email", data.email);
                    setValue("netAmount", data.netAmount);
                    setValue("discount", dis);
                    setValue("tax", data.tax);
                    setValue("totalAmount", data.totalAmount);

                    if (data.product && data.product.length > 0) {
                        const productRowsMapped = data.product.map((prod, index) => ({
                            id: index + 1,
                            category: prod.categoryId,
                            type: prod.type,
                            quantity: prod.quantity || 1,
                            price: prod.price || 0,
                        }));
                        setProductRows(productRowsMapped);
                        productRowsMapped.forEach((row, idx) => {
                            setCategoryID(row.category)
                            setValue(`products[${idx}].category`, row.category)
                            setValue(`products[${idx}].type`, row.type);
                            setValue(`products[${idx}].quantity`, row.quantity);
                            setValue(`products[${idx}].price`, row.price);
                        });
                        // productRowsMapped.forEach((row, idx) => {
                        //     setValue(products[idx].category, row.category);
                        //     setValue(products[idx].type, row.type);
                        //     setValue(products[idx].quantity, row.quantity);
                        //     setValue(products[idx].price, row.price);
                        // });
                    }
                }
            }
        }
        QuotationData();
    }, [id]);


    useEffect(() => {
        const customerData = async () => {
            try {
                const data = await CustomerServices.getCustomer();
                setCustomer(data)
                console.log("Fetched Customer Data: ", data);

            } catch (error) {
                console.error("Error fetching category data: ", error);
            }
        };
        customerData();
    }, []);

    const handleCustomerSelect = (e) => {
        const selectedCustomerId = e.target.value;
        const foundCustomer = customer.find(c => c._id === selectedCustomerId);
        setSelectedCustomer(foundCustomer);

        // Populate the fields with the selected customer's details
        if (foundCustomer) {
            // setValue("company_name", foundCustomer.com_name);
            setValue("city", foundCustomer.city);
            setValue("mobile", foundCustomer.mobile);
            setValue("email", foundCustomer.email);
        }
    };


    const handleAddCategory = () => {
        setProductRows((prev) => [...prev, { id: prev.length + 1, price: 0 }]);
    };

    const handleTabChange = (tab) => {
        setIsExisting(tab === 'existing');
    };


    // const handleQuantityChange = (index, value) => {
    //     const parsedValue = parseFloat(value);

    //     if (parsedValue > 0) { // Only update if the quantity is greater than 0
    //         const updatedRows = productRows.map((row, indx) =>
    //             indx === index
    //                 ? { ...row, quantity: parsedValue === "" ? "" : parsedValue, 
    //                     price: parsedValue * row.price }
    //                 : row
    //         );
    //         setProductRows(updatedRows);
    //     } else if (parsedValue === 0) {
    //         const updatedRows = productRows.map((row, indx) =>
    //             indx === index
    //                 ? { ...row, quantity: 1, price: 1 * row.price }
    //                 : row
    //         );
    //         setProductRows(updatedRows);
    //     }
    // };

    const handleQuantityChange = (index, value) => {
        if (value === "") {
            const updatedRows = productRows.map((row, indx) =>
                indx === index
                    ? { ...row, quantity: "", price: row.price }
                    : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, "");
            return;
        }

        const parsedValue = parseFloat(value);

        if (!isNaN(parsedValue) && parsedValue > 0) {
            const updatedRows = productRows.map((row, indx) =>
                indx === index
                    ? { ...row, quantity: parsedValue, price: parsedValue * row.price }
                    : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, parsedValue);
            setValue(`products[${index}].price`, updatedRows[index].price);
        } else if (parsedValue === 0) {

            const updatedRows = productRows.map((row, indx) =>
                indx === index
                    ? { ...row, quantity: 1, price: 1 * row.price }
                    : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, 1);
            setValue(`products[${index}].price`, updatedRows[index].price);
        }
    };


    useEffect(() => {
        const totalPrice = productRows.reduce((sum, row) => sum + (row.price || 0), 0);
        setNetAmount(parseFloat(totalPrice));
    }, [productRows]);

    useEffect(() => {
        productRows.forEach((row, index) => {
            setValue(`products[${index}].quantity`, row.quantity || 1);
            setValue(`products[${index}].price`, row.price || 0);
            setValue(`products[${index}].remark`, row.remark);
        });
    }, [productRows, setValue]);

    useEffect(() => {
        const discountedAmount = netAmount - discount;
        const taxAmount = (discountedAmount * tax) / 100;
        const finalTotal = discountedAmount + taxAmount;
        setTotalAmount(parseFloat(finalTotal));
    }, [netAmount, discount, tax]);

    const handleCategory = (e) => {
        console.log(e.target.value)
        const ID = e.target.value;
        setCategoryID(ID);
        console.log("categoryID", ID)
    }
    useEffect(() => {
        console.log("2categoryID", categoryID);
        if (categoryID) {
            const fetchCategory = async () => {
                try {
                    const data = await ProductServices.getCategoryID(categoryID);
                    setCatdata(data);
                    console.log("Fetched Category Data: ", data);
                } catch (error) {
                    console.error("Error fetching category data: ", error);
                }
            };
            fetchCategory();
        }
    }, [categoryID]);


    const handleProductSelect = (e, index) => {
        const type = e.target.value;
        console.log("Selected Type:", type);

        const selectedProduct = catData.find((product) => product.type === type);
        console.log("Selected Product:", selectedProduct);

        if (selectedProduct) {
            setProductRows((prev) =>
                prev.map((row, idx) =>
                    idx === index
                        ? { ...row, price: selectedProduct.price, type: selectedProduct.type, quantity: 1 }
                        : row
                )
            );
        }
    };

    const handleMoveInvoice = (e) => {
        const moveInValue = e.target.checked ? '1' : '0';
        setMoveIn(moveInValue);
        setValue("moveIn", moveInValue);
        console.log("moveIn:", moveInValue);
    };

    useEffect(() => {
        setValue("netAmount", netAmount);
    }, [netAmount]);
    useEffect(() => {
        setValue("discount", discount);
        setValue("moveIn", moveIn)
    }, [discount, moveIn]);
    useEffect(() => {
        setValue("tax", tax);
    }, [tax]);
    useEffect(() => {
        setValue("totalAmount", totalAmount);
    }, [totalAmount]);

    console.log("Total Amount", totalAmount)
    console.log("Net Amount", netAmount)
    console.log("Tax", tax)
    console.log("productRows", productRows)
    return (
        <div className="p-5">

            <div className="flex gap-4 mb-6">
                <button
                    type="button"
                    className={`px-4 py-2 rounded ${!isExisting ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleTabChange('new')}
                >
                    New Customer
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 rounded ${isExisting ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleTabChange('existing')}
                >
                    Existing Customer
                </button>
            </div>


            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="border border-slate-300 p-5 w-full">

                    <div className="grid grid-cols-2 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <div>
                            <Label label="Company Name" />
                            {isExisting ? (
                                <select
                                    {...register('company_name', { required: true })}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                    onChange={handleCustomerSelect}
                                >
                                    {customer && customer.map((customerData) => (
                                        <option key={customerData._id} value={customerData._id}>
                                            {customerData.com_name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <InputArea
                                    required={true}
                                    register={register}
                                    name="company_name"
                                    type="text"
                                    placeholder="Enter your name"
                                />
                            )}
                            <Error errorName={errors.company_name} />
                        </div>
                        <div>
                            <Label label="city" />
                            <InputArea
                                required={true}
                                register={register}
                                value={selectedCustomer?.city || ''}
                                name="city"
                                type="text"
                                placeholder="Enter your city"
                            />
                            <Error errorName={errors.place} />
                        </div>
                        <div>
                            <Label label="Mobile" />
                            <InputArea
                                required={true}
                                register={register}
                                name="mobile"
                                type="text"
                                placeholder="Enter your mobile num"
                                value={selectedCustomer?.mobile || ''}
                                pattern={/^[+]?\d*$/}
                                minLength={6}
                                maxLength={15}
                            />
                            <Error errorName={errors.mobile} />
                        </div>
                        <div>
                            <Label label="Email" />
                            <InputArea
                                required={true}
                                register={register}
                                value={selectedCustomer?.email || ''}
                                name="email"
                                type="email"
                                placeholder="Enter Mail Id"
                            />
                            <Error errorName={errors.email} />
                        </div>
                    </div>

                    {/* Product/Service Details */}
                    <div className="mb-6">
                        <Label label="Product/Service Details" />
                        {productRows.map((row, index) => (
                            <div key={row.id} className="grid grid-cols-8 gap-4 mb-4">
                                <div>
                                    <Label label="Category" />
                                    <select
                                        {...register(`products[${index}].category`, { required: true })}
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                        value={categoryID}
                                        onChange={(e) => handleCategory(e)}
                                    >
                                        <option value="">Select</option>
                                        <option value="2">Service</option>
                                        <option value="1">Product</option>
                                    </select>
                                    <Error errorName={errors?.products?.[index]?.category} />
                                </div>
                                <div className=' col-span-2'>
                                    <Label label="Specification" />
                                    <select
                                        {...register(`products[${index}].type`, { required: true })}
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                        onChange={(e) => handleProductSelect(e, index)}
                                    >
                                        <option value="">Select</option>
                                        {catData && Array.isArray(catData) ? catData.map((data, idx) => (
                                            <option key={idx} value={data.type}>
                                                {data.type}
                                            </option>
                                        )) : null}
                                    </select>
                                    <Error errorName={errors?.products?.[index]?.name} />
                                </div>
                                <div>
                                    <Label label="Quantity" />
                                    <input
                                        type="number"
                                        value={row.quantity || ""}
                                        {...register(`products[${index}].quantity`, { required: true })}
                                        onChange={(e) => handleQuantityChange(index, e.target.value || '')}
                                        placeholder="Quantity"
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                    />
                                    <Error errorName={errors?.products?.[index]?.quantity} />
                                </div>
                                <div>
                                    <Label label="Price" />
                                    <input
                                        type="number"
                                        value={row.price || 0}
                                        {...register(`products[${index}].price`)}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        placeholder="Price"
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                        readOnly
                                    />
                                </div>
                                <div className=' col-span-2'>
                                    <Label label="Remark" />
                                    <input
                                        type="textarea"
                                        value={row.remark}
                                        {...register(`products[${index}].remark`)}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        placeholder="Remark"
                                        className="input border border-slate-300 w-full text-wrap rounded-lg py-3"
                                    />
                                </div>
                                <div className="flex items-end text-right ">
                                    <button
                                        type="button"
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() =>
                                            setProductRows((prev) => prev.filter((_, idx) => idx !== index))
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mb-6">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleAddCategory}
                        >
                            + Add Category
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-5 ">
                        <div>
                            <Label label="Net Amount" />
                            <input
                                type="text"
                                {...register("netAmount")}
                                name="netAmount"
                                value={netAmount.toFixed(2)}
                                readOnly
                                className="input border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                        <div>
                            <Label label="Discount" />
                            <input
                                type="number"
                                {...register("discount")}
                                name="discount"
                                value={discount || ""}
                                onChange={(e) => { setDiscount(parseFloat(e.target.value) || 0); }}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                        <div>
                            <Label label="Tax (%)" />
                            <input
                                type="number"
                                {...register("tax")}
                                name="tax"
                                value={tax}
                                // onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                onChange={(e) => {
                                    const taxValue = parseFloat(e.target.value) || 0;
                                    setTax(taxValue);
                                    setValue("tax", taxValue);
                                }}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                        <div>
                            <Label label="Total Amount" />
                            <input
                                type="text"
                                {...register("totalAmount")}
                                name="totalAmount"
                                value={totalAmount.toFixed(2)}
                                readOnly
                                className="input bg-gray-100 border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                    </div>
                    <div className='mb-20  w-40 flex mt-3'>
                        <Label label="If Move to Invoice" />

                        <input
                            type="checkbox"
                            {...register("moveIn")}
                            name="moveIn"
                            checked={moveIn === '1'}
                            onChange={handleMoveInvoice}
                            className="input ml-5 scale-150"
                        />
                    </div>

                    {/* Submit Button */}
                    <DrawerButton id={id} title="Quotation" isSubmitting={isSubmitting} className='mb-20' />
                </Card>
            </form>
        </div>
    );
};

export default QuotationDrawer;
