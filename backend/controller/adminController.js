const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const {signInToken, tokenForVerify, sendEmail} = require("../config/auth");
const Admin = require("../models/Admin");
const Enquiry = require("../models/Enquiry");
const Product = require("../models/Product");
const StudentReg = require("../models/StudentReg");
const Application = require("../models/Application");

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({email: req.body.email});
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    bcrypt.hash('admin123', 10).then(hash => {
      console.log('pass', hash);
    });
    console.log("req data", req.body.email)
    const admin = await StudentReg.findOne({email: req.body.email});
    console.log("Find data", admin)
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      const token = signInToken(admin);
      let menu = [];

    if (admin.role === "admin") {
      menu = ["Dashboard", "Application List"];
    } else {
      menu = ["Dashboard", "Application Form", "Print Application"];
    }

      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        menus: menu,
        admin,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({email: req.body.verifyEmail});
  if (!isAdded) {
    return res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Kachabazar Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    console.log("message: ", message)
    // sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const {email} = jwt.decode(token);
  const staff = await Admin.findOne({email: email});

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const addStaff = async (req, res) => {
  // console.log("add staf....", req.body.staffData);
  try {
    const isAdded = await Admin.findOne({email: req.body.email});
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: {...req.body.name},
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

//add Enquiry//------------------------------------------------------------//
const addEnquiry = async (req, res) => {
  const {EnquiryData} = req.body;
  const {products, services} = EnquiryData;
  const date = new Date();
  console.log("add ", EnquiryData);
  try {

    const foundProducts = await Product.find({'productId': {$in: products}});
    const foundService = await Product.find({'productId': {$in: services}});

    const newStaff = new Enquiry({
      com_name: EnquiryData.com_name,
      email: EnquiryData.email,
      con_person: EnquiryData.con_person,
      mobile: EnquiryData.mobile,
      alter_mobile: EnquiryData.alter_mobile,
      city: EnquiryData.city,
      date: date,
      remark: EnquiryData.remark,
      product: foundProducts.map(item => ({
        productId: item.productId,
        type: item.type
      })),
      service: foundService.map(item => ({
        productId: item.productId,
        type: item.type
      })),
    });
    await newStaff.save();
    res.status(200).send({
      message: "Enquiry Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

//approve a Enquiry
const approveEnquiry = async (req, res) => {
  const id = req.params.body;
  console.log('Approve', id)
  try {
    const data = await Enquiry.findOne({_id: id})
    if (data) {
      const upd = await Enquiry.findOneAndUpdate({_id: id}, {status: 1})
      res.status(200).send({
        message: "Approved Successfully!",
      });
    }
    else {
      res.status(200).send({
        message: "Data Not Found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//reject a Enquiry
const rejectEnquiry = async (req, res) => {
  const id = req.params.body
  console.log("reject", id)
  try {
    const data = await Enquiry.find({_id: id})
    if (data) {
      const upd = await Enquiry.findOneAndUpdate({_id: id}, {status: 2})
      res.status(200).send({
        message: "Reject Successfully!",
      });
    }
    else {
      res.status(200).send({
        message: "Data Not Found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
//------------------------------------------------------------------------//
//get the AllEnquiry
const getAllEnquiry = async (req, res) => {

  console.log('allamdin')
  try {
    const enquirys = await Enquiry.find();
    // console.log("enquirys : ",enquirys)
    res.send(enquirys);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//delete the enquiry

const deleteEnq = async (req, res) => {

  console.log("delete data", req.params.body)
  const id = req.params.body;
  Enquiry.deleteOne({_id: id}, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Deleted Successfully!",
      });
    }
  });
}

//------------------------------------------------------------------------//

const getAllStaff = async (req, res) => {
  // console.log('allamdin')
  try {
    const admins = await Admin.find({}).sort({_id: -1});
    res.send(admins);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({_id: req.params.id});

    if (admin) {
      admin.name = {...admin.name, ...req.body.name};
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.joiningData = req.body.joiningDate;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);
      res.send({
        token,
        message: "Staff Updated Successfully!",
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        image: updatedAdmin.image,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteStaff = (req, res) => {
  Admin.deleteOne({_id: req.params.id}, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Admin Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      {_id: req.params.id},
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Staff ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerSignUp = async (req, res) => {
  console.log('res registerSignUp', req.body)
  try {
    const {name, address, city, email, mobile, dob} = req.body;

    const existingUser = await StudentReg.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: "Email already registered"});
    }

    const formattedDOB = new Date(dob).toISOString().split("T")[0];

    // const defaultPassword = mobile || "123456";

    const newStudent = new StudentReg({
      name,
      address,
      city,
      email,
      mobile,
      dob: formattedDOB,
      password: bcrypt.hashSync(mobile),
    });

    const savedData = await newStudent.save();
    res.status(201).json({message: "Student Registered Successfully", data: savedData});
  } catch (err) {
    res.status(500).send({message: err.message});
  }
}

// const createApplication = async (req, res) => {
//   console.log('createApplication', req.body)
//   try {
//     const data = req.body;

//     const newApp = new Application({
//       ...data,
//       userId: req.user._id, // from JWT middleware
//     });

//     await newApp.save();

//     res.status(201).json({
//       message: "Application Submitted Successfully",
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const parseJSON = (value) => {
  if (!value) return {};

  // already object
  if (typeof value === "object") return value;

  // string → parse
  try {
    return JSON.parse(value);
  } catch (err) {
    return {};
  }
};

const createApplication = async (req, res) => {
  console.log('createApplication', req.body,)
  try {
    const data = req.body;
    const stud = await StudentReg.findOne({email: data.email});
    const newApp = new Application({
      ...data,
      userId: stud._id,
      father: parseJSON(data.father),
      mother: parseJSON(data.mother),
      guardian: parseJSON(data.guardian),
    });

    await newApp.save();

    res.status(201).json({
      message: "Step 1 saved",
      appId: newApp._id, // 🔥 IMPORTANT
    });

  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({message: err.message});
  }
};

const updateApplication = async (req, res) => {
  console.log('updateApplication', req.body)
  try {
    const {id} = req.params;
    const data = req.body;
    const files = req.files;

    const updateData = {
      ...data,
    };
    const existing = await Application.findById(id);

    if (existing.status === "submitted") {
      return res.status(400).json({message: "Application already submitted"});
    }
    // 🔥 parse JSON fields
    if (data.edu) updateData.education = parseJSON(data.edu);

    if (data.father) updateData.father = parseJSON(data.father);
    if (data.mother) updateData.mother = parseJSON(data.mother);
    if (data.guardian) updateData.guardian = parseJSON(data.guardian);

    // 🔥 FILES
    if (files?.photo) updateData.photo = files.photo[0].filename;
    if (files?.signature) updateData.signature = files.signature[0].filename;
    if (files?.marksheet) updateData.marksheet = files.marksheet[0].filename;
    if (files?.community) updateData.communityCertificate = files.community[0].filename;
    if (files?.provisional) updateData.provisional = files.provisional[0].filename;
    if (data.status === "submitted") {
      updateData.status = "submitted";
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      updateData,
      {new: true}
    );

    res.json({
      message: "Step updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({message: err.message});
  }
};

const getApplication = async (req, res) => {
  console.log('get Application', req.params)
  try {

    const app = await Application.findById(req.params.id);
    res.json(app);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({message: err.message});
  }
};

const getApplicationPrev = async (req, res) => {
  try {
    const app = await Application.findOne({email: req.params.id});
    console.log('Application Preview', app)
    res.json(app);
  } catch (err) {
    console.error('Error fetching application preview:', err);
    res.status(500).json({message: err.message});
  }
}
// AdminServices controller
const getAllApplication = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const validLimit = Math.min(limit, 100);
    const skip = (page - 1) * validLimit;

    // ── Build filter query from params ──────────────────────────────────────
    const query = {};

    if (req.query.gradType) {
      query.gradType = req.query.gradType;
    }

    if (req.query.pref) {
      query.$or = [
        {pref1: req.query.pref},
        {pref2: req.query.pref},
      ];
    }
    // ────────────────────────────────────────────────────────────────────────

    const totalDoc = await Application.countDocuments(query); //  count filtered
    const app = await Application.find(query)
      .skip(skip)
      .limit(validLimit)
      .select("name mobile gradType pref1 pref2 status")
      .sort({createdAt: -1})
      .lean();

    res.json({
      data: app,
      totalDoc,
      page,
      limit: validLimit,
      totalPages: Math.ceil(totalDoc / validLimit),
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({message: err.message});
  }
};


// --------------------------------------Get Application Accept----------------------------

const getApplicationAccept = async (req, res) => {
  try {
    console.log(req.params)
    const app = await Application.findById(req.params.id);
    console.log('Application Preview', app)
    res.json(app);
  } catch (err) {
    console.error('Error fetching application preview:', err);
    res.status(500).json({message: err.message});
  }
}

const getApplicationStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: "pending" });
    const approved = await Application.countDocuments({ status: "approved" });
    const rejected = await Application.countDocuments({ status: "rejected" });

    res.json({
      total,
      pending,
      approved,
      rejected,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
