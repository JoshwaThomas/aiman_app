import React, {useState} from 'react';
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";

import useAsync from "@/hooks/useAsync";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import DrawerButton from "@/components/form/button/DrawerButton";
import InputArea from "@/components/form/input/InputArea";
import Label from "@/components/form/label/Label";
import useEnqirySubmit from '@/hooks/useEnquirySubmit';
import ProductServices from "@/services/ProductServices";
import CheckBox from '../form/input/CheckBox';

const EnquiryDrawer = ({ id }) => {
    
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        handleSelectLanguage,
    } = useEnqirySubmit(id, selectedProducts, selectedServices);

    const { data, loading, error } = useAsync(() =>
        ProductServices.getAllProducts()
    );

    const handleProductSelection = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSelectedProducts((prev) => [...prev, value]); 
            console.log("selectedProducts",selectedProducts)
        } else {
            setSelectedProducts(selectedProducts.filter(productId => productId !== e.target.value));
        }
    };

    const handleServiceSelection = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSelectedServices((prev) => [...prev, value]);
            console.log("selectedServices",selectedServices)
        } else {
            setSelectedServices(selectedServices.filter(serviceId => serviceId !== e.target.value));
        }
    };
    const product = data.filter((items) => items.categoryId === 1);
    const service = data.filter((items) => items.categoryId === 2);
    return (
        <div className='p-5'>
            {/* <div>EnquiryDrawer</div> */}
            {id ? (
                <Title
                    register={register}
                    handleSelectLanguage={handleSelectLanguage}
                    title="Enquiry"
                    description="UpdateStaffdescription"
                />
            ) : (
                <Title
                    register={register}
                    handleSelectLanguage={handleSelectLanguage}
                    title="Enquiry "
                // description="AddStaffdescription"
                />
            )}

            <Card className="overflow-y-scroll border border-slate-300 mt-5 p-2 flex-grow scrollbar-hide w-full max-h-full">
                <form onSubmit={handleSubmit(onSubmit)} className=' mb-28'>
                    <div className="grid grid-cols-3  md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <div>
                            <Label label="Company Name" />
                            <InputArea
                                required={true}
                                register={register}
                                label="Company Name"
                                name="com_name"
                                type="text"
                                autoComplete="com_name"
                                placeholder="Enter Company Name"
                            />
                            <Error errorName={errors.com_name} />
                        </div>
                        <div>
                            <Label label="Contact Person" />
                            <InputArea
                                required={true}
                                register={register}
                                label="Contact Person"
                                name="con_person"
                                type="text"
                                autoComplete="con_person"
                                placeholder="Enter Contact Person"
                            />
                            <Error errorName={errors.con_person} />
                        </div>
                        <div>
                            <Label label="Email" />
                            <InputArea
                                required={true}
                                register={register}
                                label="Email"
                                name="email"
                                type="text"
                                pattern={
                                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                                }
                                autoComplete="email"
                                placeholder="Enter Company Email"
                            />
                            <Error errorName={errors.email} />
                        </div>
                        <div>
                            <Label label="Mobile" />
                            <InputArea
                                required={true}
                                register={register}
                                label="Mobile"
                                name="mobile"
                                type="text"
                                pattern={/^[+]?\d*$/}
                                minLength={6}
                                maxLength={10}
                                autoComplete="mobile"
                                placeholder="Enter Mobile No."
                            />
                            <Error errorName={errors.mobile} />
                        </div>
                        <div>
                            <Label label="Alter Mobile" />
                            <InputArea
                                required={true}
                                register={register}
                                label="Alter Mobile"
                                name="alter_mobile"
                                type="text"
                                pattern={/^[+]?\d*$/}
                                minLength={6}
                                maxLength={10}
                                autoComplete="alter_mobile"
                                placeholder="Enter Alter Mobile"
                            />
                            <Error errorName={errors.alter_mobile} />
                        </div>
                        <div>
                            <Label label="City" />
                            <InputArea
                                required={true}
                                register={register}
                                label="City"
                                name="city"
                                type="text"
                                autoComplete="city"
                                placeholder="Enter Your City"
                            />
                            <Error errorName={errors.city} />
                        </div>

                    </div>
                    <div className="grid grid-cols-2  md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <div>
                            <Label label="Product" />
                            <div>
                                {product.map((items, index) => (
                                    <div key={index}>
                                        <input
                                            register={register}
                                            id={`product-${items.productId}`}
                                            label="Product"
                                            name="product"
                                            type="checkbox"
                                            value={items.productId}
                                            onChange={handleProductSelection} 
                                        />
                                        <label htmlFor={`product-${items.productId}`} className="ml-2">
                                            {items.type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label label="Service" />
                            <div>
                                {service.map((items, index) => (
                                    <div key={index}>
                                        <input
                                            register={register}
                                            id={`service-${items.productId}`}
                                            label="Service"
                                            name="service"
                                            type="checkbox"
                                            value={items.productId}
                                            onChange={handleServiceSelection} 
                                        />
                                        <label htmlFor={`service-${items.productId}`} className="ml-2">
                                            {items.type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                        <Error errorName={errors.com_name} />
                    </div>
                    <DrawerButton id={id} title="Enquiry" isSubmitting={isSubmitting} />
                </form>
            </Card>
        </div>

    )
}

export default EnquiryDrawer