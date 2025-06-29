<template>
    <view class="home">
        <identity :user="user"></identity>
        <working-hour 
            :date="date" 
            :isClockedIn="isClockedIn" 
            :workingHrs="todayWorkingHrs"
            @buttonClick="handleClock"
        ></working-hour>
        <button @tap="outclock">wbdk</button>
        <attendance 
            :date="date"
            :isClockedIn="isClockedIn"
            :todayHistory="todayHistory"
        ></attendance>
        <department 
            :sites="sites"
            :scheduleStart="scheduleStart"
            :scheduleEnd="scheduleEnd"
        ></department>
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
    import {sendOutsideClockin} from '@/api/affairs'
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
                currentTime: "",
                scheduleStart: "",
                scheduleEnd: "",
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
                systemInfo:null,
                device:{}
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
                url: 'http://172.20.10.4:8080/ws',
                success: (res) => {
                    console.log("WebSocket connection successful:", res);
                },
                fail: (err) => {
                    console.error("WebSocket connection failed:", err);
                }
            });
            // const socket1 = new SockJS('http://172.20.10.4:8080/ws');
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
                return new SockJS('http://172.20.10.4:8080/ws');
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
            const socket = new SockJS('http://172.20.10.4:8080/ws', null, {
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
        },
        methods: {
            outclock(){
                //
                let clockdata = { 
                    //userId: uni.getStorageSync("id"),
                    latitude: this.lat,
                    longitude: this.lng, 
                    address: this.address 
                }
                console.log(clockdata)
                uni.showLoading()
                sendOutsideClockin(clockdata).then(({data:{data, msg,status}})=>{
                    if (status==1){
                        uni.showToast({
                            title:msg
                        })
                    }else{
                        uni.showToast({
                            title:msg
                        })
                    }
                }).finally(()=>{
                    uni.hideLoading()
                })
            },
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
                        this.scheduleStart = res.data.data.startTime,
                        this.scheduleEnd = res.data.data.endTime,
                        uni.setStorageSync("scheduleIn", res.data.data.startTime);
                        uni.setStorageSync("scheduleOut", res.data.data.endTime);
                    } else {
                        console.log("fail", res);
						uni.showToast({ title: "Fail to get schedule!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting schedule", icon: "none" });
                }
            },
            async getTodayAttendance () {
                try {
                    const res = await attendanceTodayRequest();
                    if (res.statusCode === 200) {
                        this.todayHistory = res.data.data;
                        console.log("attendance today", this.todayHistory);
                    } else if (res.statusCode === 403) {
                        console.log(res);
						uni.showToast({ title: "Fail to get today's attendance, please log in again", icon: "none" });
                    } else {
                        console.log("Error:", res);
						uni.showToast({ title: "Fail to get today's attendance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting all attendance!", icon: "none" });
                }
            },
            async getAttendanceAll () {
                try {
                    const attendanceAll = await attendanceAllRequest();
                    if (attendanceAll.statusCode === 200) {                        
                        this.history = attendanceAll.data.sort((a, b) => new Date(b.signInTime) - new Date(a.signInTime));
                        console.log("all attendance:", this.history);
                        // const parts = new Date().toLocaleString().split(" ").slice(0, 4);
                        // const today = `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`
                        // console.log("get today", today);
                        // this.todayHistory = this.history.filter(item => new Date(item.signInTime).toLocaleString().startsWith(today));
                        // console.log("Today's history", this.todayHistory);
                    } else if (attendanceAll.statusCode === 403) {
                        console.log(attendanceAll);
						uni.showToast({ title: "Fail to get all attendance, please log in again", icon: "none" });
                    } else {
                        console.log("Error:", attendanceAll);
						uni.showToast({ title: "Fail to get all attendance!", icon: "none" });
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
                    } else if (res.statusCode === 403) {
                        console.log(res);
						uni.showToast({ title: "Fail to get department, please log in again", icon: "none" });
                    } else {
                        console.log("Error:", res);
						uni.showToast({ title: "Fail to get department!", icon: "none" });
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
                    let deviceinfo = this.systemInfo.deviceBrand + " " + 
                    this.systemInfo.deviceModel + " " + this.systemInfo.system
                    uni.showLoading()
                    const body = {
                        //userId: uni.getStorageSync("id"),
                        latitude: this.lat,
                        longitude: this.lng,
                        deviceId:this.systemInfo.deviceId,
                        deviceIdInfo:deviceinfo,
                        address: this.address
                    };
                    
                    console.log("data:",body);
                    const res = await clockOutRequest(body);
                    uni.hideLoading()
                    if (res.data.status === 1) {
                        console.log("Successful check out:", res);                
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
                    } else {
                        console.log("Failed check out:", res);
                        uni.showToast({ title: `Check out failed, ${res.data.msg}`, icon: "none" });
                    }
                    
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Check out Failed, error", icon: "none" });
                    uni.hideLoading()
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
            this.getTodayAttendance();
            this.getScheduleTime();
            this.getAttendanceAll();
            this.getDepartment()
        }
    };
</script>

<style scoped lang="scss" src="./home.scss">
    
</style>