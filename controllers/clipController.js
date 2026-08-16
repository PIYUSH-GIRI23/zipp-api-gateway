import * as clipService from '../services/clipService.js';
import getDeviceInfo from '../utils/deviceInfo.js';

function setHeaders(res, headers) {
    if (!headers) return;
    const newAccessToken = headers.get('New-Access-Token');
    const newRefreshToken = headers.get('New-Refresh-Token');
    if (newAccessToken && newRefreshToken) {
        res.set('New-Access-Token', newAccessToken);
        res.set('New-Refresh-Token', newRefreshToken);
    }
}

export async function addText(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data, headers } = await clipService.addText({ data: req.body, token, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /text route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function getClips(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data, headers } = await clipService.getClips({ token, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteText(req, res) {
    try {
        const clipId = req.params.clipId;
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data, headers } = await clipService.deleteText({ clipId, token, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function reset(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data, headers } = await clipService.resetClips({ token, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function uploadImage(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const contentType = req.headers['content-type'];
        const { status, data, headers } = await clipService.uploadImage({
            reqStream: req,
            token,
            deviceInfo,
            contentType
        });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /upload-image route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function uploadFile(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const contentType = req.headers['content-type'];
        const { status, data, headers } = await clipService.uploadFile({
            reqStream: req,
            token,
            deviceInfo,
            contentType
        });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /upload-file route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function uploadProfilePic(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const contentType = req.headers['content-type'];
        const { status, data, headers } = await clipService.uploadProfilePic({
            reqStream: req,
            token,
            deviceInfo,
            contentType
        });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /upload-profile-pic route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function removeMedia(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { id, type } = req.body;
        const { status, data, headers } = await clipService.removeMedia({ id, type, token, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /remove-media route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function removeProfilePic(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const userId = req.headers['x-user-id'];
        const { status, data, headers } = await clipService.removeProfilePic({ token, userId, deviceInfo });
        setHeaders(res, headers);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Error in /remove-profile-pic route:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}
