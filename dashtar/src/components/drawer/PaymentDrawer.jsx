import React, { useState, useEffect } from 'react';
import { Card } from "@windmill/react-ui";

import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import Label from "@/components/form/label/Label";
import DrawerButton from "@/components/form/button/DrawerButton";
import usePaySubmit from "@/hooks/usePaySubmit";
import useAsync from '@/hooks/useAsync';
import AdminServices from '@/services/AdminServices';
import { use } from 'react';

const PaymentDrawer = ({ id }) => {
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        setValue,
    } = usePaySubmit(id);

    console.log("payid", id)

    const [paidamt, setPaidamt] = useState(0);
    const [bal, setBal] = useState(0);
    // const [tax, setTax] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [date, setDate] = useState();

    const [paymentData, setPaymentData] = useState([]);

    const handleInputChange = (e, index, field) => {
        const updatedData = [...paymentData];
        updatedData[index][field] = e.target.value;
        setPaymentData(updatedData);

        // Update form values for submission
        setValue(`paymentData[${index}].${field}`, e.target.value);
    };

    useEffect(() => {
        const fetchPaymentData = async () => {
            if (id) {
                const data = await AdminServices.getPaymentById(id);
                console.log("fetch the Invoice data using ID", data);
                if (data) {
                    setPaymentData(data); // Store the payment data array
                    const firstItem = data[0]; // Assuming all items share common company and mobile data
                    setValue("company_name", firstItem.com_name);
                    setValue("mobile", firstItem.mobile);
                }
            }
        };
        fetchPaymentData();
    }, [id]);



    // Calculate Total Amount dynamically when Net Amount, Discount, or Tax changes
    useEffect(() => {
        // const discountedAmount = netAmount - discount;
        // const taxAmount = (discountedAmount * tax) / 100;
        const balance = bal
        const amtbal = balance - paidamt;
        setBal(amtbal)
    }, [bal, paidamt]);

    // useEffect(() => {
    //     const amtbal = totalAmount - paidamt;
    //     const taxAmount = (discountedAmount * tax) / 100;
    //     const finalTotal = discountedAmount + taxAmount;
    //     setPaidamt(amtbal);
    // }, [netAmount, discount, tax]);


    useEffect(() => {
        // setValue("netAmount", netAmount);
        setValue('paidamt', paidamt);
        setValue('bal', bal);
        setValue('date', date);
        // setValue('acc', acc)
        // setValue('acc', acc);
    }, [paidamt, bal, date]);

    // useEffect(() => {
    //     setValue("totalAmount", totalAmount);
    // }, [totalAmount]);



    return (
        <div className="p-5">

            {/* <div className="flex gap-4 mb-6">
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
            </div> */}

            <Card className="border border-slate-300 p-5 w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Company Information */}
                    <div className="grid grid-cols-2 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <div>
                            <Label label="Company Name" />
                            <InputArea
                                required={true}
                                register={register}
                                name="company_name"
                                type="text"
                                placeholder="Enter your name"
                                readOnly
                            />
                            <Error errorName={errors.company_name} />
                        </div>
                        <div>
                            <Label label="Mobile" />
                            <InputArea
                                required={true}
                                register={register}
                                name="mobile"
                                type="text"
                                placeholder="Enter your mobile num"
                                pattern={/^[+]?\d*$/}
                                minLength={6}
                                maxLength={15}
                                readOnly
                            />
                            <Error errorName={errors.mobile} />
                        </div>
                    </div>

                    {/* Dynamic Fields for Each Payment */}
                    {paymentData.map((item, index) => (
                        <div key={item.pay_id} className="grid grid-cols-5 gap-5 mb-5">
                            <div>
                                <Label label="Mode" />
                                <select
                                    value={item.mop}
                                    onChange={(e) => handleInputChange(e, index, 'mop')}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </div>
                            <div>
                                <Label label="Total Amount" />
                                <input
                                    type="number"
                                    value={item.totalPrice.toFixed(2)}
                                    readOnly
                                    className="input bg-gray-100 border border-slate-300 w-full rounded-lg py-3"
                                />
                            </div>
                            <div>
                                <Label label="Paid Amount" />
                                <input
                                    type="number"
                                    value={item.rec_amt}
                                    onChange={(e) => handleInputChange(e, index, 'rec_amt')}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                />
                            </div>
                            <div>
                                <Label label="Balance" />
                                <input
                                    type="number"
                                    // value={(item.totalPrice - item.rec_amt).toFixed(2)}
                                    value={item.bal.toFixed(2)}
                                    readOnly
                                    className="input bg-gray-100 border border-slate-300 w-full rounded-lg py-3"
                                />
                            </div>
                            <div>
                                <Label label="Remark" />
                                <input
                                    type="text"
                                    value={item.remark || ''}
                                    onChange={(e) => handleInputChange(e, index, 'remark')}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                />
                            </div>
                            <div>
                                <Label label="Payment Mode" />
                                <select
                                    value={item.mop}
                                    onChange={(e) => handleInputChange(e, index, 'mop')}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                >
                                    <option value="RTGS">RTGS</option>
                                    <option value="DD">DD</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="MOP">MOP</option>
                                </select>
                            </div>
                            <div>
                                <Label label="Next Due" />
                                <input
                                    type="date"
                                    value={item.nextdue ? new Date(item.nextdue).toLocaleDateString('en-CA') : ''}
                                    onChange={(e) => handleInputChange(e, index, 'nextdue')}
                                    className="input border border-slate-300 w-full rounded-lg py-3"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <DrawerButton id={id} title="Pay" isSubmitting={isSubmitting} />
                </form>
            </Card>
        </div>
    );
};

export default PaymentDrawer;
