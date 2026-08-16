import express from 'express';
import * as clipController from '../controllers/clipController.js';

const router = express.Router();

router.post('/text', express.json(), clipController.addText);
router.post('/clips', express.json(), clipController.getClips);
router.delete('/delete/:clipId', express.json(), clipController.deleteText);
router.post('/reset', express.json(), clipController.reset);
router.post('/upload-image', clipController.uploadImage);
router.post('/upload-file', clipController.uploadFile);
router.post('/upload-profile-pic', clipController.uploadProfilePic);
router.post('/remove-media', express.json(), clipController.removeMedia);
router.post('/remove-profile-pic', express.json(), clipController.removeProfilePic);

export default router;
