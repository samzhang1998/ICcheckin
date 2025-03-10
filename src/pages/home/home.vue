<template>
    <view class="home">
        <identity></identity>
        <working-hour 
            :date="date" 
            :isClockedIn="isClockedIn" 
            :buttonText="buttonText"
            :workingHrs="workingHrs"
            @buttonClick="handleClock"
        ></working-hour>
        <attendance 
            :date="date"
            :isClockedIn="isClockedIn"
            :checkInTime="checkInTime"
            :checkOutTime="checkOutTime"
        ></attendance>
        <attendance-overview></attendance-overview>
        <attendance-history></attendance-history>
        <clock-out
            :clockOut="clockOut"
            :today="today"
            :overtime="overtime"
            @handleConfirm="onConfirm"
            @handleCancle="onCancle"
        ></clock-out>
    </view>
</template>

<script>
    import WorkingHour from '@/components/home/working-hour.vue';
    import Attendance from '@/components/home/attendance.vue';
    import AttendanceOverview from '@/components/home/attendance-overview.vue';
    import AttendanceHistory from '@/components/home/attendance-history.vue';
    import ClockOut from '@/components/home/clock-out.vue';
    import { departmentRequest, 
        attendanceTodayRequest, 
        clockOutRequest,
        workingHoursToday 
    } from '@/api/home';
    export default {
        components: {
            WorkingHour,
            Attendance,
            AttendanceOverview,
            AttendanceHistory,
            ClockOut
        },
        data () {
            return {
                buttonText: "Clock In Now",
                isClockedIn: false,
                today: "08:00:00 Hrs",
                overtime: "00:00:00 Hrs",
                clockOut: false,
                date: "",
                apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                lat: null,
                lng: null,
                address: "",
                checkInTime: "",
                checkOutTime: "",
                workingHrs: ""
            }
        },
        onLoad () {
            this.getDepartment();
        },       
        onShow () {
            const status = uni.getStorageSync("isClockedIn");          
            if (status) {
                this.isClockedIn = true;
                this.buttonText = "Clock Out";
            }
        },
        mounted () {
            this.updateTime();
            console.log(this.date)
            setInterval(this.updateTime, 60000);
            this.getAttendanceToday();            
        },
        methods: {
            async getDepartment () {
                const departmentToday = await departmentRequest();
                console.log("department:", departmentToday);
            },
            async getAttendanceToday () {
                try {
                    const attendanceToday = await attendanceTodayRequest();
                    if (attendanceToday.statusCode === 200) {
                        console.log("attendance today:", attendanceToday);
                        this.checkInTime = attendanceToday.data[0].signInTime?.split("T")[1].split(":").slice(0, 2).join(":");
                        this.checkOutTime = attendanceToday.data[0].signOutTime?.split("T")[1].split(":").slice(0, 2).join(":");
                        this.workingHrs = workingHoursToday(this.checkInTime, this.checkOutTime);
                        console.log("check in time:", this.checkInTime, "check out time", this.checkOutTime);
                    } else {
                        console.log(attendanceToday.text());
						uni.showToast({ title: "Faile to get today's attendance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get today's attendance!", icon: "none" });
                }
            },
            // workingHoursToday () {
            //     if (!this.checkInTime || !this.checkOutTime) {
            //         this.workingHrs = "0:00 Hrs";
            //         return;
            //     }
            //     const [inHours, inMinutes] = this.checkInTime.split(":").map(Number);
            //     const [outHours, outMinutes] = this.checkOutTime.split(":").map(Number);
            //     const range = inHours*60 + inMinutes - outHours*60 - outMinutes;
            //     if (range < 0) {
            //         this.workingHrs = "Invalid";
            //         return;
            //     }
            //     const hours = Math.floor(range / 60);
            //     const minutes = range % 60;
            //     this.workingHrs = `${hours}:${minutes} Hrs`;
            //     console.log("working today:", this.workingHrs);
            // },
            // async getAttendanceAll () {
            //     try {
            //         const attendanceAll = await attendanceAllRequest();
            //         if (attendanceAll.statusCode === 200) {
            //             console.log("all attendance:", attendanceAll);
            //         } else {
            //             console.log(attendanceAll.text());
			// 			uni.showToast({ title: "Faile to get all attendance!", icon: "none" });
            //         }                    
            //     } catch (error) {
            //         console.error("Error:", error);
            //         uni.showToast({ title: "Fail to get all attendance!", icon: "none" });
            //     }                
            // },
            updateTime () {
                const now = new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Sydney",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                this.date = now;
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
                try {
                    const response = await fetch(url);
                    const data = await response.json();                    
                    if (data.status === "OK") {
                        this.address = data.results[0].formatted_address;
                        console.log("Current Address:", this.address);
                    } else {
                        console.error("Geocoding failed:", data.status);
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
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
                    // const body = {
                    //     userId: uni.getStorageSync("id"),
                    //     latitude: this.lat,
                    //     longitude: this.lng,
                    //     address: this.address
                    // };
                    const body = {
                        userId: uni.getStorageSync("id"),
                        latitude: -33.856900,
                        longitude: 151.215100,
                        address: "Sydney Opera House Office, Bennelong Point, Sydney, NSW, Australia"
                    };
                    console.log("data:",body);
                    const res = await clockOutRequest(body);
                    if (res.statusCode === 200) {
                        console.log("Successful clock out:", res);                
                        this.isClockedIn = false;
                        this.buttonText = "Clock In Now";
                        this.clockOut = false;
                        uni.showTabBar();
                        uni.removeStorageSync("isClockedIn");  
                    } else if (res.statusCode === 400) {
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
        }
    };
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
</style>