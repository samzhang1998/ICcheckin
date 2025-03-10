import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "POST", body);
}

function clockOutRequest (body) {
    return request("/attendances/checkouts", "POST", body);
}

function attendanceTodayRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/today?userId=${userId}`, "GET")
}

function departmentRequest () {
    return request("/users/departmentInfos", "GET");
}

function attendanceAllRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/all?userId=${userId}`, "GET");
}

function eachWorkingHours (checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime) {
        const workingHrs = "0:00 Hrs";
        return workingHrs;
    }
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const range = (checkOut - checkIn) / 60000;
    if (range < 0) {
        const workingHrs = "Invalid";
        return workingHrs;
    }
    const hours = Math.floor(range / 60);
    const minutes = Math.floor(range % 60);
    const workingHrs = `${hours}:${minutes} Hrs`;
    return workingHrs;
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
    console.log("working hours today:", hours, minutes);
    return `${hours}:${minutes} Hrs`;                
}

export {
    clockInRequest,
    clockOutRequest,
    attendanceTodayRequest,
    departmentRequest,
    attendanceAllRequest,
    workingHours,
    eachWorkingHours
}