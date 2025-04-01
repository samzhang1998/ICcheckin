<template>
    <view class="container">
        <view class="clock_in">
            <view class="title">
                <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
                <text>Clock In Area</text>
            </view>
            <view class="map">                
                <iframe
                    v-if="mapUrl"
                    :src="mapUrl"
                    width="90%"
                    height="150%"
                    style="border: 0; margin: 0 5%;"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    loading="lazy">
                </iframe>
            </view>
            <view class="clock_in_info">
                <image src="/static/Clockin.png" alt="banner"></image>
                <text class="sub_title">MY PROFILE</text>
                <view class="profile">
                    <image src="/static/profile_photo.png" alt="photo"></image>
                    <view class="profile_info">
                        <text class="name">{{ name }}</text>
                        <text class="date">{{ date }}</text>
                        <view class="coordinate">
                            <image src="/static/Check_location.png" alt="check"></image>
                            <text>lan {{ lat }}, long {{ lng }}</text>
                        </view>
                    </view>
                </view>
                <text class="sub_title">SCHEDULE</text>
                <view class="clock_time">
                    <view class="clock_time_info">
                        <text class="type">CLOCK IN</text>
                        <text class="time">{{ currentTime }}</text>
                    </view>
                    <view class="clock_time_info">
                        <text class="type">CLOCK OUT</text>
                        <text class="time">{{ clockOutTime }}</text>
                    </view>
                </view>
            </view>
            <button @click="clockIn">Clock In</button>
            <button @click="resetAttendance" class="clock-out-btn">Reset Attendance Status</button>        
        </view>
        
        <!-- Loading overlay -->
        <view class="loading-overlay" v-if="isLoading">
            <view class="loading-content">
                <text>Processing...</text>
            </view>
        </view>
    </view>
</template>

