const express = require("express");
const router = express.Router();
const {
  addQuotation,
  getAllQuotation,
  addInvoice,
  getAllInvoice,
  updateQuotation,
  getQuotationbyId,
  deleteQuotationbyId,
  getPaymentData,
  getInvoicebyId,
  getReciptbyinvocId,
  deleteInvoicebyId,
  getPaymentDataid, 
} = require("../controller/quotationController");

// //register a staff
// router.post("/register", registerAdmin);

// //login a admin
// router.post("/login", loginAdmin);

// //forget-password
// router.put("/forget-password", passwordVerificationLimit, forgetPassword);

// //reset-password
// router.put("/reset-password", resetPassword);

// //add a staff
// router.post("/add", addStaff);

// //add a Enquiry
// router.post("/addenquiry", addEnquiry)

//get all Quotation
router.get("/getQuotation", getAllQuotation)

//add a Quotation
router.post("/addquotation", addQuotation)

//update a Quotation
router.post("/updateQuotation/:id", updateQuotation)

//get a Quotation using the ID
router.get("/:id", getQuotationbyId)

router.get("/invoice/:id", getInvoicebyId)

//get a all payment
router.get("/payment/paymentgetdata", getPaymentData)

//get a recipet by invoice id
router.get("/payment/getrecipet/:id", getReciptbyinvocId)

//get a payment using the ID
router.get("/payment/getpayment/:id", getPaymentDataid)

//delete a Quotation using the ID
router.delete("/:id", deleteQuotationbyId)

//delete a Invoice using the Id
router.delete("/invoice/:id", deleteInvoicebyId)

//get all the Invoice
router.get("/invc/getallInvoice", getAllInvoice)

//add a Invoice
router.post("/addinvoice", addInvoice)

// //get all staff
// router.get("/", getAllStaff);

// //get a staff
// router.post("/:id", getStaffById);

// //update a staff
// router.put("/:id", updateStaff);

// //update staf status
// router.put("/update-status/:id", updatedStatus);

// //delete a staff
// router.delete("/:id", deleteStaff);

module.exports = router;
