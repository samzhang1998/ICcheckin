import request from "./base";

function getNotification () {
    const userId = uni.getStorageSync("id");
    return request(`/test/notifications/user/${userId}`, "GET");
}

function setNotificationRead (id) {
    return request(`/test/notifications/${id}/read`, "PUT");
}

function pushNotificationAdmin (body) {
    return request("/test/notifications/pushToUser", "PUT", body);
}

function pushNotificationUser (body) {
    return request("/test/notifications/pushToUser", "POST", body);
}

export {
    getNotification,
    setNotificationRead,
    pushNotificationAdmin,
    pushNotificationUser
}
