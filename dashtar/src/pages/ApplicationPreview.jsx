import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@windmill/react-ui";
import AdminServices from "@/services/AdminServices";

const ApplicationPreview = () => {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await AdminServices.getApplication(id);
      const app = res || {};

      setData(app);
      setConfirmed(app?.status === "submitted");
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await AdminServices.updateApplication(id, { status: "submitted" });
      setConfirmed(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-6 print:bg-white">
      <Card className="w-[800px] p-6 bg-white print:shadow-none">

        <h2 className="text-xl font-bold text-center mb-4">
          Application Preview
        </h2>

        {/* ================= PERSONAL ================= */}
        <h3 className="font-bold border-b pb-1">Personal Details</h3>
        <p>Name: {data?.name || "-"}</p>
        <p>Email: {data?.email || "-"}</p>
        <p>Mobile: {data?.mobile || "-"}</p>
        <p>Gender: {data?.gender || "-"}</p>
        <p>DOB: {data?.dob || "-"}</p>
        <p>Community: {data?.community || "-"}</p>
        <p>Religion: {data?.religion || "-"}</p>
        <p>Mother Tongue: {data?.motherTongue || "-"}</p>

        {/* ================= ADDRESS ================= */}
        <h3 className="font-bold mt-4 border-b pb-1">Address</h3>
        <p>{data?.address}</p>
        <p>{data?.city}, {data?.district}</p>
        <p>{data?.state}, {data?.country} - {data?.pincode}</p>

        {/* ================= PARENTS ================= */}
        <h3 className="font-bold mt-4 border-b pb-1">Family Details</h3>

        <p><b>Father:</b> {data?.father?.name || "-"}</p>
        <p><b>Mother:</b> {data?.mother?.name || "-"}</p>
        <p><b>Guardian:</b> {data?.guardian?.name || "-"}</p>

        {/* ================= ACADEMIC ================= */}
        <h3 className="font-bold mt-4 border-b pb-1">Academic Details</h3>

        {data?.education?.length > 0 ? (
          data.education.map((e, i) => (
            <div key={i} className="text-sm">
              {e?.qualification} | {e?.board} | {e?.percentage}%
            </div>
          ))
        ) : (
          <p>No academic data</p>
        )}

        {/* ================= COURSE ================= */}
        <h3 className="font-bold mt-4 border-b pb-1">Course Selection</h3>
        <p>Preference 1: {data?.pref1 || "-"}</p>
        <p>Preference 2: {data?.pref2 || "-"}</p>

        {/* ================= DOCUMENTS ================= */}
        <h3 className="font-bold mt-4 border-b pb-1">Documents</h3>

        <div className="flex gap-4 mt-2">
          {data?.photo && (
            <img
              src={`http://localhost:5000/uploads/${data.photo}`}
              alt="photo"
              className="w-24 h-24 object-cover border"
            />
          )}

          {data?.signature && (
            <img
              src={`http://localhost:5000/uploads/${data.signature}`}
              alt="sign"
              className="w-24 h-16 object-cover border"
            />
          )}
        </div>

        {/* ================= DECLARATION ================= */}
        {!confirmed && (
          <div className="mt-6 print:hidden">
            <label className="flex items-center gap-2">
              <input type="checkbox" required />
              I hereby declare that all the information provided is true.
            </label>

            <button
              onClick={handleConfirm}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Application
            </button>
          </div>
        )}

        {/* ================= PRINT ================= */}
        {confirmed && (
          <div className="mt-6 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Print Application
            </button>
          </div>
        )}

      </Card>
    </div>
  );
};

export default ApplicationPreview;