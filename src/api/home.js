import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "POST", body);
}

function clockOutRequest (body) {
    return request("/attendances/checkouts", "POST", body);
}

function resetAttendanceRequest (userId) {
    return request(`/attendances/reset?userId=${userId}`, "GET");
}

function attendanceTodayRequest () {
    const userId = uni.getStorageSync("id");
    return request(`/attendances/today?userId=${userId}`, "GET");
}

function checkClockInStatusRequest() {
    const userId = uni.getStorageSync("id");
    return request(`/attendances/status?userId=${userId}`, "GET");
}

function departmentRequest () {
    return request("/users/departmentInfos", "GET");
}

function attendanceAllRequest () {
    const userId = uni.getStorageSync("id");
    return request(`/attendances/all?userId=${userId}`, "GET");
}

function attendanceHours (checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime || checkInTime === checkOutTime) {
        return "0:00 Hrs";
    }
    const today = new Date().toISOString().split("T")[0];
    const checkIn = new Date(`${today}T${checkInTime}:00`);
    const checkOut = new Date(`${today}T${checkOutTime}:00`);
    const range = (checkOut - checkIn) / 60000;
    if (range < 0) {
        return "Invalid";
    }
    const hours = Math.floor(range / 60);
    const minutes = Math.floor(range % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")} Hrs`
}

function eachWorkingHours (checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime) {
        return "0:00 Hrs";
    }
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const range = (checkOut - checkIn) / 60000;
    if (range < 0) {
        return "Invalid";
    }
    const hours = Math.floor(range / 60);
    const minutes = Math.floor(range % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")} Hrs`
}

function workingHours (list) {
    let totalMinutes = 0;
    list.forEach(item => {
        if (item.signInTime && item.signOutTime) {
            const checkIn = new Date(item.signInTime);
            const checkOut = new Date(item.signOutTime);
            const range = (checkOut - checkIn) / 60000;
            totalMinutes += range;
        }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")} Hrs`                
}

export {
    clockInRequest,
    clockOutRequest,
    resetAttendanceRequest,
    attendanceTodayRequest,
    departmentRequest,
    attendanceAllRequest,
    workingHours,
    eachWorkingHours,
    attendanceHours,
    checkClockInStatusRequest
}