import React, { useContext } from 'react';
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ToWords } from 'to-words';
import InvoiceImg from '../../assets/img/logo-invoice.png';
import Signature from '../../assets/img/signature.png';
import { SiWhatsapp } from "react-icons/si";
import { FaPhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { RiGlobalLine } from "react-icons/ri";

import { SidebarContext } from "@/context/SidebarContext";



function InvoicePreview() {
    const { previewData, isPreviewOpen, closePreview } = useContext(SidebarContext);



    if (!isPreviewOpen || !previewData) return null
    console.log("Preview page data", previewData)
    const product = previewData.product
    const taxamt = (previewData.netAmount - previewData.discount) * (previewData.tax / 100);

    const handleDownload = () => {
        const input = document.getElementById("invoice-content");
        // html2canvas(input, {
        //     scale: 2, // Increase rendering resolution
        //     useCORS: true, // Enable CORS for loading external images
        //     scrollX: 0,
        //     scrollY: 0,
        //     windowWidth: input.scrollWidth,
        //     windowHeight: input.scrollHeight,
        // }).then((canvas) => {
        //     const imgData = canvas.toDataURL("image/png");
        //     const pdf = new jsPDF('l', 'mm', 'a4');
        //     pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        //     pdf.save(`invoice_${previewData.q_Id}.pdf`);
        // });
        html2canvas(input, {
            scale: 2,
            useCORS: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${previewData.q_Id}.pdf`);
        });
    };
    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: {
                // can be used to override defaults for the selected locale
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            },
        },
    });
    const totamt = previewData.totalPrice
    const words = toWords.convert(totamt);

    return (
        <div className='bg-gray-200'>
            <div className='text-right mr-5'>
                <button onClick={handleDownload} className="mt-5 px-4 mr-3 py-2 bg-blue-500 text-white rounded">
                    Download PDF
                </button>

                <button onClick={closePreview} className="mt-5 px-4 py-2 bg-gray-500 text-white rounded">
                    close
                </button>
            </div>

            <div className=" p-5 flex items-center justify-center w-full h-full " >

                <div className="bg-white h-[1120px] w-[760px] rounded-lg overflow-auto p-6 " id="invoice-content">
                    {/* Header */}
                    <div className='flex justify-between items-center mb-5'>
                        <img src={InvoiceImg} alt="logo" className="w-2/3 h-full  " />
                        <div className='font-medium text-md '>

                            <span className='flex items-center mb-2'><SiWhatsapp className='text-pink-500 text-lg' />&nbsp;8524979951, 9585529144</span>
                            <span className='flex items-center '><FaPhone className='text-pink-500 text-lg' />&nbsp;0431-359 3402</span>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='p-3 bg-sky-500 w-4/5'></div>
                        <span className='text-3xl font-medium mx-4'> INVOICE </span>
                        <div className='p-3 bg-pink-500 w-1/5'></div>
                    </div>
                    <div className='flex justify-between  mt-3 mb-4'>
                        <div className='font-medium text-md'>
                            <span className='flex items-center mb-2 text-wrap'>Invoice To:&nbsp;<span className='uppercase'>{previewData.com_name}</span></span>
                            <span className='flex items-center mb-2'>{previewData.mobile}</span>
                        </div>
                        <div className='font-medium text-md '>
                            <div className='text-right'>
                                <span className='flex items-center mb-2 font-semibold'>Invoice No:&nbsp;#{previewData.i_Id}</span>
                                <span className='flex items-center mb-2 font-semibold'>Date:&nbsp;{new Date(previewData.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className='border border-sky-500 '>
                        <div className='grid grid-cols-10 text-white font-semibold bg-sky-500 w-auto p-1'>
                            <div className='uppercase '>S No</div>
                            {/* <div className='uppercase  col-span-2'>Category</div> */}
                            <div className='uppercase  col-span-5'>Sub Category</div>
                            <div className='uppercase  col-span-2'>Price</div>
                            <div className='uppercase '>Qty</div>
                            <div className='uppercase '>Total</div>
                        </div>
                        <div className='h-[200px]'>
                            {product.map((data, index) => {
                                const categoryName = data.categoryId === '1' ? 'Product' : data.categoryId === '2' ? 'Service' : 'Other';
                                const ppereach = data.price / data.quantity;
                                return (
                                    <div key={index} className={`grid grid-cols-10 text-black w-auto p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} >
                                        <div className=''>{index + 1}</div>
                                        {/* <div className=' col-span-2'>{categoryName}</div> */}
                                        <div className=' col-span-5'>{data.type}-{categoryName})</div>
                                        <div className=' col-span-2'>Rs. {ppereach.toFixed(2)}</div>
                                        <div className=''>{data.quantity}</div>
                                        <div className='text-right mr-2'>{data.price.toFixed(2)}</div>
                                        {/* <div className=' w-full border border-b-slate-300 mt-2 mb-4 col-span-10'></div> */}
                                    </div>
                                )
                            })}
                        </div>

                        {/* <div className='grid grid-cols-3 text-gray-700 w-auto p-2'>
                            <div></div>
                            <div></div>
                            <div className='grid grid-cols-2 p-2'>

                                <div className='text-left'>Discount:</div>  <div className='text-right'>Rs.{previewData.discount.toFixed(2)}</div>
                                <div className='text-left'>Tax({previewData.tax}%): </div> <div className='text-right'> Rs. {taxamt.toFixed(2)} </div>

                            </div>
                        </div> */}
                    </div>
                    <div className='grid grid-cols-3 text-gray-700'>
                        <div className='mt-12 col-span-2'>
                            <span className='font-semibold text-left'>{words}</span> <br />
                            <span className='text-base mt-3 text-left'>Thanks for Choosing us and for your business !!!</span>
                        </div>
                        <div>
                            <div className=' p-2 grid grid-cols-2'>
                                <div className='text-left'>Discount:</div>
                                <div className='text-right'>
                                    Rs.{(previewData.discount != null ? previewData.discount.toFixed(2) : '00.00')}
                                </div>
                                <div className='text-left'>Tax({previewData.tax != null ? previewData.tax : '0'}%): </div>
                                <div className='text-right'> Rs. {taxamt.toFixed(2)} </div>
                                <span className='text-left'>Subtotal:</span>
                                <span className='text-right'>Rs.{previewData.netAmount.toFixed(2)}</span>
                            </div>
                            <div className='col-span-2 text-center text-white text-lg p-2 font-bold bg-pink-500 mt-4'> Grand Total: Rs.{previewData.totalPrice} </div>
                        </div>
                    </div>
                    {/* footer */}
                    <div className='border border-sky-500 mt-10 mb-5'>
                        <div className='grid grid-cols-3 text-white font-semibold bg-sky-500 w-auto p-1'>
                            <div className='col-span-3'>Paymet Details</div>
                        </div>
                        <div className='grid grid-cols-3 font-semibold w-auto p-3'>
                            <div className=''>
                                <span className='font-bold'>For Cheque Process: </span> <br />
                                <span className='font-medium'>ILIFE TECHNOLOGIES</span> <br />
                                <span className='font-medium'>UPI/GPAY/PHONE PE/PAYTM</span> <br />
                                <span className='font-medium'>8524979951-ILIFE</span>
                            </div>
                            <div className=''>
                                <span className='font-bold'>Bank Details: </span> <br />
                                <span className='font-medium'>AC Name: &nbsp; ILIFE TECHNOLOGIES</span> <br />
                                <span className='font-medium'>A/C No: &nbsp; 1287135000006289</span> <br />
                                <span className='font-medium'>IFSC: &nbsp; KVBL0001287</span> <br />
                            </div>
                            <div className='mt-10'>
                                <span className='font-bold'></span>
                                <span></span>
                                <span className='font-medium'>BANK: &nbsp; KARUR VYSYA BANK(KVB)</span>
                                <span className='font-medium'>BRANCH: &nbsp; TRICHY KK NAGAR</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className=' w-4/6 '></div>
                        <img src={Signature} alt="logo" className="w-20 h-16 text" />
                        <div className=' w-1/6 '></div>
                    </div>

                    <div className='flex justify-center items-center'>
                        <div className='p-1 border-4 border-b-sky-500 border-white  w-4/6 '></div>
                        <div className='border border-b-black border-white w-28'> </div>
                        <div className='p-1 border-4 border-b-pink-500 border-white w-1/6 '></div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className=' w-4/6 '></div>
                        <span>Authorised Sign</span>
                        <div className=' w-1/6 '></div>
                    </div>
                    <div className=' flex p-5'>
                        <span className='flex items-center text-sky-500 mr-10'> <IoMdMail />info@ilifetech.in</span>
                        <span className='flex items-center text-sky-500'> <RiGlobalLine />www.ilifetech.in</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicePreview