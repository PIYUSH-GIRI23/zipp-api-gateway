import express from 'express';
import getDeviceInfo from '../../utils/deviceInfo.js';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;
const SIGNUP_ENDPOINT = process.env.SIGNUP_ENDPOINT;
const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT;
const CHECK_EMAIL_ENDPOINT = process.env.CHECK_EMAIL_ENDPOINT;
const CHECK_USERNAME_ENDPOINT = process.env.CHECK_USERNAME_ENDPOINT;
const UPDATE_USERNAME_ENDPOINT = process.env.UPDATE_USERNAME_ENDPOINT;
const FORGOT_PASSWORD_ENDPOINT_1 = process.env.FORGOT_PASSWORD_ENDPOINT_1;
const FORGOT_PASSWORD_ENDPOINT_2 = process.env.FORGOT_PASSWORD_ENDPOINT_2;
const VERIFY_EMAIL_ENDPOINT = process.env.VERIFY_EMAIL_ENDPOINT;
const SET_PIN_ENDPOINT = process.env.SET_PIN_ENDPOINT;
const RESET_PIN_ENDPOINT = process.env.RESET_PIN_ENDPOINT;
const SEND_VERIFICATION_OTP_ENDPOINT = process.env.SEND_VERIFICATION_OTP_ENDPOINT;
const DOES_EXIST_ENDPOINT = process.env.DOES_EXIST_ENDPOINT;
const GET_USER_DETAILS_ENDPOINT = process.env.GET_USER_DETAILS_ENDPOINT;
const LOGOUT_ENDPOINT = process.env.LOGOUT_ENDPOINT;
const LOGOUT_ALL_ENDPOINT = process.env.LOGOUT_ALL_ENDPOINT;
const GOOGLE_AUTH_ENDPOINT = process.env.GOOGLE_AUTH_ENDPOINT;
const GOOGLE_AUTH_CALLBACK_ENDPOINT = process.env.GOOGLE_AUTH_CALLBACK_ENDPOINT;
const DELETE_ACCOUNT_ENDPOINT = process.env.DELETE_ACCOUNT_ENDPOINT;

router.get('/google', async (req, res) => {
    try {
        const api = `${AUTH_ENDPOINT}${GOOGLE_AUTH_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const updatedApi = `${api}?deviceInfo=${encodeURIComponent(JSON.stringify(deviceInfo))}`;
        res.redirect(updatedApi);
    } 
    catch(err) {
        console.error('Google auth error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/google/callback', async (req, res) => {
    try {
        const api = `${AUTH_ENDPOINT}${GOOGLE_AUTH_CALLBACK_ENDPOINT}`;
        const queryParams = new URLSearchParams(req.query).toString();
        
        const response = await fetch(`${api}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.redirected) {
            return res.redirect(response.url);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    } 
    catch(err) {
        console.error('Google callback error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${SIGNUP_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.error(500).json({error: 'Internal server error'});
    }
});

router.post('/login', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${LOGIN_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.error(500).json({error: 'Internal server error'});
    }
});

router.post('/check-email', async (req, res) => {
    try{
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${CHECK_EMAIL_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/does-exists', async (req, res) => {
    try{
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${DOES_EXIST_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/details', async (req, res) => {
    try {
        const api = `${AUTH_ENDPOINT}${GET_USER_DETAILS_ENDPOINT}`;
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
        console.log(response.headers);
        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err) {
        res.error(500).json({error: 'Internal server error', message: err.message});
    }
});

router.post('/forgot-password_1', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${FORGOT_PASSWORD_ENDPOINT_1}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/forgot-password_2', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const data = req.body;
        console.log(req.body)
        const api = `${AUTH_ENDPOINT}${FORGOT_PASSWORD_ENDPOINT_2}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.delete('/delete-account', express.json(), async (req, res) => {
    try{
        const data = req.body;
        const deviceInfo = getDeviceInfo(req);
        const api = `${AUTH_ENDPOINT}${DELETE_ACCOUNT_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/send-verification', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const api = `${AUTH_ENDPOINT}${SEND_VERIFICATION_OTP_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/verify-email', async (req, res) => {
    try{
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${VERIFY_EMAIL_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/reset-pin', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const api = `${AUTH_ENDPOINT}${RESET_PIN_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/set-pin', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${SET_PIN_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/check-username', async (req, res) => {
    try{
        const data = req.body;
        const api = `${AUTH_ENDPOINT}${CHECK_USERNAME_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.put('/update-username', async (req, res) => {
    try{
        const data = req.body;
        const deviceInfo = getDeviceInfo(req);
        const api = `${AUTH_ENDPOINT}${UPDATE_USERNAME_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ ...data, deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.put('/logout', async (req, res) => {
    try{
        const deviceInfo = getDeviceInfo(req);
        const api = `${AUTH_ENDPOINT}${LOGOUT_ENDPOINT}`;
        const response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

router.put('/logout-all', async (req, res) => {
    try{
        const api = `${AUTH_ENDPOINT}${LOGOUT_ALL_ENDPOINT}`;
        const deviceInfo = getDeviceInfo(req);
        const response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers['token']
            },
            body: JSON.stringify({ deviceInfo })
        });
        const result = await response.json();
        res.status(response.status).json(result);
    }
    catch(err){
        res.status(500).json({error: 'Internal server error'});
    }
});

export default router;