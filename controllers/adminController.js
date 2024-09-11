const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin'); // Your admin model

// Create a new admin
exports.createAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName, email, password)
  try {
    const newAdmin = new Admin({ fullName, email, password });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ msg: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  
  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    // const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid password' });
    // }
    if(!admin.password === password){
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Sign and send token
    const payload = {
      user: {
        id: admin.id,
        role: 'admin' // You can include user role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};