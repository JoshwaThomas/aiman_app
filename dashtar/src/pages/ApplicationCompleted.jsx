import React, { useState, useEffect } from "react";
import AdminServices from "@/services/AdminServices";
import {
  Table, TableHeader, TableBody, TableRow, TableCell,
  TableFooter, TableContainer, Card, CardBody,
} from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import AnimatedContent from "@/components/common/AnimatedContent";

// ── Fully controlled pagination ───────────────────────────────────────────────
function CustomPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage < 5) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  const btn = (label, onClick, disabled, active) => (
    <button
      key={label}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-md text-xs font-medium border mx-0.5
        ${active
          ? "bg-sky-500 text-white border-sky-500"
          : disabled
            ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-600">
      <span>Page {currentPage} of {totalPages}</span>
      <div className="flex items-center">
        {btn("←", () => onPageChange(currentPage - 1), currentPage === 1, false)}
        {pages.map((p, i) =>
          p === "..."
            ? <span key={`dot-${i}`} className="px-2 py-1 text-gray-400">...</span>
            : btn(p, () => onPageChange(p), false, p === currentPage)
        )}
        {btn("→", () => onPageChange(currentPage + 1), currentPage === totalPages, false)}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function ApplicationCompleted() {
  const [gradeType, setGradeType]         = useState("");
  const [selectedPref, setSelectedPref]   = useState("");

  // activeFilters = what's currently applied to the backend query
  const [activeFilters, setActiveFilters] = useState({ gradType: "", pref: "" });

  const [tableData, setTableData]         = useState([]);
  const [page, setPage]                   = useState(1);
  const [limitData, setLimitData]         = useState(10);
  const [totalDoc, setTotalDoc]           = useState(0);
  const [totalPages, setTotalPages]       = useState(0);
  const [loading, setLoading]             = useState(false);

  const ugCourses = [
    "B.A Tamil", "B.A English", "B.Sc. Apparel & Fashion Technology",
    "B.Sc. Computer Science", "B.Sc. Nutrition & Dietetics",
    "B.Sc. Mathematics", "B.Sc. Physics", "B.Sc. Psychology",
    "B.Com", "B.Com Computer Applications", "BBA", "BCA",
  ];

  const pgCourses = [
    "MA English", "M.Sc. Computer Science",
    "M.Sc. Food Service Management & Dietetics",
    "M.Sc. Psychology", "M.Com",
  ];

  // ── Core fetch — uses activeFilters, page, limitData ─────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await AdminServices.getAllApplicationCompleted(
          page,
          limitData,
          activeFilters.gradType,
          activeFilters.pref
        );
        setTableData(res.data || []);
        setTotalDoc(res.totalDoc || 0);
        setTotalPages(res.totalPages || Math.ceil((res.totalDoc || 0) / limitData));
      } catch (err) {
        console.error("Failed to fetch:", err);
        setTableData([]);
        setTotalDoc(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limitData, activeFilters]); //  re-fetches when filters, page, or limit changes

  // ── Show button — apply filters and reset to page 1 ──────────────────────
  const handleShow = () => {
    setPage(1); // reset to page 1 for new filter
    setActiveFilters({ gradType: gradeType, pref: selectedPref });
    // useEffect will auto-trigger because activeFilters changed
  };

  // ── Reset — clear everything ──────────────────────────────────────────────
  const handleReset = () => {
    setGradeType("");
    setSelectedPref("");
    setPage(1);
    setActiveFilters({ gradType: "", pref: "" });
  };

  const handleGradeTypeChange = (e) => {
    setGradeType(e.target.value);
    setSelectedPref(""); // reset pref when grade type changes
  };

  const handleLimitChange = (e) => {
    setLimitData(Number(e.target.value));
    setPage(1);
  };

  const handleChangePage = (p) => setPage(p);

  const prefOptions = gradeType === "UG" ? ugCourses
    : gradeType === "PG" ? pgCourses : [];

  const history = useHistory();
  const handleRedirect = (id) => history.push(`/application-accept/${id}`);

  return (
    <div>
      <div className="m-5">
        <AnimatedContent>
          <Card className="min-w-0 shadow-xs overflow-hidden border border-slate-300 bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <div className="flex items-end gap-4 flex-wrap">

                {/* Grade Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Grade Type</label>
                  <select value={gradeType} onChange={handleGradeTypeChange}
                    className="border rounded px-2 py-1.5">
                    <option value="">All</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Preference */}
                {/* <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Preference</label>
                  <select value={selectedPref} onChange={(e) => setSelectedPref(e.target.value)}
                    disabled={!gradeType} className="border rounded px-2 py-1.5 disabled:opacity-50">
                    <option value="">All Preferences</option>
                    {prefOptions.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div> */}

                {/* Buttons */}
                <div className="flex gap-2">
                  <button onClick={handleShow}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Show
                  </button>
                  <button onClick={handleReset}
                    className="px-4 py-1.5 border rounded hover:bg-gray-100">
                    Reset
                  </button>
                </div>

                {/* Rows per page */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Rows per page</label>
                  <select value={limitData} onChange={handleLimitChange}
                    className="border rounded px-2 py-1.5">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </select>
                </div>

              </div>

              {/* Active filter indicator */}
              {(activeFilters.gradType || activeFilters.pref) && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <span>Filtering by:</span>
                  {activeFilters.gradType && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {activeFilters.gradType}
                    </span>
                  )}
                  {activeFilters.pref && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                      {activeFilters.pref}
                    </span>
                  )}
                  <span className="text-gray-400">— {totalDoc} result{totalDoc !== 1 ? "s" : ""}</span>
                </div>
              )}

            </CardBody>
          </Card>
        </AnimatedContent>
      </div>

      <TableContainer className="mb-8 rounded-b-lg border border-sky-500">
        <Table>
          <TableHeader>
            <tr className="bg-sky-500 text-lg font-bold text-white capitalize">
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Grade Type</TableCell>
              <TableCell>Pref 1</TableCell>
              <TableCell>Pref 2</TableCell>
              <TableCell>View</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <p className="text-center py-4 text-gray-500">Loading...</p>
                </TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <p className="text-center py-4 text-gray-500">No applications found.</p>
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{(page - 1) * limitData + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>{item.gradType || "—"}</TableCell>
                  <TableCell>{item.pref1 || "—"}</TableCell>
                  <TableCell>{item.pref2 || "—"}</TableCell>
                  <TableCell>
                    <span onClick={() => handleRedirect(item._id)}
                      className="p-2 bg-blue-400 cursor-pointer text-white rounded-sm hover:bg-blue-600">
                      View
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TableFooter>
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
}

export default ApplicationCompleted;