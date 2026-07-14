const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { register, login, forgotPassword, resetPassword } = require('../validations/auth.validation');

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);
router.post('/forgot-password', validate(forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(resetPassword), authController.resetPassword);

module.exports = router;
