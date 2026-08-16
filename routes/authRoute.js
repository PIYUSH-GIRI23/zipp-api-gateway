import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/google', authController.google);
router.get('/google/callback', authController.googleCallback);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/check-email', authController.checkEmail);
router.post('/does-exists', authController.doesExists);
router.post('/details', authController.details);
router.post('/forgot-password_1', authController.forgotPassword1);
router.post('/forgot-password_2', authController.forgotPassword2);
router.delete('/delete-account', authController.deleteAccount);
router.post('/send-verification', authController.sendVerification);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-pin', authController.resetPin);
router.post('/set-pin', authController.setPin);
router.post('/check-username', authController.checkUsername);
router.put('/update-username', authController.updateUsername);
router.put('/logout', authController.logout);
router.put('/logout-all', authController.logoutAll);

export default router;
