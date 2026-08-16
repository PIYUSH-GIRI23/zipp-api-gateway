import dotenv from 'dotenv';
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

export function getGoogleAuthUrl(deviceInfo) {
    const api = `${AUTH_ENDPOINT}${GOOGLE_AUTH_ENDPOINT}`;
    return `${api}?deviceInfo=${encodeURIComponent(JSON.stringify(deviceInfo))}`;
}

export async function googleAuthCallback(queryParams) {
    const api = `${AUTH_ENDPOINT}${GOOGLE_AUTH_CALLBACK_ENDPOINT}`;
    const response = await fetch(`${api}?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.redirected) {
        return { redirected: true, url: response.url };
    }

    const data = await response.json();
    return { redirected: false, status: response.status, data };
}

export async function signup(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${SIGNUP_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function login(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${LOGIN_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function checkEmail(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${CHECK_EMAIL_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function doesExists(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${DOES_EXIST_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function getDetails(token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${GET_USER_DETAILS_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const data = await response.json();
    return { status: response.status, data, headers: response.headers };
}

export async function forgotPassword1(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${FORGOT_PASSWORD_ENDPOINT_1}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function forgotPassword2(data, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${FORGOT_PASSWORD_ENDPOINT_2}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function deleteAccount(data, token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${DELETE_ACCOUNT_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function sendVerification(token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${SEND_VERIFICATION_OTP_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function verifyEmail(data, token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${VERIFY_EMAIL_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function resetPin(token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${RESET_PIN_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function setPin(data, token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${SET_PIN_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function checkUsername(data, token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${CHECK_USERNAME_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function updateUsername(data, token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${UPDATE_USERNAME_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function logout(token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${LOGOUT_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}

export async function logoutAll(token, deviceInfo) {
    const api = `${AUTH_ENDPOINT}${LOGOUT_ALL_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result };
}
