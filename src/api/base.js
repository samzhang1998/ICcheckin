const baseUrl = "http://172.20.10.4:8080";

function request (url, method, data = {}, contenttype="application/json") {
    
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${baseUrl}${url}`,
            method,
            data,
            header: {
                "Content-Type": contenttype,
                "Authorization": `Bearer ${uni.getStorageSync("token")}`
            },
            success: (res) => resolve(res),
            fail: (err) => {
                console.error("API Request Error:", err);
                reject(err);
            }
        });
    });
}

export default request;
export {baseUrl};