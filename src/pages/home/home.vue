<template>
    <view class="home">
        <identity :user="user"></identity>
        <working-hour 
            :date="date" 
            :isClockedIn="isClockedIn" 
            :workingHrs="todayWorkingHrs"
            @buttonClick="handleClock"
        ></working-hour>
        <attendance 
            :date="date"
            :isClockedIn="isClockedIn"
            :todayHistory="todayHistory"
        ></attendance>
        <department :sites="sites"></department>
        <attendance-history :historyOverview="historyOverview"></attendance-history>
        <clock-out
            :clockOut="clockOut"
            :workingHrs="todayWorkingHrs"
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
    import { 
        attendanceTodayRequest, clockOutRequest, workingHours, attendanceHours, 
        attendanceAllRequest, eachWorkingHours, departmentRequest, getSchedule } from '@/api/home';
    import SockJS from 'sockjs-client';
    import { Client, Stomp } from '@stomp/stompjs';
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
                recordingsToday: [],
                currentTime: "",
                history: [],
                todayHistory: [],
                sites: [],
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    token:"",
                    department:"",
                    title:"",
                    role:"" 
                },
                systemInfo:null
            }
        },
        onLoad(){
            this.systemInfo = uni.getSystemInfoSync();
        }, 
        beforeDestroy() {
            clearInterval(this.timer);
            if (this.stompClient && this.stompClient.active) {
              this.stompClient.deactivate();
            }
        },
        computed: {
            todayWorkingHrs () {
                const checkIn = uni.getStorageSync("checkInTime");
                const parts1 = attendanceHours(checkIn, this.currentTime).split(" ")[0].split(":");
                const hours1 = parseInt(parts1[0]) || 0;
                const minutes1 = parseInt(parts1[1]) || 0;
                const parts2 = workingHours(this.todayHistory).split(" ")[0].split(":");
                const hours2 = parseInt(parts2[0]) || 0;
                const minutes2 = parseInt(parts2[1]) || 0;
                const totalMinutes = hours1 * 60 + minutes1 + hours2 * 60 + minutes2
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return `${hours}:${minutes.toString().padStart(2, "0")} Hrs`;
            },
            historyOverview() {
                return this.history.slice(0, 3).map(item => ({
                    ...item,
                    date: this.formatDate(item.signInTime),
                    formattedSignInTime: this.formatTime(item.signInTime),
                    formattedSignOutTime: this.formatTime(item.signOutTime),
                    workingHrs: eachWorkingHours(item.signInTime, item.signOutTime)
                }));
            }
        },
        // mounted() {
        //     uni.connectSocket({
        //       url: 'ws://localhost:3000/ws'
        //     });
        //     uni.onSocketOpen(function (res) {
        //       console.log('WebSocket连接已打开！');
        //     });
        //     uni.onSocketError(function (res) {
        //       console.log('WebSocket连接打开失败，请检查！' + res.errMsg);
        //     });
        // },
        mounted() {
        // IMPORTANT:
        // Replace 'localhost' with your machine's IP or domain if testing on a mobile device.
            console.log(plus.os.name);
            uni.connectSocket({
                url: 'http://localhost:3000/ws',
                success: (res) => {
                    console.log("WebSocket connection successful:", res);
                },
                fail: (err) => {
                    console.error("WebSocket connection failed:", err);
                }
            });
            // const socket1 = new SockJS('http://localhost:8080/ws');
            // const stompClient = Stomp.over(socket1);
            // stompClient.connect({}, () => {
            //     console.log("Connected to WebSocket");
            //     stompClient.subscribe('/topic/admin-notifications', msg => {
            //         // handle msg
            //         console.log("Received message:", msg.body);
            //     });
            // });
            const stompClient = Stomp.over(() => {
                // Return a new socket each time
                return new SockJS('http://localhost:3000/ws');
            });
            
            // Optional: remove console spam from STOMP
            // stompClient.debug = () => {};
            
            stompClient.connect(
                {}, 
                (frame) => {
                    console.log('STOMP connected:', frame);
                    stompClient.subscribe('/topic/admin-notifications', (message) => {
                    console.log('Received:', message.body);
                    });
                },
                (error) => {
                    console.error('STOMP error:', error);
                }
            );
            if (window.plus) {
                // Request notification permissions in iOS
                plus.push.requestPermission(granted => {
                    if (granted) {
                    console.log("Notification permission granted.");
                    } else {
                    console.warn("Notification permission denied.");
                    }
                });
            } else {
                console.warn("Not running in a native environment, 'plus' API not available.");
            }
            const socket = new SockJS('http://localhost:3000/ws', null, {
                withCredentials: true
              
            });
            this.stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                onConnect: this.onConnected,
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                }
            });
            plus.push.createLocalNotification({
                id: `notif_${Date.now()}`,
                title: "You have a new notification",
                content: "Welcome to the app",
                options: {
                    cover: false,
                    sound: "default",
                    repeat: "none",
                    vibrate: true
                },
                // 1-second delay just for example
                triggerTime: new Date().getTime() + 1000
            }, (result) => {
                console.log("Local notification created:", result);
            });
            this.stompClient.activate();
            this.updateTime();
            console.log(this.date, this.currentTime);
            this.timer = setInterval(() => {
                this.updateTime();
            }, 60000);
            this.getAttendanceToday();
        },
        methods: {
            getUserInfo() {
                this.user.token = uni.getStorageSync("token");  
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return 
                };
                this.user.firstName = uni.getStorageSync("firstName");
                this.user.lastName = uni.getStorageSync("lastName");
                this.user.department = uni.getStorageSync("department");
                this.user.title = uni.getStorageSync("title");
                this.user.role = uni.getStorageSync("role");
            },
            async getScheduleTime () {
                try {
                    const res = await getSchedule();
                    if (res.statusCode === 200) {
                        console.log("schedule:", res.data.data);
                        uni.setStorageSync("scheduleIn", res.data.data.startTime);
                        uni.setStorageSync("scheduleOut", res.data.data.endTime);
                    } else {
                        console.log("fail", res);
						uni.showToast({ title: "Faile to get schedule!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting schedule", icon: "none" });
                }
            },
            async getAttendanceToday () {
                try {
                    const res = await attendanceTodayRequest();
                    if (res.statusCode === 200) {                        
                        this.recordingsToday = res.data.data;
                        console.log("attendance today:", this.recordingsToday);                       
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to get today's attendance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get today's attendance!", icon: "none" });
                }
            },
            async getAttendanceAll () {
                try {
                    const attendanceAll = await attendanceAllRequest();
                    if (attendanceAll.statusCode === 200) {                        
                        this.history = attendanceAll.data.sort((a, b) => new Date(b.signInTime) - new Date(a.signInTime));
                        console.log("all attendance:", this.history);
                        const today = new Date().toISOString().split("T")[0];
                        console.log("get today", today);
                        this.todayHistory = this.history.filter(item => item.signInTime.startsWith(today));
                        console.log("Today's history", this.todayHistory);
                    } else {
                        console.log("Error:", attendanceAll);
						uni.showToast({ title: "Faile to get all attendance!", icon: "none" });
                    }                    
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get all attendance!", icon: "none" });
                }                
            },
            async getDepartment () {
                try {
                    const res = await departmentRequest();
                    if (res.statusCode === 200) {
                        this.sites = res.data.data;
                        console.log("department:", this.sites);
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get today's department!", icon: "none" });
                }               
            },
            formatDate (time) {
                if (!time) return "";
                const parts = new Date(time).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }).split(" ");
                if (this.systemInfo.platform === 'android') {
                    return `${parts[2]} ${parts[1]} ${parts[3]}`;
                } else if (this.systemInfo.platform === 'ios') {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                } else {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                } 
                 
            },
            formatTime (time) {
                if (!time) return "not checked";
                return time.split("T")[1].split(":").slice(0, 2).join(":");
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
            onConnected(frame) {
                console.log("Connected to WebSocket: ", frame);
            
                // Subscribe to your notifications topic
                this.stompClient.subscribe('/topic/admin-notifications', (message) => {
                    console.log("Received message:", message.body);
                    
                    const notification = JSON.parse(message.body);
                    this.notifications.push(notification);
            
                    // Show local notification
                    this.showLocalNotification('New Notification', notification.message);
                });
            },
            showLocalNotification(title, content) {
                // If running in a native environment, use plus.push
                if (window.plus) {
                    // Create a local notification
                    plus.push.createLocalNotification({
                    id: `notif_${Date.now()}`,
                    title: title,
                    content: content,
                    options: {
                        cover: false,
                        sound: "default",
                        repeat: "none",
                        vibrate: true
                    },
                    // 1-second delay just for example
                    triggerTime: new Date().getTime() + 1000
                    }, (result) => {
                    console.log("Local notification created:", result);
                    });
                } else {
                    // Fallback in H5 environment
                    uni.showToast({
                    title: content,
                    icon: "none"
                    });
                }
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
                        const pages = getCurrentPages();
                        const currentPage = pages[pages.length - 1];
                        uni.reLaunch({
                            url: '/' + currentPage.route
                        });
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
            this.getScheduleTime();
            this.getAttendanceToday();
            this.getAttendanceAll();
            this.getDepartment();
        }
    };
</script>

<style scoped lang="scss">
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
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