<script>
    import { clockInRequest, checkClockInStatusRequest, clockOutRequest, resetAttendanceRequest } from '@/api/home';
    export default {
        data () {
            return {
                mapUrl: "",
                userMarker: null,
                userCircle: null,
                lat: null,
                lng: null,
                radius: 200,
                apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                name: "",
                clockOutTime: "17:00",
                date: "",
                currentTime: "",
                address: "",
                isAlreadyClockedIn: false,
                isLoading: false
            };
        },
        onLoad () {
            this.name = uni.getStorageSync("firstName") + " " + uni.getStorageSync("lastName");
            this.checkClockInStatus();
        },
        async mounted () {
            this.updateTime();
            setInterval(this.updateTime, 60000);
            await this.getLocation();
            this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${this.lat},${this.lng}`;
        },
        methods: {
            async resetAttendance() {
                try {
                    this.isLoading = true;
                    
                    const userId = uni.getStorageSync("id");
                    console.log("Resetting attendance for user:", userId);
                    
                    const res = await resetAttendanceRequest(userId);
                    console.log("Reset attendance response:", res);
                    
                    if (res.data.status === 1) {
                        console.log("Successful attendance reset:", res);
                        uni.removeStorageSync("isClockedIn");
                        uni.removeStorageSync("checkInTime");
                        uni.showToast({ 
                            title: "Attendance reset successful! You can now clock in again.", 
                            icon: "success",
                            duration: 3000
                        });
                        
                        // Reset the already clocked in flag
                        this.isAlreadyClockedIn = false;
                        
                        // Refresh the page after a delay
                        setTimeout(() => {
                            this.checkClockInStatus();
                        }, 2000);
                    } else {
                        console.log("Failed attendance reset:", res);
                        uni.showToast({ 
                            title: res.data.msg || "Attendance reset failed!", 
                            icon: "none",
                            duration: 3000
                        });
                    }
                } catch (error) {
                    console.error("Error during attendance reset:", error);
                    uni.showToast({ 
                        title: "Attendance reset failed, error", 
                        icon: "none",
                        duration: 3000
                    });
                } finally {
                    this.isLoading = false;
                }
            },
            async checkClockInStatus() {
                try {
                    const res = await checkClockInStatusRequest();
                    console.log("Clock in status check on load:", res);
                    
                    if (res.data.status === 1 && res.data.data === true) {
                        // Already clocked in
                        this.isAlreadyClockedIn = true;
                        uni.showToast({ 
                            title: "You have already clocked in today", 
                            icon: "none",
                            duration: 3000
                        });
                        
                        // Update local state to match server state
                        uni.setStorageSync("isClockedIn", true);
                        
                        // Navigate back to home after a delay
                        setTimeout(() => {
                            uni.switchTab({ url: "/pages/home/home" });
                        }, 1500);
                    }
                } catch (error) {
                    console.error("Error checking clock in status:", error);
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
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
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
            async clockIn () {
                try {
                    this.isLoading = true;
                    
                    // First check if already clocked in
                    const statusRes = await checkClockInStatusRequest();
                    console.log("Clock in status check:", statusRes);
                    
                    if (statusRes.data.status === 1 && statusRes.data.data === true) {
                        // Already clocked in
                        uni.showToast({ 
                            title: "You have already clocked in today", 
                            icon: "none",
                            duration: 3000
                        });
                        
                        // Update local state to match server state
                        uni.setStorageSync("isClockedIn", true);
                        
                        // Navigate back to home after a delay
                        setTimeout(() => {
                            uni.switchTab({ url: "/pages/home/home" });
                        }, 1500);
                        
                        return;
                    }
                    
                    // If not already clocked in, proceed with clock in
                    const body = {
                        userId: uni.getStorageSync("id"),
                        latitude: this.lat,
                        longitude: this.lng,
                        address: this.address
                    };
                    console.log("data:", body);
                    
                    const res = await clockInRequest(body);
                    console.log("Clock in response:", res);
                    
                    if (res.data.status === 1) {
                        console.log("Successful clock in:", res);                
                        uni.setStorageSync("isClockedIn", true);
                        uni.setStorageSync("checkInTime", this.currentTime);
                        uni.showToast({ title: "Clock in successful!", icon: "success" });
                        setTimeout(() => {
                            uni.switchTab({ url: "/pages/home/home" });
                        }, 1500);
                    } else if (res.data.status === 0) {
                        console.log("Failed clock in:", res);
                        uni.showToast({ 
                            title: res.data.msg || "Clock in failed, you are too far from office!", 
                            icon: "none",
                            duration: 3000
                        });
                    } else {
                        console.log("Failed clock in:", res);
                        uni.showToast({ title: "Clock in Failed", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Clock in Failed, error", icon: "none" });
                } finally {
                    this.isLoading = false;
                }        
            }
        }
    };
</script>

<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .clock_in {
        width: 750rpx;
        background: #fff;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .title {
        width: 750rpx;
        height: 200rpx;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .title image {
        width: 50rpx;
        height: 50rpx;
        position: absolute;
        left: 40rpx;
    }
    .title text {
        color: #101828;
        font-size: 35rpx;
        font-weight: 600;
        line-height: 140%;
        text-align: center;
    }
    .map {
        width: 750rpx;
        height: 400rpx;
        background: #f2f4f7;
        padding: 0 40rpx;
        box-sizing: border-box;
    }
    .clock_in_info {
        width: 750rpx;
        padding: 0 40rpx;
        box-sizing: border-box;
    }
    .clock_in_info > image {
        width: 670rpx;
        height: 200rpx;
        margin-top: 40rpx;
    }
    .sub_title {
        color: #667085;
        font-size: 25rpx;
        font-weight: 600;
        margin-top: 40rpx;
        display: block;
    }
    .profile {
        width: 670rpx;
        height: 150rpx;
        border-radius: 16rpx;
        background: #f9fafb;
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        box-sizing: border-box;
    }
    .profile > image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
    }
    .profile_info {
        margin-left: 20rpx;
    }
    .name {
        color: #101828;
        font-size: 30rpx;
        font-weight: 600;
        display: block;
    }
    .date {
        color: #667085;
        font-size: 25rpx;
        font-weight: 400;
        display: block;
        margin-top: 10rpx;
    }
    .coordinate {
        display: flex;
        align-items: center;
        margin-top: 10rpx;
    }
    .coordinate image {
        width: 30rpx;
        height: 30rpx;
    }
    .coordinate text {
        color: #667085;
        font-size: 25rpx;
        font-weight: 400;
        margin-left: 10rpx;
    }
    .clock_time {
        width: 670rpx;
        height: 150rpx;
        border-radius: 16rpx;
        background: #f9fafb;
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 20rpx;
        box-sizing: border-box;
    }
    .clock_time_info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .type {
        color: #667085;
        font-size: 25rpx;
        font-weight: 400;
    }
    .time {
        color: #101828;
        font-size: 30rpx;
        font-weight: 600;
        margin-top: 10rpx;
    }
    button {
        width: 670rpx;
        height: 100rpx;
        border-radius: 16rpx;
        background: #7f56d9;
        color: #fff;
        font-size: 30rpx;
        font-weight: 600;
        margin: 40rpx auto;
        display: block;
        border: none;
    }
    .clock-out-btn {
        background: #f04438;
        margin-top: -20rpx;
        margin-bottom: 40rpx;
    }
    
    /* Add a loading overlay */
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .loading-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }
</style>
        height: 300rpx;
        
    }
    .clock_in_info {
        width: 690rpx;
        padding: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 20rpx;
    }
    .sub_title {
        width: 690rpx;
        color: #101828;
        font-size: 22rpx;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.5px;
    }
    .clock_in_info image {
        width: 690rpx;
        height: auto;
        aspect-ratio: 360/86;
    }
    .profile {
        width: 600rpx;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        padding: 40rpx;
        gap: 30rpx;
        border-radius: 12px;
        border: 1px solid var(--Color-Gray-Gray-200, #EAECF0);
        background: #F9FAFB;
    }
    .profile image {
        width: 100rpx;
        height: 100rpx;
    }
    .profile_info {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
    }
    .name {
        color:  #141414;
        font-size: 30rpx;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
    .date {
        color: #EFC462;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
    .coordinate {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10rpx;
        margin-top: 10rpx;
    }
    .coordinate image {
        width: 20rpx;
        height: 20rpx;
    }
    .coordinate text {
        color: #475467;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .clock_time {
        width: 690rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 30rpx;
    }
    .clock_time_info {
        width: 270rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20rpx 30rpx;
        border-radius: 10px;
        border: 1px solid #EAECF0;
        background: #F9FAFB;
    }
    .type {
        color: #475467;
        text-align: center;
        font-size: 22rpx;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.15px;
    }
    .time {
        color: #000;
        text-align: center;
        font-size: 45rpx;
        font-weight: 600;
        letter-spacing: -0.5px;
    }
    button {
	  display: flex;
	  width: 690rpx;
	  height: 85rpx;
	  margin-bottom: 30rpx;
	  justify-content: center;
	  align-items: center;
	  flex-shrink: 0;
	  border-radius: 100px;
	  border: none;
	  background: #EFC462;
	  color: #fff;
	  text-align: center;
	  font-family: Nunito;
	  font-size: 30rpx;
	  font-style: normal;
	  font-weight: 600;
	  line-height: 20px;
	  letter-spacing: 0.1px;
    }
</style>