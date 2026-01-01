const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  }
}, { timestamps: true });

// Modern Async Pre-save Hook (No 'next' needed)
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Mongoose will catch this as a save error
  }
});

module.exports = mongoose.model('User', userSchema);