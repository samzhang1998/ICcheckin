<template>
    <view class="clock_in">

        <view class="maintitle" :style="{ paddingTop: safeAreaHeight + 10 + 'px' }">
            <identity :user="user"></identity>
        </view>
        <view class="statuses">
            <view class="status-left">
                <view class="status-item" @tap="changeStatus(true)" :class="{ 'active-postion': onsite }">Onsite Check in
                </view>
                <view class="status-slice">|</view>
                <view class="status-item" @tap="changeStatus(false)" :class="{ 'active-postion': onsite == false }">Offsite
                    Check In</view>
            </view>
            <view class="history">
                <image class="history-img" src="/static/clock.png"></image>
            </view>
        </view>
        <view class="content">
            <view class="top">
                <image class="rili-img" src="/static/rili.png"></image>
                <view class="date">{{ date }}</view>
            </view>

            <view class="nocheckin-msg" v-if="isClockedIn">You already checked in..</view>
            <view class="nocheckin-msg" v-else>You haven't checked in yet.</view>
            <view v-if="onsite">
                <image src="/static/nocheckin.png" v-if="isClockedIn == false" class="Clockin-img" alt="banner"></image>
            </view>
            <view v-else>
                <image src="/static/Clockout.png" class="Clockin-img" alt="banner"></image>
            </view>
            <view class="map">
                <iframe class="iframemap" v-if="mapUrl" :src="mapUrl" width="100%" height="150%" style="border: 0;"
                    allowfullscreen referrerpolicy="no-referrer-when-downgrade" loading="lazy">
                </iframe>
            </view>

            <view class="clock_in_info">
                <view class="coordinate">
                    <image src="/static/checkedtrue.png" class="chimg" alt="check"></image>
                    <text class="address">{{ address }}</text>
                </view>
                <view class="clock_time">
                    <view class="clock_time_info">
                        <view class="times-msg">
                            <image src="/static/Clock_icon.png" class="chimg" alt="check"></image>
                            <text class="type">Now</text>
                        </view>
                        <text class="time">{{ currentTime }}</text>
                    </view>
                    <view class="clock_time_info">
                        <view class="times-msg">
                            <image src="/static/Clock_icon.png" class="chimg" alt="check"></image>
                            <text class="type">Check In</text>
                        </view>
                        <text class="time">{{ clockInTime }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="onsite">
            <button @click="clockOutFun" class="blackbtn" v-if="isClockedIn">Check Out</button>
            <button @click="clockInPre" v-if="isClockedIn == false">Check In</button>
        </view>
        <view v-else>
            <button @click="MarkLoaction" class="bluebtn">Mark Location</button>
        </view>

        <view>Google FCM msg:{{ fcmmsg }}</view>
        <working-hour :date="date" :isClockedIn="isClockedIn" :workingHrs="todayWorkingHrs"
            @buttonClick="handleClock"></working-hour>
        <clock-out :clockOut="clockOut" :workingHrs="todayWorkingHrs" :checkOutTime="checkOutTime"
            @handleConfirm="onConfirm" @handleCancle="onCancle"></clock-out>

        <view v-if="additional_info" class="overlay" @click="cancelCheckin">
            <scroll-view class="leave_request" @click.stop @touchmove.stop.prevent="moveHandle" scroll-y>
                <view class="leave_opt">
                    <view class="title">Please note</view>
                    <view class="msgs">You're too far from the designated check-in location.</view>
                    <view class="msgs">You can add note or take photo when check in.</view>
                </view>
                <view>
                    <view @tap="addimg"
                        style="width: 660rpx; border-radius: 10rpx; text-align: center; height: 400rpx; color: #333;  line-height: 400rpx; background-color: #eeeeee;"
                        v-if="srcphoto == ''">
                        Click to add photo.
                    </view>
                    <image v-else
                        style="width: 660rpx;  border-radius: 10rpx ;height: 400rpx; background-color: #eeeeee;"
                        mode="aspectFill" :src="srcphoto"></image>
                </view>
                <view>
                    <textarea class="notes" v-model="note" placeholder="add additional notes." />
                </view>
                <button @click="checkout" class="blackbtn" v-if="isClockedIn">Check Out</button>
                <button @click="clockIn" v-if="isClockedIn == false">Check In</button>
            </scroll-view>
        </view>
        <AttendanceHistory :history="history" />
    </view>
</template>

<script>
import Identity from '@/components/main/identity.vue';
import ClockOut from '@/components/home/clock-out.vue';
import AttendanceHistory from '@/components/attendance/list.vue';
import {
    attendanceTodayRequest, clockOutRequest, workingHours, attendanceHours,
    attendanceAllRequest, eachWorkingHours, departmentRequest, getSchedule
} from '@/api/home';
import WorkingHour from '@/components/home/working-hour.vue';
import { clockInRequest } from '@/api/home';
import { getTodayAttendances } from '@/api/attendances';
import { baseUrl } from "@/api/base";
import mHelper from '@/utils/helper';
import { sendOutsideClockin } from '@/api/affairs'
export default {
    components: {
        WorkingHour,
        Identity,
        ClockOut,
        AttendanceHistory
    },
    data() {
        return {
            history:[],
            note: "",
            safeAreaHeight: 150,
            clockOut: false,
            onsite: true,
            user: {
                email: "",
                lastName: "",
                firstName: "",
                phone: "",
                token: "",
                department: "",
                title: "",
                role: ""
            },
            date: "",
            fcmmsg: "",
            isClockedIn: false,
            mapUrl: "",
            userMarker: null,
            userCircle: null,
            lat: null,
            lng: null,
            radius: 200,
            apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
            name: "",
            clockInTime: uni.getStorageSync("scheduleIn"),
            checkOutTime: "",
            currentTime: "",
            address: "",
            systemInfo: null,
            device: {},
            DISTANCE: 200,//允许打卡的范围
            userinfo: null,
            additional_info: false,
            srcphoto: ""
        };
    },
    computed: {
        todayWorkingHrs() {

            const checkIn = uni.getStorageSync("checkInTime");
            if (checkIn) {
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
            }
        },
    },
    onLoad() {
        this.getSysinfo()
        this.getUserInfo()
        this.systemInfo = uni.getSystemInfoSync();
        this.safeAreaHeight = this.systemInfo.statusBarHeight || 150;
        this.name = uni.getStorageSync("firstName") + " " + uni.getStorageSync("lastName");

    },
    async mounted() {
        this.updateTime();
        setInterval(this.updateTime, 1000);
        await this.getLocation();
        this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${this.lat},${this.lng}`;
    },
    methods: { 
        addimg() {
            let _this = this
            uni.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: ['album','camera'],
                maxDuration: 30,
                camera: 'back',
                success:(res)=>{
                    const tempFilePaths = res.tempFiles; 
                    console.log(tempFilePaths)
                    if (tempFilePaths.length > 0) {
                        this.srcphoto = tempFilePaths[0].tempFilePath
                        this.additional_info = true

                    }
                }
            })
        },
        moveHandle() {
            // 阻止页面滚动 

        },
        cancelCheckin() {
            this.additional_info = false
        },
        getDistance() {
            let r_lng1 = this.userinfo.longitude
            let r_lat1 = this.userinfo.latitude

            let distance = mHelper.getDistanceBetweenCoordinates(
                r_lat1, r_lng1, this.lat, this.lng
            )
            console.log("distance:" + distance)
            return distance
        },
        getTodayAttendancesTime() {
            getTodayAttendances(this.user.id).then(({ data, msg, status }) => { 
                if (status == 1) {
                    let length = data.length
                    console.log("//////////////////////////////")
                    console.log(data)
                    this.history = data
                    if (length > 0) {
                        if (data[0].signOutTime != null && data[0].signOutTime != "") {
                            this.isClockedIn = false
                            this.clockInTime = data[0].signInTime.split(" ")[1]
                            uni.setStorageSync("scheduleIn", this.clockInTime)
                            this.checkOutTime = data[0].scheduleSignOutTime

                        } else if (data[0].signInTime != null && data[0].signInTime != "") {
                            this.isClockedIn = true
                            this.clockInTime = data[0].signInTime.split(" ")[1]
                            uni.setStorageSync("scheduleIn", this.clockInTime)
                            this.checkOutTime = data[0].scheduleSignOutTime
                        }
                    }
                }
            })
        },
        changeStatus(status) {
            this.onsite = status
        },
        getUserInfo() {
            this.user.token = uni.getStorageSync("token");
            if (this.user.token == '') {
                // 跳转登录
                uni.navigateTo({
                    url: '/pages/index/index' // 目标页面的路径
                });
                return
            };
            this.userinfo = uni.getStorageSync("userinfo")
            this.user.firstName = uni.getStorageSync("firstName");
            this.user.lastName = uni.getStorageSync("lastName");
            this.user.department = uni.getStorageSync("department");
            this.user.title = uni.getStorageSync("title");
            this.user.role = uni.getStorageSync("role");
            this.user.id = uni.getStorageSync("id");
            console.log(this.user)
            this.getTodayAttendancesTime()
        },
        clockMark() {

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
        initNativePush() {
            if (plus.os.name === 'Android') {
                initAndroidPush()
            } else if (plus.os.name === 'iOS') {
                initIOSPush()
            }
        },

        initAndroidPush() {
            const main = plus.android.runtimeMainActivity()
            const Context = plus.android.importClass('android.content.Context')
            const Intent = plus.android.importClass('android.content.Intent')

            // 监听新消息
            const FirebaseMessaging = plus.android.importClass('com.google.firebase.messaging.FirebaseMessaging')
            const OnCompleteListener = plus.android.implements('OnCompleteListener', {
                onComplete: (task) => {
                    if (task.isSuccessful()) {
                        const token = task.getResult()
                        console.log('FCM Token:', token)
                        this.fcmmsg = token
                        sendTokenToServer(token)
                    }
                }
            })

            FirebaseMessaging.getInstance().getToken().addOnCompleteListener(OnCompleteListener)

            // 监听消息到达
            plus.android.addEventListener('onNewIntent', (intent) => {
                const extras = intent.getExtras()
                if (extras) {
                    const message = plus.android.invoke(extras, 'getString', 'message')
                    if (message) {
                        handlePushMessage(JSON.parse(message))
                    }
                }
            })
        },

        initIOSPush() {
            const app = plus.ios.importClass('UIApplication')
            const sharedApplication = app.sharedApplication()

            // 监听远程通知注册结果
            const delegate = plus.ios.implements('UIApplicationDelegate', {
                applicationDidRegisterForRemoteNotificationsWithDeviceToken: (application, deviceToken) => {
                    const token = deviceToken.description()
                        .replace(/[<\s>]/g, '')
                        .replace(/\s+/g, '')
                    console.log('APNs Token:', token)
                    sendTokenToServer(token)
                },

                applicationDidReceiveRemoteNotification: (application, userInfo) => {
                    const info = plus.ios.importObject(userInfo)
                    console.log('收到推送:', info)
                    this.handlePushMessage(info)
                }
            })

            sharedApplication.setDelegate(delegate)
        },
        handlePushMessage(message) {
            // 处理不同类型的推送
            if (message.type === 'click') {
                // 用户点击通知栏消息
                this.fcmmsg = message
                console.log('用户点击了通知:', message)
                this.navigateToTargetPage(message.payload)
            } else if (message.type === 'receive') {
                // 接收到推送消息
                console.log('接收到推送:', message)
                this.fcmmsg = message
                this.showLocalNotification(message)
            }
        },
        sendTokenToServer(token) {
            // 实现将 token 发送到你的服务器
            uni.request({
                url: 'https://your-server.com/api/save-fcm-token',
                method: 'POST',
                data: { token },
                success: (res) => {
                    console.log('Token 上传成功')
                }
            })
        },
        listenFCM() {
            // 判断平台
            if (plus.os.name === 'Android') {
                // Android 平台
                const main = plus.android.runtimeMainActivity();
                const FirebaseMessaging = plus.android.importClass('com.google.firebase.messaging.FirebaseMessaging');

                FirebaseMessaging.getInstance().getToken()
                    .addOnCompleteListener(new plus.android.implements('OnCompleteListener', {
                        onComplete: (task) => {
                            if (task.isSuccessful()) {
                                const token = task.getResult();
                                console.log('FCM Token:', token);
                                // 发送 token 到你的服务器
                            }
                        }
                    }));
            } else if (plus.os.name === 'iOS') {
                // iOS 平台
                const app = plus.ios.importClass('UIApplication');
                const sharedApplication = app.sharedApplication();
                const isRegistered = sharedApplication.isRegisteredForRemoteNotifications();
                console.log('推送注册状态:', isRegistered);
            }
        },
        getSysinfo() {
            this.device = uni.getDeviceInfo()
            console.log(this.device)
        },
        updateTime() {
            const parts = new Date().toLocaleString("en-AU", {
                timeZone: "Australia/Sydney",
                hour12: false,
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }).split(" ");
            const timeParts = parts[4].split(":");
            // this.date = `${parts[2]} ${parts[1]} ${parts[3]}`;
            if (this.systemInfo.platform === 'android') {
                this.date = `${parts[2]} ${parts[1]} ${parts[3]}`;
            } else if (this.systemInfo.platform === 'ios') {
                this.date = `${parts[0]} ${parts[1]} ${parts[2]}`;
            } else {
                this.date = `${parts[0]} ${parts[1]} ${parts[2]}`;
            }
            this.currentTime = `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;

        },
        async getLocation() {
            return new Promise((resolve, reject) => {
                uni.getLocation({
                    type: "wgs84",
                    success: (res) => {
                        this.lat = res.latitude;
                        this.lng = res.longitude;
                        this.getAddress(this.lat, this.lng);
                        resolve({ lat: this.lat, lng: this.lng });
                    },
                    fail: (err) => {
                        console.error("failed GPS:", err);
                        uni.showToast({ title: "cannot get location", icon: "none" });
                        reject(err);
                    }
                });
            });
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
        MarkLoaction() {
            let clockdata = {
                //userId: uni.getStorageSync("id"),
                latitude: this.lat,
                longitude: this.lng,
                address: this.address
            }
            uni.showLoading()
            sendOutsideClockin(clockdata).then(({ msg, status, data }) => {
                console.log(msg, status, data)

                if (status == 1) {
                    uni.showModal({
                        content: msg,
                        confirmText: "OK",
                        showCancel: false
                    });
                } else {
                    uni.showToast({
                        title: msg
                    })
                }
            }).finally(() => {
                uni.hideLoading()
            })
        },
        async checkout(){
            uni.showLoading() 
            if (this.srcphoto != ""){
                uni.uploadFile({
                    url: baseUrl + "/attendances/checkouts",
                    filePath: this.srcphoto,
                    name: 'file',
                    header: {
                        Authorization: "Bear " + this.user.token,
                    },
                    formData: { data: JSON.stringify(body) },
                    success: (res) => {
                        if (res.data.status === 1) {
                            this.additional_info = false
                            uni.showModal({
                                content: res.data.msg,
                                confirmText: "OK",
                                showCancel: false
                            });

                            console.log("Successful clock in file:", res);
                            this.isClockedIn = true
                            this.additional_info = false
                            uni.setStorageSync("isClockedIn", true);
                        } else if (res.data.status === 0) {
                            console.log("Failed clock in:", res);
                            uni.showModal({
                                title: "Check in failed",
                                content: res.data.msg,
                                confirmText: "OK",
                                showCancel: false
                            });

                        } else {
                            console.log("Failed clock in:", res);
                            uni.showModal({
                                content: res,
                                confirmText: "OK",
                                showCancel: false
                            });

                        }
                    },
                    fail: (res) => {
                        uni.showToast({
                            title: "失败",
                            icon: "none",
                        });
                    },
                    complete:()=>{
                        uni.hideLoading()
                    }
                });
           }    else{
                try {
                    let deviceinfo = this.systemInfo.deviceBrand + " " +
                        this.systemInfo.deviceModel + " " + this.systemInfo.system
                    uni.showLoading()
                    const body = {
                        latitude: this.lat,
                        longitude: this.lng,
                        deviceId: this.systemInfo.deviceId,
                        deviceIdInfo: deviceinfo,
                        address: this.address
                    };

                    console.log("data:", body);
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
                        const currentPage = pages[pages.length-1];
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
            }
        },
        onConfirm() {
           this.checkout()
             
        },
        onCancle() {
            this.clockOut = false;
            uni.showTabBar();
        },
        clockOutFun() {
            this.clockOut = true;
            uni.hideTabBar();
        },
        clockInPre() {
            let distance = this.getDistance()
            if (distance > this.DISTANCE) {
                this.additional_info = true

            } else {
                this.clockIn()
            }
        },
        async clockIn() {
            let deviceinfo = this.device.deviceBrand + " " +
                this.device.deviceModel + " " + this.device.system
            const body = {
                //userId: uni.getStorageSync("id"),
                latitude: this.lat,
                longitude: this.lng,
                deviceId: this.device.deviceId,
                deviceIdInfo: deviceinfo,
                address: this.address,
                note: this.note
            };
            try {
                uni.showLoading() 
                if (this.srcphoto != ""){
                console.log("////////////////////////")
                     console.log(this.srcphoto)
                     console.log(body)
                     console.log( baseUrl + "/attendances/checkins")
                    uni.uploadFile({
                        url: baseUrl + "/attendances/checkins",
                        filePath: this.srcphoto,
                        name: 'file',
                        header: {
                           "Content-Type": "multipart/form-data",
                            Authorization: "Bear " + this.user.token,
                        },
                        formData: { data: JSON.stringify(body) },
                        success: (res) => {
                             console.log(res)
                            if (res.data.status === 1) {
                                this.additional_info = false
                                uni.showModal({
                                    content: res.data.msg,
                                    confirmText: "OK",
                                    showCancel: false
                                });

                                console.log("Successful clock in file:", res);
                                this.isClockedIn = true
                                this.additional_info = false
                                uni.setStorageSync("isClockedIn", true);
                            } else if (res.data.status === 0) {
                                console.log("Failed clock in:", res);
                                uni.showModal({
                                    title: "Check in failed",
                                    content: res.data.msg,
                                    confirmText: "OK",
                                    showCancel: false
                                });

                            } else {
                                console.log("Failed clock in:", res);
                                uni.showModal({
                                    content: res,
                                    confirmText: "OK",
                                    showCancel: false
                                });

                            }
                        },
                        fail: (res) => {
                            uni.showToast({
                                title: "失败",
                                icon: "none",
                            });
                        },
                        complete:()=>{
                           uni.hideLoading()
                        }
                    });
                }else{
                    const res = await clockInRequest(body);
                    uni.hideLoading()
                    if (res.data.status === 1) {
                        this.additional_info = false
                        uni.showModal({
                            content: res.data.msg,
                            confirmText: "OK",
                            showCancel: false
                        });
                        console.log("Successful clock in:", res);
                        this.isClockedIn = true
                        uni.setStorageSync("isClockedIn", true);
                    } else if (res.data.status === 0) {
                        console.log("Failed clock in:", res);
                        uni.showModal({
                            title: "Check in failed",
                            content: res.data.msg,
                            confirmText: "OK",
                            showCancel: false
                        });

                    } else {
                        console.log("Failed clock in:", res);
                        uni.showToast({ title: "Check in Failed", icon: "none" });
                    }

                }  
            } catch (error) {
                console.error("Error:", error);
                uni.hideLoading()
                uni.showToast({ title: "Check in Failed, error", icon: "none" });
            }
        }
    },

};
</script>

<style scoped lang="scss" src="./clock-in.scss"></style>