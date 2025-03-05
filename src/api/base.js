const baseUrl = "http://13.211.159.140";

function request (url, method, data = {}) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${baseUrl}${url}`,
            method,
            data,
            header: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            success: (res) => resolve(res),
            fail: (err) => {
                console.error("API Request Error:", err);
                reject(err);
            }
        });
    });
}

export default request;