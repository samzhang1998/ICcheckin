<template>
    <view class="home">
        <identity></identity>
        <working-hour 
            :date="date" 
            :isClockedIn="isClockedIn" 
            :workingHrs="totalWorkingHrs"
            :attendanceHrs="lastAttendanceHrs"
            @buttonClick="handleClock"
        ></working-hour>
        <attendance 
            :date="date"
            :isClockedIn="isClockedIn"
            :checkInTime="checkInTime"
            :checkOutTime="checkOutTime"
        ></attendance>
        <!-- GPS Map Location Component -->
        <map-location
            v-if="showMap"
            :lat="lat"
            :lng="lng"
            :address="address"
            :apiKey="apiKey"
            :isClockedIn="isClockedIn"
            @check-action="handleCheckAction"
        ></map-location>
        <department></department>
        <attendance-history></attendance-history>
        <clock-out
            :clockOut="clockOut"
            :workingHrs="totalWorkingHrs"
            @handleConfirm="onConfirm"
            @handleCancle="onCancle"
        ></clock-out>
    </view>
</template>

<script>
    import WorkingHour from '@/components/home/working-hour.vue';
    import Attendance from '@/components/home/attendance.vue';
    import Department from '@/components/home/department.vue';
    import AttendanceHistory from '@/components/home/attendance-history.vue';
    import ClockOut from '@/components/home/clock-out.vue';
    import MapLocation from '@/components/home/map-location.vue';
    import { attendanceTodayRequest, clockOutRequest, workingHours, attendanceHours } from '@/api/home';
    export default {
        components: {
            WorkingHour,
            Attendance,
            Department,
            AttendanceHistory,
            ClockOut,
            MapLocation
        },
        data () {
            return {
                buttonText: "Clock In Now",
                isClockedIn: false,
                clockOut: false,
                date: "",
                apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                lat: null,
                lng: null,
                address: "",
                checkInTime: "",
                checkOutTime: "",
                recordingsToday: [],
                currentTime: "",
                showMap: false
            }
        },       
        onShow () {
            // Check local storage first
            const status = uni.getStorageSync("isClockedIn");          
            if (status) {
                this.isClockedIn = true;
            } else {
                this.isClockedIn = false;
            }
            
            // Always verify with the server to ensure UI state is in sync with database
            this.getAttendanceToday();
            
            // Get location when page is shown
            this.getLocation();
        },
        mounted () {
            this.updateTime();
            console.log(this.date, this.currentTime);
            this.timer = setInterval(() => {
                this.updateTime();
            }, 60000);
            this.getAttendanceToday();
            // Initialize location on mount
            this.getLocation();
            // Show map on home page
            this.showMap = true;
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        computed: {
            totalWorkingHrs () {
                if (this.isClockedIn === true) {
                    const checkIn = uni.getStorageSync("checkInTime");
                    return attendanceHours(checkIn, this.currentTime);
                } else {
                    return workingHours(this.recordingsToday);
                }
            },
            lastAttendanceHrs () {
                if (!this.checkInTime || this.checkOutTime || this.checkInTime === this.checkOutTime) {
                    return "0:00 Hrs";
                } else {
                    return attendanceHours(this.checkInTime, this.checkOutTime);
                }
            }
        },
        methods: {
            async getAttendanceToday () {
                try {
                    const res = await attendanceTodayRequest();
                    if (res.statusCode === 200) {                        
                        this.recordingsToday = res.data.data;
                        console.log("attendance today:", this.recordingsToday);
                        const attendanceToday = res.data.data.length > 0 ? res.data.data[res.data.data.length - 1] : null;
                        
                        // Check if there's a valid sign-in without sign-out
                        if (attendanceToday && attendanceToday.signInTime && !attendanceToday.signOutTime) {
                            this.isClockedIn = true;
                            uni.setStorageSync("isClockedIn", true);
                            uni.setStorageSync("checkInTime", attendanceToday.signInTime.split("T")[1].split(":").slice(0, 2).join(":"));
                        } else {
                            this.isClockedIn = false;
                            uni.removeStorageSync("isClockedIn");
                            uni.removeStorageSync("checkInTime");
                        }
                        
                        this.checkInTime = attendanceToday?.signInTime?.split("T")[1].split(":").slice(0, 2).join(":");
                        this.checkOutTime = attendanceToday?.signOutTime?.split("T")[1].split(":").slice(0, 2).join(":");
                        console.log("check in time:", this.checkInTime, "check out time", this.checkOutTime);
                    } else {
                        console.log(res);
						uni.showToast({ title: "Faile to get today's attendance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get today's attendance!", icon: "none" });
                }
            },
            updateTime () {
                const parts = new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Sydney",
                    hour12: false,
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                }).split(" ");
                const timeParts = parts[4].split(":");
                this.date = `${parts[2]} ${parts[1]} ${parts[3]}`;
                this.currentTime = `${timeParts[0]}:${timeParts[1]}`;
            },
            getLocation () {
                uni.getLocation({
                    type: "wgs84",
                    success: async (res) => {
                        this.lat = res.latitude;
                        this.lng = res.longitude;
                        console.log("location:", this.lat, this.lng);
                        await this.getAddress(this.lat, this.lng);
                        // Update map when location is obtained
                        this.showMap = true;
                    },
                    fail: (err) => {
                        console.error("fail to get location:", err);
                        uni.showToast({
                            title: "unable to get location, please check GPS",
                            icon: "none"
                        });
                        this.showMap = false;
                    }
                })
            },
            async getAddress(lat, lng) {
                const apiKey = this.apiKey;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
                return new Promise((resolve, reject) => {
                    uni.request({
                        url: url,
                        method: "GET",
                        success: (res) => {
                            if (res.statusCode === 200 && res.data.status === "OK") {
                                this.address = res.data.results[0].formatted_address;
                                console.log("Current Address:", this.address);
                                resolve(this.address);
                            } else {
                                console.error("Geocoding failed:", res.data.status);
                                reject("Geocoding failed");
                            }
                        },
                        fail: (err) => {
                            console.error("Error fetching address:", err);
                            reject(err);
                        }
                    });
                });
            },
            handleClock() {
                if (this.isClockedIn) {
                    this.getLocation();
                    this.clockOut = true;
                    uni.hideTabBar();
                } else {
                    uni.navigateTo({ url: "/pages/home/clock-in" });
                }
            },
            // New method to handle check action from map component
            handleCheckAction(data) {
                console.log("Check action:", data);
                if (data.isInRange) {
                    // If in range, handle check in
                    if (!this.isClockedIn) {
                        uni.navigateTo({ url: "/pages/home/clock-in" });
                    } else {
                        // Already clocked in
                        uni.showToast({ 
                            title: "You are already clocked in", 
                            icon: "none" 
                        });
                    }
                } else {
                    // If out of range, handle check out if already clocked in
                    if (this.isClockedIn) {
                        this.clockOut = true;
                        uni.hideTabBar();
                    } else {
                        uni.showToast({ 
                            title: "You must be within range to check in", 
                            icon: "none" 
                        });
                    }
                }
            },
            async onConfirm () {
                try {
                    const body = {
                        userId: uni.getStorageSync("id"),
                        latitude: this.lat,
                        longitude: this.lng,
                        address: this.address
                    };
                    console.log("data:",body);
                    const res = await clockOutRequest(body);
                    if (res.data.status === 1) {
                        console.log("Successful clock out:", res);                
                        this.isClockedIn = false;
                        this.clockOut = false;
                        uni.showTabBar();
                        uni.removeStorageSync("isClockedIn");
                        uni.removeStorageSync("checkInTime");  
                    } else if (res.data.status === 0) {
                        console.log("Failed clock out:", res);
                        // Display the actual error message from the server
                        uni.showToast({ 
                            title: res.data.msg || "Clock out failed, you are too far from office!", 
                            icon: "none" 
                        });
                        
                        // If the error is about no sign-in record, update the UI state
                        if (res.data.msg && res.data.msg.includes("Sign-in record not found")) {
                            this.isClockedIn = false;
                            uni.removeStorageSync("isClockedIn");
                            uni.removeStorageSync("checkInTime");
                            this.clockOut = false;
                            uni.showTabBar();
                            // Refresh attendance data
                            this.getAttendanceToday();
                        }
                    } else {
                        console.log("Failed clock out:", res);
                        uni.showToast({ title: "Clock out Failed", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Clock out Failed, error", icon: "none" });
                }              
            },
            onCancle () {
                this.clockOut = false;
                uni.showTabBar();
            }
        }
    };
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
</style>