import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const registerUser = async (req, res) => {
  const { fullname, email, username, password, confirmpassword, address, role } =
    req.body;
  if (password != confirmpassword)
    return res.status(400).json({ message: "Passwords do not match" });
  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    !confirmpassword ||
    !address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  // Validate role if provided
  if (role && !['consumer', 'merchant'].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Must be 'consumer' or 'merchant'" });
  }
  
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(password, salt);
    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      address,
      role: role || 'consumer', 
    });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.fullname,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
export const loginUser = async(req, res) => {
  const { username, password } = req.body;
  if (!username || !password  ) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  } 
  const user=await User.findOne({$or: [{ email:username }, { username }],})
  if (!user) {
      console.log(`Login attempt for non-existent user: ${username}`);
      return res.status(404).json({ message: "User not found. This account may have been deleted." });
    }

  try {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    console.log(`Generated token for user ${user._id}:`, token);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }

};
export const logLout = (req, res) => {
    
  res.status(200).json({ message: "User logged out successfully" });
};

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user profile", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullname, email, username, address, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email or username is being changed and if they're already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      
      const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update other fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (username) user.username = username;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
};
