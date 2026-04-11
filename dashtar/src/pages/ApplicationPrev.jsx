import React, {useEffect, useState, useContext, useRef} from "react";
import {useParams} from "react-router-dom";
import {Card} from "@windmill/react-ui";
import AdminServices from "@/services/AdminServices";

import {AdminContext} from "@/context/AdminContext";
import {SidebarContext} from "@/context/SidebarContext";
import {useReactToPrint} from 'react-to-print';

const Field = ({label, value}) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-sm text-slate-800 font-medium">
            {value || <span className="text-slate-300 italic">—</span>}
        </span>
    </div>
);

const Section = ({title, accent, children}) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
            <div className={`w-1 h-5 rounded-full ${accent}`} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">{children}</div>
    </div>
);

const Divider = () => <hr className="border-slate-100 my-6" />;

const ApplicationPrev = () => {
    //   const { id } = useParams();
    const {state} = useContext(AdminContext);
    const {adminInfo} = state;
    console.log('adminInfo', adminInfo);

    const [data, setData] = useState({});
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Application",
        pageStyle: `
        @page {
            size: auto;
            margin: 5mm;
        }

        body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `,
    });

    const fetchData = async () => {
        try {
            const id = adminInfo?.email;
            const res = await AdminServices.getApplicationPrev(id);
            const app = res || {};

            setData(app);
            setConfirmed(app?.status === "submitted");
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[1000px] mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Application Preview</h1>
                    <p className="text-sm text-slate-500 mt-1">{data?.name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold capitalize bg-blue-50 text-blue-600 border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {data?.status === "submitted" ? "submitted" : "pending"}
                    </span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div ref={componentRef}>
                    {/* Course banner */}
                    <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex flex-wrap gap-6 items-center">
                        <div>
                            <p className="text-sky-100 text-[10px] uppercase tracking-widest font-semibold mb-0.5">1st Preference</p>
                            <p className="text-white font-semibold">{data?.pref1 || "—"}</p>
                        </div>
                        <div className="w-px h-10 bg-sky-400 hidden sm:block" />
                        <div>
                            <p className="text-sky-100 text-[10px] uppercase tracking-widest font-semibold mb-0.5">2nd Preference</p>
                            <p className="text-white font-semibold">{data?.pref2 || "—"}</p>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Personal */}
                        <Section title="Personal Details" accent="bg-sky-400">
                            <Field label="Name" value={data?.name} />
                            <Field label="Email" value={data?.email} />
                            <Field label="Mobile" value={data?.mobile} />
                            <Field label="Gender" value={data?.gender} />
                            <Field label="DOB" value={data?.dob} />
                            <Field label="Community" value={data?.community} />
                            <Field label="Religion" value={data?.religion} />
                            <Field label="Mother Tongue" value={data?.motherTongue} />
                        </Section>

                        <Divider />

                        {/* Address */}
                        <Section title="Address" accent="bg-teal-400">
                            <Field label="Address" value={data?.address} />
                            <Field label="City" value={data?.city} />
                            <Field label="District" value={data?.district} />
                            <Field label="State" value={data?.state} />
                            <Field label="Country" value={data?.country} />
                            <Field label="Pincode" value={data?.pincode} />
                        </Section>

                        <Divider />

                        {/* Family Details */}
                        <Section title="Family Details" accent="bg-orange-400">
                            <Field label="Father" value={data?.father?.name} />
                            <Field label="Mother" value={data?.mother?.name} />
                            <Field label="Guardian" value={data?.guardian?.name} />
                        </Section>

                        <Divider />

                        {/* Academic Details */}
                        <Section title="Academic Details" accent="bg-emerald-400">
                            {data?.education?.length > 0 ? (
                                data.education.map((e, i) => (
                                    <div key={i} className="col-span-full">
                                        <Field
                                            label={`Education ${i + 1}`}
                                            value={`${e?.qualification} | ${e?.board} | ${e?.percentage}%`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <Field label="Education" value="No academic data" />
                            )}
                        </Section>

                        <Divider />

                        {/* Documents */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 rounded-full bg-indigo-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Documents</h3>
                        </div>
                        <div className="flex gap-4 mt-2">
                            {data?.photo && (
                                <img
                                    src={`http://localhost:5000/uploads/${data?.photo}`}
                                    alt="photo"
                                    className="w-24 h-24 object-cover border rounded-lg"
                                />
                            )}
                            {data?.signature && (
                                <img
                                    src={`http://localhost:5000/uploads/${data?.signature}`}
                                    alt="sign"
                                    className="w-24 h-16 object-cover border rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Print footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
                    >
                        🖨️ Print Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPrev;