const express = require('express');

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMyDetails,
  deleteMyAccount,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMyDetails', protect, updateMyDetails);
router.delete('/deleteMyAccount', protect, deleteMyAccount);

router.route('/').get(getAllUsers);

router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
