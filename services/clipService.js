import dotenv from 'dotenv';
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

export async function addText({ data, token, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${CLIP_TEXT_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ ...data, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function getClips({ token, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${CLIP_GET}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function deleteText({ clipId, token, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${CLIP_TEXT_DELETE.replace(':textId', clipId)}`;
    const response = await fetch(api, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function resetClips({ token, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${CLIP_RESET}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function uploadImage({ reqStream, token, deviceInfo, contentType }) {
    const api = `${CLIP_ENDPOINT}${UPLOAD_IMAGE_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'token': token,
            'x-device-info': JSON.stringify(deviceInfo),
            'content-type': contentType
        },
        duplex: 'half',
        body: reqStream
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function uploadFile({ reqStream, token, deviceInfo, contentType }) {
    const api = `${CLIP_ENDPOINT}${UPLOAD_FILE_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'token': token,
            'x-device-info': JSON.stringify(deviceInfo),
            'content-type': contentType
        },
        duplex: 'half',
        body: reqStream
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function uploadProfilePic({ reqStream, token, deviceInfo, contentType }) {
    const api = `${CLIP_ENDPOINT}${UPLOAD_PROFILE_PIC_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'token': token,
            'x-device-info': JSON.stringify(deviceInfo),
            'content-type': contentType
        },
        duplex: 'half',
        body: reqStream
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function removeMedia({ id, type, token, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${REMOVE_MEDIA_ENDPOINT}`;
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ id, type, deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}

export async function removeProfilePic({ token, userId, deviceInfo }) {
    const api = `${CLIP_ENDPOINT}${REMOVE_PROFILE_PIC_ENDPOINT}`;
    const headers = {
        'Content-Type': 'application/json',
        'token': token
    };
    if (userId) {
        headers['x-user-id'] = userId;
    }
    const response = await fetch(api, {
        method: 'POST',
        headers,
        body: JSON.stringify({ deviceInfo })
    });
    const result = await response.json();
    return { status: response.status, data: result, headers: response.headers };
}
