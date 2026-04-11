import React, {useEffect, useState, useContext} from "react";
import {useParams} from "react-router-dom";
import {Card} from "@windmill/react-ui";
import AdminServices from "@/services/AdminServices";
import Swal from 'sweetalert2'
import {AdminContext} from "@/context/AdminContext";
import {SidebarContext} from "@/context/SidebarContext";

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
    const {id} = useParams();
    const {state} = useContext(AdminContext);
    const {adminInfo} = state;
    console.log('adminInfo', adminInfo);

    const [data, setData] = useState({});
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("Fetching application with ID:", id);
            // const id = adminInfo?.email;
            const res = await AdminServices.getApplicationAccept(id);
            const app = res || {};

            setData(app);
            setConfirmed(app?.status === "submitted");
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };
    const handleAccept = async () => {
        try {
            // Call the API to accept the application
            const res = await AdminServices.acceptApplication(id);
            Swal.fire({
            icon: 'success',
            title: 'Application Accepted',
            text: 'The application has been accepted successfully.',
        });
        } catch (err) {
            console.error("Accept error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to accept the application.',
            });
        }
    };
    const handleReject = async () => {
        Swal.fire({
            icon: 'error',
            title: 'Application Rejected',
            text: 'The application has been rejected successfully.',
        });
    };

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

    if (!data._id) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-400">Application not found.</p>
            </div>
        );
    }

    return (
        <div className="w-[1000px] mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Application Preview</h1>
                    <p className="text-sm text-slate-500 mt-1">{data.name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold capitalize bg-blue-50 text-blue-600 border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {data.status || "pending"}
                    </span>
                    <p className="text-xs text-slate-400">
                        {new Date(data.createdAt).toLocaleDateString("en-IN", {day: "numeric", month: "short", year: "numeric"})}
                    </p>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Course banner */}
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex flex-wrap gap-6 items-center">
                    <div>
                        <p className="text-sky-100 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Grade Type</p>
                        <p className="text-white font-bold text-lg">{data.gradType || "—"}</p>
                    </div>
                    <div className="w-px h-10 bg-sky-400 hidden sm:block" />
                    <div>
                        <p className="text-sky-100 text-[10px] uppercase tracking-widest font-semibold mb-0.5">1st Preference</p>
                        <p className="text-white font-semibold">{data.pref1 || "—"}</p>
                    </div>
                    <div className="w-px h-10 bg-sky-400 hidden sm:block" />
                    <div>
                        <p className="text-sky-100 text-[10px] uppercase tracking-widest font-semibold mb-0.5">2nd Preference</p>
                        <p className="text-white font-semibold">{data.pref2 || "—"}</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Personal */}
                    <Section title="Personal Information" accent="bg-sky-400">
                        <Field label="Full Name" value={data.name} />
                        <Field label="Date of Birth" value={data.dob} />
                        <Field label="Gender" value={data.gender} />
                        <Field label="Community" value={data.community} />
                        <Field label="Religion" value={data.religion} />
                        <Field label="Blood Group" value={data.bloodGroup} />
                        <Field label="Mother Tongue" value={data.motherTongue} />
                        <Field label="Hostel" value={data.hostel} />
                        <Field label="Ad Source" value={data.adSource} />
                    </Section>

                    <Divider />

                    {/* Contact */}
                    <Section title="Contact Details" accent="bg-violet-400">
                        <Field label="Mobile" value={data.mobile} />
                        <Field label="WhatsApp" value={data.whatsapp} />
                        <Field label="Email" value={data.email} />
                        <Field label="Alt Email" value={data.altEmail} />
                    </Section>

                    <Divider />

                    {/* Address */}
                    <Section title="Address" accent="bg-teal-400">
                        <Field label="Address" value={data.address} />
                        <Field label="City" value={data.city} />
                        <Field label="District" value={data.district} />
                        <Field label="State" value={data.state} />
                        <Field label="Pincode" value={data.pincode} />
                        <Field label="Country" value={data.country} />
                    </Section>

                    <Divider />

                    {/* Father */}
                    <Section title="Father's Details" accent="bg-orange-400">
                        <Field label="Name" value={data.father?.name} />
                        <Field label="Mobile" value={data.father?.mobile} />
                        <Field label="Email" value={data.father?.email} />
                        <Field label="Occupation" value={data.father?.occupation} />
                    </Section>

                    {/* Mother */}
                    <Section title="Mother's Details" accent="bg-pink-400">
                        <Field label="Name" value={data.mother?.name} />
                        <Field label="Mobile" value={data.mother?.mobile} />
                        <Field label="Email" value={data.mother?.email} />
                        <Field label="Occupation" value={data.mother?.occupation} />
                    </Section>

                    {/* Guardian */}
                    <Section title="Guardian's Details" accent="bg-rose-300">
                        <Field label="Name" value={data.guardian?.name} />
                        <Field label="Mobile" value={data.guardian?.mobile} />
                        <Field label="Email" value={data.guardian?.email} />
                        <Field label="Occupation" value={data.guardian?.occupation} />
                    </Section>

                    <Divider />

                    {/* Academic */}
                    <Section title="Academic Information" accent="bg-emerald-400">
                        <Field label="Current Status" value={data.currentStatus} />
                        <Field label="Last College" value={data.lastCollege} />
                        <Field label="Passing Year" value={data.passingYear} />
                        <Field label="Grade / %" value={data.grade} />
                        <Field label="Edu Type" value={data.eduType} />
                        <Field label="Aadhar" value={data.aadhar} />
                        <Field label="EMIS No." value={data.emis} />
                    </Section>

                    {/* Education table */}
                    {data.education?.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 mb-3 mt-2">
                                <div className="w-1 h-5 rounded-full bg-emerald-400" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Education History</h3>
                            </div>
                            <div className="overflow-x-auto rounded-lg border border-slate-100 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                                            {["Qualification", "Board", "Max Mark", "Mark", "%", "Year"].map(h => (
                                                <th key={h} className="px-4 py-2 text-left">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.education.map((edu, i) => (
                                            <tr key={edu._id || i} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-2 text-slate-700">{edu.qualification || "—"}</td>
                                                <td className="px-4 py-2 text-slate-700">{edu.board || "—"}</td>
                                                <td className="px-4 py-2 text-slate-700">{edu.maxMark ?? "—"}</td>
                                                <td className="px-4 py-2 text-slate-700">{edu.mark ?? "—"}</td>
                                                <td className="px-4 py-2 text-slate-700">{edu.percentage ?? "—"}</td>
                                                <td className="px-4 py-2 text-slate-700">{edu.year || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    <Divider />

                    {/* Documents */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 rounded-full bg-indigo-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Uploaded Documents</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            {label: "Photo", key: "photo"},
                            {label: "Signature", key: "signature"},
                            {label: "Marksheet", key: "marksheet"},
                            {label: "Community Certificate", key: "communityCertificate"},
                            {label: "Provisional", key: "provisional"},
                        ].map(({label, key}) => (
                            <div
                                key={key}
                                className={`rounded-lg border px-3 py-2 text-center text-xs font-medium
                  ${data[key]
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                        : "border-slate-100 bg-slate-50 text-slate-300"
                                    }`}
                            >
                                <div className="text-lg mb-0.5">{data[key] ? "📄" : "—"}</div>
                                {label}
                                {data[key] && (
                                    <div className="text-[9px] text-emerald-400 mt-0.5 truncate">{data[key]}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Photo/Signature Preview */}
                    {(data?.photo || data?.signature) && (
                        <>
                            <div className="flex items-center gap-2 mt-6 mb-4">
                                <div className="w-1 h-5 rounded-full bg-indigo-400" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Image Preview</h3>
                            </div>
                            <div className="flex gap-4 mt-2">
                                {data?.photo && (
                                    <img
                                        src={`http://localhost:5000/uploads/${data.photo}`}
                                        alt="photo"
                                        className="w-24 h-24 object-cover border rounded-lg"
                                    />
                                )}
                                {data?.signature && (
                                    <img
                                        src={`http://localhost:5000/uploads/${data.signature}`}
                                        alt="sign"
                                        className="w-24 h-16 object-cover border rounded-lg"
                                    />
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Print footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-xs text-slate-400">
                        Last updated: {new Date(data.updatedAt).toLocaleString("en-IN")}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
                        >
                            🖨️ Print Application
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-6 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-sm"
                        >
                            Accept
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-sm"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPrev;