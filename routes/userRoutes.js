const express = require('express');

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMyDetails,
  deleteMyAccount,
  getMyDetails,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/getMyDetails', getMyDetails, getSingleUser);
router.patch('/updateMyDetails', updateMyDetails);
router.delete('/deleteMyAccount', deleteMyAccount);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
