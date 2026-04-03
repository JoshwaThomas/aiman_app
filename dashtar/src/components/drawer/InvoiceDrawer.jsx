import React, { useState, useEffect } from 'react';
import { Card } from "@windmill/react-ui";

import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import Label from "@/components/form/label/Label";
import DrawerButton from "@/components/form/button/DrawerButton";
import useInvoiceSubmit from '@/hooks/useInvoiceSubmit';
import useAsync from '@/hooks/useAsync';
import ProductServices from '@/services/ProductServices';
import CustomerServices from '@/services/CustomerServices';
import AdminServices from '@/services/AdminServices';
import { use } from 'react';

const InvoiceDrawer = ({ id }) => {
    const [categoryID, setCategoryID] = useState(2);
    const [catData, setCatdata] = useState();
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        setValue,
    } = useInvoiceSubmit(id);

    const [isExisting, setIsExisting] = useState(false);
    const [customer, setCustomer] = useState();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [productRows, setProductRows] = useState([{ id: 1, price: 0, categoryID: null, catData: [], checkBox: false }]);
    const [netAmount, setNetAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paidamt, setPaidamt] = useState(0);
    const [bal, setBal] = useState(0);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [date, setDate] = useState();
    const [checkBox, setChekBox] = useState('');
    const [acc, setAcc] = useState(0);

    console.log("invoice id Data", id)

    useEffect(() => {
        const QuotationData = async () => {
            if (id) {
                const data = await AdminServices.getInvoiceById(id);
                console.log("fetch the Invoice data using ID", data)
                if (data) {
                    setValue("company_name", data.com_name);
                    setValue("city", data.city);
                    setValue("mobile", data.mobile);
                    setValue("email", data.email);
                    setValue("netAmount", data.netAmount);
                    setValue("discount", data.discount);
                    setValue("tax", data.tax);
                    setValue("totalAmount", data.totalAmount);

                    if (data.product && data.product.length > 0) {
                        const productRowsMapped = data.product.map((prod, index) => ({
                            id: index + 1,
                            category: prod.categoryId,
                            type: prod.type || "",
                            quantity: prod.quantity || 1,
                            price: prod.price || 0,
                        }));
                        setProductRows(productRowsMapped);
                        productRowsMapped.forEach((row, idx) => {
                            setValue(`products[${idx}].type`, row.type);
                            setValue(`products[${idx}].quantity`, row.quantity);
                            setValue(`products[${idx}].price`, row.price);
                        });
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

    const handleTabChange = (tab) => {
        setIsExisting(tab === 'existing');
    };

    const handleCheckBoxChange = (index) => {
        const updatedRows = productRows.map((row, indx) =>
            indx === index ? { ...row, checkBox: !row.checkBox } : row
        );
        setProductRows(updatedRows);
    };

    const handleQuantityChange = (index, value) => {
        if (value === "") {
            const updatedRows = productRows.map((row, indx) =>
                indx === index ? { ...row, quantity: "", price: row.price } : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, "");
            setValue(`products[${index}].price`, 0);
            return;
        }

        const parsedValue = parseFloat(value);

        if (!isNaN(parsedValue) && parsedValue > 0) {
            const updatedRows = productRows.map((row, indx) =>
                indx === index ? { ...row, quantity: parsedValue, price: parsedValue * row.price } : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, parsedValue);
            setValue(`products[${index}].price`, updatedRows[index].price);
        } else if (parsedValue === 0) {
            const updatedRows = productRows.map((row, indx) =>
                indx === index ? { ...row, quantity: 1, price: row.price } : row
            );
            setProductRows(updatedRows);
            setValue(`products[${index}].quantity`, 1);
            setValue(`products[${index}].price`, updatedRows[index].price);
        }
    };

    const handleProductSelect = (e, index) => {
        const type = e.target.value;
        const selectedProduct = catData.find((product) => product.type === type);

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

    const handleAddCategory = () => {
        setProductRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                price: 0,
                regdate: "",
                enddate: "",
                quantity: "",
                remark: "",
                type: "",
                category: "",
                regdate: "",
                enddate: "",
                checkBox: false
            }
        ]);
    };


    useEffect(() => {
        const totalPrice = productRows.reduce((sum, row) => sum + (row.price || 0), 0);
        setNetAmount(totalPrice);
    }, [productRows]);

    useEffect(() => {
        productRows.forEach((row, index) => {
            setValue(`products[${index}].quantity`, row.quantity || 1);  // Ensure quantity is set
            setValue(`products[${index}].price`, row.price || 0);  // Ensure price is set
        });
    }, [productRows, setValue]);

    // Calculate Total Amount dynamically when Net Amount, Discount, or Tax changes
    useEffect(() => {
        const discountedAmount = netAmount - discount;
        const taxAmount = (discountedAmount * tax) / 100;
        const finalTotal = discountedAmount + taxAmount;
        const amtbal = finalTotal - paidamt;
        setTotalAmount(finalTotal);
        setBal(amtbal)
    }, [netAmount, discount, tax, paidamt]);

    // useEffect(() => {
    //     const amtbal = totalAmount - paidamt;
    //     const taxAmount = (discountedAmount * tax) / 100;
    //     const finalTotal = discountedAmount + taxAmount;
    //     setPaidamt(amtbal);
    // }, [netAmount, discount, tax]);

    const handleCategory = (e) => {
        console.log(e.target.value)
        const ID = e.target.value;
        setCategoryID(ID);
        console.log("categoryID", ID)
    }
    useEffect(() => {
        console.log("2categoryID", categoryID)
        if (categoryID) {
            const fetchCategory = async () => {
                try {
                    const data = await ProductServices.getCategoryID(categoryID);
                    setCatdata(data)
                    console.log("Fetched Category Data: ", data);
                } catch (error) {
                    console.error("Error fetching category data: ", error);
                }
            };
            fetchCategory();
        }
    }, [categoryID]);

    const handleRemoveCategory = (index) => {
        const updatedRows = productRows.filter((_, idx) => idx !== index);
        setProductRows(updatedRows);
    };

    useEffect(() => {
        setValue("netAmount", netAmount);
        setValue('paidamt', paidamt);
        setValue('bal', bal);
        setValue('date', date);
        setValue('acc', acc)
        // setValue('acc', acc);
    }, [netAmount, paidamt, bal, date, acc]);
    useEffect(() => {
        setValue("discount", discount);
    }, [discount]);
    useEffect(() => {
        setValue("tax", tax);
    }, [tax]);
    useEffect(() => {
        setValue("totalAmount", totalAmount);
    }, [totalAmount]);



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

            <Card className="border border-slate-300 p-5 w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Company Information */}
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
                                name="city"
                                type="text"
                                value={selectedCustomer?.city || ''}
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
                                value={selectedCustomer?.mobile || ''}
                                placeholder="Enter your mobile num"
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
                                name="email"
                                type="email"
                                value={selectedCustomer?.email || ''}
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
                                <div className='col-span-2'>
                                    <Label label="Specification" />
                                    <select
                                        {...register(`products[${index}].type`, { required: true })}
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                        onChange={(e) => handleProductSelect(e, index)}
                                    >
                                        <option value="">Select</option>
                                        {catData && Array.isArray(catData) ? catData.map((data, idx) => (
                                            <option key={idx} value={data.type}>{data.type}</option>
                                        )) : null}
                                    </select>
                                    <Error errorName={errors?.products?.[index]?.type} />
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
                                        onClick={() => handleRemoveCategory(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                {!row.checkBox && (
                                    <div className='col-span-7 grid grid-cols-5 gap-4'>
                                        <div>
                                            <Label label="Registration" />
                                            <input
                                                type="date"
                                                value={row.regdate}
                                                {...register(`products[${index}].regdate`, { required: true })}
                                                className="input border border-slate-300 w-full rounded-lg py-3"
                                            />
                                            <Error errorName={errors?.products?.[index]?.regdate} />
                                        </div>
                                        <div>
                                            <Label label="Period" />
                                            <input
                                                type="number"
                                                value={row.period}
                                                {...register(`products[${index}].period`, { required: true })}
                                                placeholder="period"
                                                className="input border border-slate-300 w-full rounded-lg py-3"
                                            />
                                            <Error errorName={errors?.products?.[index]?.period} />
                                        </div>
                                        <div>
                                            <Label label="End Date" />
                                            <input
                                                type="date"
                                                value={row.enddate}
                                                {...register(`products[${index}].enddate`, { required: true })}
                                                className="input border border-slate-300 w-full rounded-lg py-3"
                                            />
                                            <Error errorName={errors?.products?.[index]?.enddate} />
                                        </div>
                                        <div className='col-span-2'>
                                            <Label label="End Date" />
                                            <input
                                                type="text"
                                                value={row.reremark}
                                                {...register(`products[${index}].reremark`, { required: true })}
                                                placeholder="Remark"
                                                className="input border border-slate-300 w-full rounded-lg py-3"
                                            />
                                            <Error errorName={errors?.products?.[index]?.reremark} />
                                        </div>
                                    </div>
                                )}
                                <div className=''>
                                    <Label label="Not Need" />
                                    <input
                                        type="checkbox"
                                        checked={row.checkBox}
                                        onChange={() => handleCheckBoxChange(index)}
                                        className="input border border-slate-300 w-full rounded-lg py-3"
                                    />
                                    <Error errorName={errors?.products?.[index]?.reremark} />
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
                    <div className="grid grid-cols-5 gap-5 mb-20">
                        <div>
                            <Label label="Mode" />
                            <select
                                {...register("mop", { required: true })}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                                onChange={(e) => handleProductSelect(e)}
                            >
                                <option value="">Select</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Credit">Credit</option>

                            </select>
                        </div>
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
                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
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

                        <div>
                            <Label label="Paid Amount" />
                            <input
                                type="text"
                                register={register}
                                name="paidamt"
                                value={paidamt || ""}
                                onChange={(e) => setPaidamt(parseFloat(e.target.value) || 0)}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                        <div>
                            <Label label="Balance" />
                            <input
                                type="number"
                                register={register}
                                name="bal"
                                value={bal.toFixed(2)}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                            />
                        </div>
                        <div>
                            <Label label="Remark" />
                            <InputArea
                                register={register}
                                label="Remark"
                                name="remark"
                                type="text"
                                autoComplete="remark"
                            />
                        </div>
                        <div>
                            <Label label="Paymet Type" />
                            <select
                                {...register("paytype", { required: true })}
                                className="input border border-slate-300 w-full rounded-lg py-3"
                                onChange={(e) => handleProductSelect(e)}
                            >
                                <option value="">Select</option>
                                <option value="RTGS">RTGS</option>
                                <option value="DD">DD</option>
                                <option value="Cheque">Cheque</option>
                                <option value="MOP">MOP</option>

                            </select>
                        </div>
                        <div>
                            <Label label="Next Due" />
                            <input
                                type='date'
                                register={register}
                                label="Next Due"
                                name="ndd"
                                onChange={(e) => setDate(e.target.valueAsDate)}
                                className="input border border-slate-300 w-full rounded-lg py-2"
                            />
                        </div>
                    </div>
                    <div className=''>
                        <Label label="Company Profile" />
                        <input
                            type='file'
                            register={register}
                            label="Company Profile"
                            name="img"
                        />
                    </div>
                    <div></div>
                    <div className='text-left mb-32'>
                        <input
                            type='checkbox'
                            register={register}
                            label="Account Show"
                            name="acc"
                            onClick={() => setAcc(1)}
                            value='1'
                        />
                        <Label label="Account Show" />
                    </div>


                    {/* Submit Button */}
                    <DrawerButton id={id} title="Invoice" isSubmitting={isSubmitting} />
                </form>
            </Card>
        </div>
    );
};

export default InvoiceDrawer;
