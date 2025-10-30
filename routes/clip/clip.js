import express from 'express';
import dotenv from 'dotenv';
import getDeviceInfo from '../../utils/deviceInfo.js';

const router = express.Router();
dotenv.config();

const CLIP_ENDPOINT = process.env.CLIP_ENDPOINT;
const CLIP_TEXT_ENDPOINT = process.env.CLIP_TEXT_ENDPOINT;
const CLIP_GET = process.env.CLIP_GET;
const CLIP_TEXT_DELETE = process.env.CLIP_TEXT_DELETE;
const CLIP_RESET = process.env.CLIP_RESET;
const UPLOAD_IMAGE_ENDPOINT = process.env.UPLOAD_IMAGE_ENDPOINT;
const UPLOAD_FILE_ENDPOINT = process.env.UPLOAD_FILE_ENDPOINT;
const UPLOAD_PROFILE_PIC_ENDPOINT = process.env.UPLOAD_PROFILE_PIC_ENDPOINT;
const REMOVE_PROFILE_PIC_ENDPOINT = process.env.REMOVE_PROFILE_PIC_ENDPOINT;
const REMOVE_MEDIA_ENDPOINT = process.env.REMOVE_MEDIA_ENDPOINT;

router.post('/text', express.json(), async (req, res) => {
    try {
        const data = req.body;
        const api = `${CLIP_ENDPOINT}${CLIP_TEXT_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err) {
        console.error('Error in /text route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/clips', express.json(), async (req, res) => {
    try{
        const api = `${CLIP_ENDPOINT}${CLIP_GET}`;
        const deviceInfo = getDeviceInfo(req);

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'});
    }
});

router.delete('/delete/:clipId', express.json(), async (req, res) => {
    try{
        const clipId = req.params.clipId;
        const api = `${CLIP_ENDPOINT}${CLIP_TEXT_DELETE.replace(':textId', clipId)}`;
        const deviceInfo = getDeviceInfo(req);

        const response = await fetch(api, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });
        
        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/reset', express.json(), async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const api = `${CLIP_ENDPOINT}${CLIP_RESET}`;

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/upload-image', async (req, res) => {
    try{
        const api = `${CLIP_ENDPOINT}${UPLOAD_IMAGE_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'token': req.headers['token'],
                'x-device-info': JSON.stringify(deviceInfo),
                'content-type': req.headers['content-type']
            },
            duplex: 'half',
            body: req
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.error('Error in /upload-image route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/upload-file', async (req, res) => {
    try{
        const api = `${CLIP_ENDPOINT}${UPLOAD_FILE_ENDPOINT}`;
        console.log(api)
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'token': req.headers['token'],
                'x-device-info': JSON.stringify(deviceInfo),
                'content-type': req.headers['content-type']
                
            },
            duplex: 'half',
            body: req
        });

        
        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');
        
        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }
        
        const result = await response.json();
        console.log(response);
        res.status(response.status).json(result);
    }
    catch(err){
        console.error('Error in /upload-file route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/upload-profile-pic', async (req, res) => {
    try{
        console.log("hi");
        const api = `${CLIP_ENDPOINT}${UPLOAD_PROFILE_PIC_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'token': req.headers['token'],
                'x-device-info': JSON.stringify(deviceInfo),
                'content-type': req.headers['content-type']
            },
            duplex: 'half',
            body: req
        });


        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.error('Error in /upload-profile-pic route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/remove-media', express.json(), async (req, res) => {
    try{
        const api = `${CLIP_ENDPOINT}${REMOVE_MEDIA_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const { id , type } = req.body;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ id , type , deviceInfo })
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.error('Error in /remove-media route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/remove-profile-pic', express.json(), async (req, res) => {
    try{
        const api = `${CLIP_ENDPOINT}${REMOVE_PROFILE_PIC_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token'],
                'x-user-id': req.headers['x-user-id']
            },
            body: JSON.stringify({ deviceInfo })
        });

        const newAccessToken = response.headers.get('New-Access-Token');
        const newRefreshToken = response.headers.get('New-Refresh-Token');

        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.error('Error in /remove-profile-pic route:', err);
        res.status(500).json({error: 'Internal server error', message: err.message});
    }
});







export default router;