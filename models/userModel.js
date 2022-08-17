const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name.'],
    minlenght: [5, 'Name must be at least 5 characters long.'],
    maxlength: [60, 'Name cannot exceed 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email address.'],
    unique: [true, 'Email address is already in use.'],
    lowercase: true,
    validate: [validator.isEmail, 'Email address not valid.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'User must have a password.'],
    minlength: [8, 'Password must be at least 9 characters.'],
    maxlength: [24, 'Password cannot exceed 24 characters.'],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords must match.',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
