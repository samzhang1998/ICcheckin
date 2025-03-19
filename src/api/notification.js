import request from "./base";

function getUserNotification (id) {
    return request(`/notifications/users/${id}?size=30`, "GET");
}

function setNotificationRead (id) {
    return request(`/notifications/${id}/mark-as-read`, "PUT");
}

function getAllNotification () {
    return request("/notifications/pendings", "GET");
}

export {
    getUserNotification,
    setNotificationRead,
    getAllNotification
}
