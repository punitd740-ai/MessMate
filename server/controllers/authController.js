const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users, Messes, Wallets } = require('../config/dataStore');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      messId: user.messId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user (Student or Mess Owner)
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, messName, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required.'
      });
    }

    if (!['student', 'mess_owner'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either student or mess_owner.'
      });
    }

    // Check if user already exists
    const existing = await Users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let messId = null;

    // Create user record
    const newUser = await Users.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      address: address || '',
      status: 'active'
    });

    // If mess owner, create default mess entity
    if (role === 'mess_owner') {
      const newMess = await Messes.create({
        name: messName || `${name}'s Smart Mess`,
        ownerId: newUser._id,
        address: address || 'Campus Main Road, Block B',
        phone: phone || '9876543210',
        email: email.toLowerCase(),
        cuisineType: 'North & South Indian',
        rating: 4.8,
        status: 'active',
        sharedSavingsConfig: {
          enabled: true,
          studentRewardPercentage: 50,
          ownerRewardPercentage: 50,
          mealCutoffHours: { breakfast: 2, lunch: 3, dinner: 3 }
        },
        mealCostBreakdown: {
          rawMaterial: 35,
          prepLabor: 15,
          fixedOverhead: 10,
          totalPerMeal: 60,
          estimatedSavingsPerSkip: 35
        }
      });

      messId = newMess._id;
      await Users.findByIdAndUpdate(newUser._id, { messId });
      newUser.messId = messId;
    }

    // If student, create wallet
    if (role === 'student') {
      await Wallets.create({
        studentId: newUser._id,
        balance: 50, // Welcome signup bonus
        totalCreditsEarned: 50,
        totalSavingsGenerated: 100,
        totalMealsSkipped: 0,
        currency: 'INR'
      });
    }

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPass } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to MessMate.',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPass } = user;

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

// Get current authenticated user details
const getMe = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let extra = {};
    if (user.role === 'mess_owner') {
      const mess = await Messes.findOne({ ownerId: user._id });
      extra.mess = mess;
    } else if (user.role === 'student') {
      const wallet = await Wallets.findOne({ studentId: user._id });
      extra.wallet = wallet;
    }

    const { password: _, ...userWithoutPass } = user;
    return res.json({
      success: true,
      user: { ...userWithoutPass, ...extra }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dietaryPreference } = req.body;
    const updated = await Users.findByIdAndUpdate(req.user._id, {
      name: name || req.user.name,
      phone: phone || req.user.phone,
      address: address || req.user.address,
      dietaryPreference: dietaryPreference || req.user.dietaryPreference
    });

    const { password: _, ...clean } = updated;
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: clean
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    const user = await Users.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await Users.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
