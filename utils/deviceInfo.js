// import geoip from 'geoip-lite';
// import { UAParser } from 'ua-parser-js';
// import fetch from 'node-fetch';

// export function getDeviceInfo(req) {
//     const ip = getIpAddress(req);

//     const geo = geoip.lookup(ip) || {
//         country: 'Unknown',
//         region: 'Unknown',
//         city: 'Unknown'
//     };
    
//     const ua = new UAParser(req.headers['user-agent']);
//     const browser = ua.getBrowser();
//     const os = ua.getOS();
//     const device = ua.getDevice();
    
//     return {
//         ip,
//         location: {
//             country: geo.country || 'Unknown',
//             region: geo.region || 'Unknown',
//             city: geo.city || 'Unknown',
//             timezone: geo.timezone || 'Unknown'
//         },
//         browser: {
//             name: browser.name || 'Unknown',
//             version: browser.version || 'Unknown'
//         },
//         os: {
//             name: os.name || 'Unknown',
//             version: os.version || 'Unknown'
//         },
//         device: {
//             type: device.type || 'Unknown',
//             vendor: device.vendor || 'Unknown',
//             model: device.model || 'Unknown'
//         },
//         userAgent: req.headers['user-agent'] || 'Unknown'
//     };
// }

// function getIpAddress(req) {
//     const ip = 
//         req.headers['x-forwarded-for'] || 
//         req.headers['x-real-ip'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress;

//     const cleanedIp = ip ? ip.replace(/^.*:/, '') : 'Unknown';
    
//     return cleanedIp;
// }

// export default getDeviceInfo;

import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export function getDeviceInfo(req) {
    const ip = getIpAddress(req);

    const geo = geoip.lookup(ip) || {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'Unknown'
    };
    
    const ua = new UAParser(req.headers['user-agent']);
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();
    
    return {
        ip,
        location: {
            country: geo.country || 'Unknown',
            region: geo.region || 'Unknown',
            city: geo.city || 'Unknown',
            timezone: geo.timezone || 'Unknown'
        },
        browser: {
            name: browser.name || 'Unknown',
            version: browser.version || 'Unknown'
        },
        os: {
            name: os.name || 'Unknown',
            version: os.version || 'Unknown'
        },
        device: {
            type: device.type || 'Unknown',
            vendor: device.vendor || 'Unknown',
            model: device.model || 'Unknown'
        },
        userAgent: req.headers['user-agent'] || 'Unknown'
    };
}

function getIpAddress(req) {
    const ip =
        req.headers['x-vercel-forwarded-for'] ||   // ✅ Real client IP from Vercel
        req.headers['x-forwarded-for'] ||          // Proxy chain (common fallback)
        req.headers['x-real-ip'] ||                // Nginx / reverse proxy
        req.connection?.remoteAddress ||           // Node.js TCP connection
        req.socket?.remoteAddress;                 // Another fallback

    // 'x-forwarded-for' can be a comma-separated list — take the first one
    const cleanedIp = ip ? ip.split(',')[0].trim() : 'Unknown';

    // Strip IPv6-mapped prefix (::ffff:) for consistency
    return cleanedIp.replace(/^.*:/, '');
}

export default getDeviceInfo;
