import * as authService from '../services/authService.js';
import getDeviceInfo from '../utils/deviceInfo.js';

export async function google(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const redirectUrl = authService.getGoogleAuthUrl(deviceInfo);
        return res.redirect(redirectUrl);
    } catch (err) {
        console.error('Google auth error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function googleCallback(req, res) {
    try {
        const queryParams = new URLSearchParams(req.query).toString();
        const result = await authService.googleAuthCallback(queryParams);
        if (result.redirected) {
            return res.redirect(result.url);
        }
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Google callback error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function sendSignupOtp(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.sendSignupOtp(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Send signup OTP error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function verifySignupOtp(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.verifySignupOtp(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Verify signup OTP error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function signup(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.signup(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function login(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.login(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function checkEmail(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.checkEmail(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Check email error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function doesExists(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.doesExists(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Does exists error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function details(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data, headers } = await authService.getDetails(token, deviceInfo);

        const newAccessToken = headers.get('New-Access-Token');
        const newRefreshToken = headers.get('New-Refresh-Token');
        if (newAccessToken && newRefreshToken) {
            res.set('New-Access-Token', newAccessToken);
            res.set('New-Refresh-Token', newRefreshToken);
        }

        return res.status(status).json(data);
    } catch (err) {
        console.error('Details error:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

export async function forgotPassword1(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.forgotPassword1(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Forgot Password 1 error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function forgotPassword2(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { status, data } = await authService.forgotPassword2(req.body, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Forgot Password 2 error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteAccount(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.deleteAccount(req.body, token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Delete account error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function sendVerification(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.sendVerification(token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Send verification error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function verifyEmail(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.verifyEmail(req.body, token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Verify email error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function resetPin(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.resetPin(token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Reset pin error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function setPin(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.setPin(req.body, token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Set pin error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function checkUsername(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.checkUsername(req.body, token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Check username error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateUsername(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.updateUsername(req.body, token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Update username error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function logout(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.logout(token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function logoutAll(req, res) {
    try {
        const deviceInfo = getDeviceInfo(req);
        const token = req.headers['token'];
        const { status, data } = await authService.logoutAll(token, deviceInfo);
        return res.status(status).json(data);
    } catch (err) {
        console.error('Logout all error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
