const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  qualification: String,
  board: String,
  maxMark: Number,
  mark: Number,
  percentage: Number,
  year: String,
});

const parentSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  occupation: String,
  designation: String,
  organization: String,
  department: String,
});

const applicationSchema = new mongoose.Schema(
  {
    // 🔐 USER LINK (from login)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Admin",
      required: true,
    },

    // ======================
    // 🧍 STEP 1: PERSONAL
    // ======================
    name: String,
    mobile: String,
    whatsapp: String,
    email: String,
    altEmail: String,
    dob: String,
    gender: String,
    community: String,
    bloodGroup: String,
    religion: String,
    motherTongue: String,
    hostel: String,
    adSource: String,

    father: parentSchema,
    mother: parentSchema,
    guardian: parentSchema,

    address: String,
    pincode: String,
    country: String,
    state: String,
    district: String,
    city: String,

    // ======================
    // 🎓 STEP 2: ACADEMIC
    // ======================
    currentStatus: String,
    lastCollege: String,
    passingYear: String,
    grade: String,
    aadhar: String,
    eduType: String, // 10+2 / UG

    education: [educationSchema],

    emis: String,

    // ======================
    // 📘 STEP 3: COURSE
    // ======================
    gradType: String, // UG / PG
    pref1: String,
    pref2: String,

    // ======================
    // 📁 STEP 4: FILES
    // ======================
    photo: String,
    signature: String,
    marksheet: String,
    provisional: String,
    communityCertificate: String,

    // ======================
    // 📊 STATUS
    // ======================
    status: {
      type: String,
      default: "pending", // pending / approved / rejected
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);