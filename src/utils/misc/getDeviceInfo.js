/**
 * 
 * @param {*} req 
 * @returns 
 */
export function getDeviceInfo(req) {
    const userAgent = req.get("User-Agent") || "";
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Simple device detection (you can enhance this)
    let deviceInfo = "Unknown Device";
    if (userAgent.includes("Mobile")) deviceInfo = "Mobile Device";
    else if (userAgent.includes("Chrome")) deviceInfo = "Chrome Browser";
    else if (userAgent.includes("Firefox")) deviceInfo = "Firefox Browser";
    else if (userAgent.includes("Safari")) deviceInfo = "Safari Browser";

    return { deviceInfo, ipAddress, userAgent };
}
