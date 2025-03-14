// const baseUrl = "http://13.211.159.140";
const baseUrl = "http://localhost:3000";

function request (url, method, data = {}) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${baseUrl}${url}`,
            method,
            data,
            header: {
                "Content-Type": "application/json",
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