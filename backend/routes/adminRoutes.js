const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  addEnquiry,
  getAllEnquiry,
  deleteEnq,
  approveEnquiry,
  rejectEnquiry,
  registerSignUp,
  createApplication,
  updateApplication,
  getApplication,
  getApplicationPrev,
  getAllApplication,
  getApplicationAccept,
  getApplicationStats,
} = require("../controller/adminController");
const upload = require("../config/multer");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");

//register a staff
router.post("/register", registerAdmin);

router.post("/application", createApplication);

// router.post("/application", (req, res, next) => {
//     console.log('Pre-multer check', req.body);
//     next();
//   }, upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "signature", maxCount: 1 },
//     { name: "marksheet", maxCount: 1 },
//     { name: "provisional", maxCount: 1 },
//     { name: "community", maxCount: 1 },
//   ]), createApplication);

router.put("/application/:id", (req, res, next) => {
    console.log('Pre-multer check', req.body);
    next();
  }, upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "provisional", maxCount: 1 },
    { name: "community", maxCount: 1 },
  ]), updateApplication);

router.get("/getApplication/:id", getApplication)
router.get("/getApplicationPrev/:id", getApplicationPrev)
router.get("/getAllApplication", getAllApplication)
router.get("/getApplicationStats", getApplicationStats)

router.post("/registerSignUp", registerSignUp);

//login a admin
router.post("/login", loginAdmin);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//add a staff
router.post("/add", addStaff);

//add a Enquiry
router.post("/addenquiry", addEnquiry)

//get all Enquiry
router.get("/getEnquiry", getAllEnquiry)

//delete a Enquiry
router.delete("/deleteEnquiry/:body", deleteEnq)

//approve a Enquiry
router.post("/approveEnquiry/:body", approveEnquiry)

//reject a Enquiry
router.post("/rejectEnquiry/:body", rejectEnquiry)

//get all staff
router.get("/", getAllStaff);

//get a staff
router.post("/:id", getStaffById);

//update a staff
router.put("/:id", updateStaff);

//update staf status
router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);

// get Application Accept
router.get("/getApplicationAccept/:id", getApplicationAccept);

module.exports = router;
