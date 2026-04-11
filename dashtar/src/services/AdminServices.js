import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  registerSignUp: async (body) => {
    console.log('body of register', body)
    return requests.post("/admin/registerSignUp", body);
  },
  createApplication(data) {
    return requests.post("/admin/application", data);
  },

  updateApplication(id, data) {
    return requests.put(`/admin/application/${id}`, data);
  },
  getApplication(id) {
    return requests.get(`/admin/getApplication/${id}`);
  },
  getApplicationPrev(id) {
    return requests.get(`/admin/getApplicationPrev/${id}`);
  },
  getApplicationStats(){
    return requests.get('/admin/getApplicationStats');
  },
  getAllApplication(page = 1, limit = 10, gradType = "", pref = "") {
    const params = new URLSearchParams({page, limit});
    if (gradType) params.append("gradType", gradType);
    if (pref) params.append("pref", pref);
    return requests.get(`/admin/getAllApplication?${params.toString()}`);
  },
  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },

  addEnquiry: async (body) => {
    return requests.post("/admin/addenquiry", {EnquiryData: body});
  },

  addQuotation: async (body) => {
    console.log("addQuotation", body)
    return requests.post("/quotation/addquotation", body)
  },

  addInvoice: async (body) => {
    return requests.post("/quotation/addinvoice", body)
  },

  getAllEnquiry: async (body) => {
    return requests.get("/admin/getEnquiry", body);
  },

  getAllQuotations: async (body) => {
    return requests.get("/quotation/getQuotation", body)
  },

  getAllPayment: async (body) => {
    console.log("payment", body)
    return requests.get("/quotation/paymentdata", body)
  },

  getPayment: async (body) => {
    return requests.get("/quotation/payment/paymentgetdata", body)
  },

  getpaymentbyrecipt: async (id) => {
    return requests.get(`/quotation/payment/getrecipet/${id}`)
  },

  getPaymentById: async (id) => {
    console.log("Get recipets")
    return requests.get(`/quotation/payment/getpayment/${id}`)
  },

  getQuotationById: async (id) => {
    return requests.get(`/quotation/${id}`);
  },

  getInvoiceById: async (id) => {
    return requests.get(`/quotation/invoice/${id}`)
  },

  deleteQuotation: async (id) => {
    return requests.delete(`/quotation/${id}`);
  },

  deleteInvoice: async (id) => {
    console.log("it worked for delete quot path")
    return requests.delete(`/quotation/invoice/${id}`);
  },

  updateQuotation: async (id, body) => {
    console.log("update path", id, body)
    return requests.post(`/quotation/updateQuotation/${id}`, body)
  },

  getAllInvoice: async (body) => {
    console.log("get all invoice path")
    return requests.get("/quotation/invc/getallInvoice", body)
  },

  deleteEnquiry: async (body) => {
    return requests.delete(`/admin/deleteEnquiry/${body}`);
  },
  approveEnquiry: async (body) => {
    console.log("route service", body)
    return requests.post(`/admin/approveEnquiry/${body}`);
  },
  rejectEnquiry: async (body) => {
    console.log("route service", body)
    return requests.post(`/admin/rejectEnquiry/${body}`);
  },
  getAllStaff: async (body) => {
    return requests.get("/admin", body);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${id}`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },
  getApplicationAccept(id) {
    return requests.get(`/admin/getApplicationAccept/${id}`);
  },
};

export default AdminServices;
