import React, { useContext, useEffect } from 'react';
import { SidebarContext } from "@/context/SidebarContext";
import InvoiceImg from '../../assets/img/logo-invoice.png';
import Signature from '../../assets/img/signature.png';
import { SiWhatsapp } from "react-icons/si";
import { FaPhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { RiGlobalLine } from "react-icons/ri";

function Recipet() {
    const { previewPayData, isPreviewPayOpen, closePayPreview } = useContext(SidebarContext);
    if (!isPreviewPayOpen || !previewPayData) return null
    console.log("Preview page data", previewPayData)
    const id = previewPayData.i_Id
    console.log("recipet id", id)
    useEffect(() => {
        const QuotationData = async () => {
            if (id) {
                const data = await AdminServices.getInvoiceById(id);
                console.log("fetch the Invoice data using ID", data)
            }
        }
        QuotationData();
    }, [id]);



    // const lastPayment = (previewPayData && Array.isArray(previewPayData) && previewPayData.length > 0)
    //     ? previewPayData[previewPayData.length - 1]  // Get the last payment from the array
    //     : null;

    // if (!lastPayment) {
    //     return <div>No payment data available</div>;  // Fallback when there's no payment data
    // }

    // const lastBalance = lastPayment ? lastPayment.bal : null;

    const totalamtrec = Array.isArray(previewPayData) ? previewPayData.reduce((sum, user) => sum + (user.rec_amt || 0), 0) : 0;

    // const grandtot = totalamtrec + lastBalance;
    return (
        <div className='bg-gray-200'>
            <div className='text-right mr-5'>
                <button
                    // onClick={handleDownload} 
                    // onClick={() => toPDF()}
                    className="mt-5 px-4 mr-3 py-2 bg-blue-500 text-white rounded">
                    Download PDF
                </button>

                <button onClick={closePayPreview} className="mt-5 px-4 py-2 bg-gray-500 text-white rounded">
                    close
                </button>
            </div>

            <div className=" p-5 flex items-center justify-center w-full h-full " >

                <div className="bg-white h-[600px] w-[800px] rounded-lg overflow-auto p-6 " id="invoice-content" >
                    {/* Header */}
                    <div className='flex justify-between items-center mb-'>
                        <img src={InvoiceImg} alt="logo" className="w-2/4 h-full " />
                        <div className='font-medium text-md '>

                            <span className='flex items-center mb-2'><SiWhatsapp className='text-pink-500 text-lg' />&nbsp;8524979951, 9585529144</span>
                            <span className='flex items-center '><FaPhone className='text-pink-500 text-lg' />&nbsp;0431-359 3402</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="flex-1 h-8 bg-sky-500"></div>
                        <div className="px-4 text-2xl font-bold text-center">Recipet</div>
                        <div className="w-12 h-8 bg-pink-500"></div>
                    </div>
                    <div className='flex justify-between  mt-3 mb-4'>
                        <div className='font-medium text-md'>
                            {/* <span className='flex items-center mb-2 '>Recipet To:&nbsp;<span className='uppercase'>{lastPayment.com_name}</span></span>
                            <span className='flex items-center mb-2'>{lastPayment.mobile}</span> */}
                        </div>
                        <div className='font-medium text-md '>
                            {/* <div className='text-right'>
                                <span className='flex items-center mb-2 font-semibold'>Recipet No:&nbsp;#{previewPayData.pay_id}</span>
                                <span className='flex items-center mb-2 font-semibold'>Date:&nbsp;{new Date(previewPayData.dop).toLocaleDateString()}</span>
                            </div> */}
                        </div>
                    </div>
                    <div className='border border-sky-500 mt-5'>
                        <div className='grid grid-cols-4 text-white font-semibold bg-sky-500 w-auto p-1'>
                            <div className='uppercase '>S No</div>
                            <div className='uppercase '>Date</div>
                            <div className='uppercase '>Payment ID</div>
                            <div className='uppercase  '>Amount</div>
                            {/* <div className='uppercase  col-span-2'>Price</div>
                                <div className='uppercase '>Qty</div>
                                <div className='uppercase '>Total</div> */}
                        </div>
                        <div className=''>
                            {previewPayData.map((data, index) => {
                                return (
                                    <div key={index} className={`grid grid-cols-4 text-black w-auto p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} >
                                        <div className=''>{index + 1}</div>
                                        <div className=''>{new Date(data.dop).toLocaleDateString()}</div>
                                        <div className=''>{data.pay_id}</div>
                                        <div className='text-right'>{data.rec_amt.toFixed(2)}</div>
                                    </div>
                                )
                            }
                            )}

                        </div>
                    </div>
                    <div className='grid grid-cols-5 text-black w-auto p-2'>
                        <div className='flex items-end col-span-3'> </div>
                        <div className='grid grid-cols-2 p-2 col-span-2'>
                            <div className='text-left'>Subtotal: </div> <div className='text-right'>Rs.{totalamtrec.toFixed(2)}</div>
                            {/* <div className='text-left'>Grand Total:</div>  <div className='text-right'>Rs.{grandtot.toFixed(2)}</div>
                            <div className='text-left'>Balance: </div> <div className='text-right'> Rs. {lastBalance.toFixed(2)} </div> */}
                            {/* <div className='col-span-2 text-center text-white text-lg bg-pink-500 mt-4'> Grand Total: Rs.{previewData.totalAmount} </div> */}
                        </div>
                    </div>
                    {/* <div className='mt-3'>Note: check</div>

                    <div className='font-bold text-lg mt-3'>Check</div>
                    <div className='text-base '>Thanks for Choosing us and for your business !!!</div> */}

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

                    <div className=' flex '>
                        <span className='flex items-center text-sky-500 mr-10'> <IoMdMail />info@ilifetech.in</span>
                        <span className='flex items-center text-sky-500'> <RiGlobalLine />www.ilifetech.in</span>
                    </div>
                </div>
                {/* <div className='grid grid-cols-5 text-black w-auto p-2'>
                            <div className='flex items-end col-span-3'> {words}</div>
                            <div className='grid grid-cols-2 p-2 col-span-2'>
                                <div className='text-left'>Subtotal: </div> <div className='text-right'>Rs.{previewData.netAmount.toFixed(2)}</div>
                                <div className='text-left'>Discount:</div>  <div className='text-right'>Rs.{previewData.discount.toFixed(2)}</div>
                                <div className='text-left'>Tax({previewData.tax}%): </div> <div className='text-right'> Rs. {taxamt.toFixed(2)} </div>
                                <div className='col-span-2 text-center text-white text-lg bg-pink-500 mt-4'> Grand Total: Rs.{previewData.totalAmount} </div>
                            </div>
                        </div> */}
                {/* footer */}

            </div>
        </div>

    )
}

export default Recipet