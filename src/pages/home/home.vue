<template>
    <view class="home">
        <identity :user="user"></identity>
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
    import Identity from '@/components/main/identity.vue';
    import { attendanceTodayRequest, clockOutRequest, workingHours, attendanceHours } from '@/api/home';
    export default {
        components: {
            WorkingHour,
            Attendance,
            Department,
            AttendanceHistory,
            ClockOut,
            Identity
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
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    department:"",
                    title:"",
                    role:"" 
                }
            }
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
            getUserInfo() {
                this.user.firstName = uni.getStorageSync("firstName");
                this.user.lastName = uni.getStorageSync("lastName");
                this.user.department = uni.getStorageSync("department");
                this.user.title = uni.getStorageSync("title");
            },
            async getAttendanceToday () {
                try {
                    const res = await attendanceTodayRequest();
                    if (res.statusCode === 200) {                        
                        this.recordingsToday = res.data.data;
                        console.log("attendance today:", this.recordingsToday);
                        const attendanceToday = res.data.data.length > 0 ? res.data.data[res.data.data.length - 1] : null;
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
                    },
                    fail: (err) => {
                        console.error("fail to get location:", err);
                        uni.showToast({
                            title: "unable to get location, please check GPS",
                            icon: "none"
                        });
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
                        console.log("Failed clock in:", res);
                        uni.showToast({ title: "Clock out failed, you are too far from office!", icon: "none" });
                    } else {
                        console.log("Failed clock in:", res);
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
        },
        onShow () {
            const status = uni.getStorageSync("isClockedIn");          
            if (status) {
                this.isClockedIn = true;
            };
            this.getUserInfo();     
        },
        mounted () {
            this.updateTime();
            console.log(this.date, this.currentTime);
            this.timer = setInterval(() => {
                this.updateTime();
            }, 60000);
            this.getAttendanceToday();       
        },
        beforeDestroy() {
            clearInterval(this.timer);
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
    .identity {
        width: 675rpx;
        height: 200rpx;
        padding-bottom: 30rpx;
        position: sticky;
        top: 0;
        z-index: 100;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: space-between;
    }
    .img_box {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 1px solid #F1F1F1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .identity image {
        width: 45rpx;
        height: 45rpx;
    }
    .identity_text {
        display: flex;
        flex-direction: column;
    }
    .name {
        color: #141414;
        font-size: 40rpx;
        font-weight: 600;
        letter-spacing: -0.4px;
    }
    .role {
        color: #838383;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.4px;
    }
</style>