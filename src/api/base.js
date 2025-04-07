const baseUrl = "http://13.211.159.140";

function request (url, method, data = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Making ${method} request to ${baseUrl}${url}`, data);
        console.log("Using token:", uni.getStorageSync("token"));
        
        uni.request({
            url: `${baseUrl}${url}`,
            method,
            data,
            header: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${uni.getStorageSync("token")}`
            },
            success: (res) => {
                console.log(`Response from ${url}:`, res);
                resolve(res);
            },
            fail: (err) => {
                console.error(`API Request Error for ${url}:`, err);
                reject(err);
            }
        });
    });
}

export default request;