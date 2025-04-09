const baseUrl = "http://13.211.159.140";

function request (url, method, data = {}, contenttype="application/json") {
    console.log(contenttype)
    console.log(data)
    console.log(`${baseUrl}${url}`)
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