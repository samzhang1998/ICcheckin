<template>
    <view class="clock_in">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>Clock In Area</text>
        </view>
        <view class="map">                
            <iframe
                v-if="mapUrl"
                :src="mapUrl"
                width="100%"
                height="150%"
                style="border: 0;"
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
    </view>
</template>

<script>
    import { clockInRequest } from '@/api/home';
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
                address: ""
            };
        },
        onLoad () {
            this.name = uni.getStorageSync("firstName") + " " + uni.getStorageSync("lastName");
        },
        async mounted () {
            this.updateTime();
            setInterval(this.updateTime, 60000);
            await this.getLocation();
            this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${this.lat},${this.lng}`;
        },
        methods: {
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
                const body = {
                    userId: uni.getStorageSync("id"),
                    latitude: this.lat,
                    longitude: this.lng,
                    address: this.address
                };
                console.log("data:",body);
                try {
                    const res = await clockInRequest(body);
                    if (res.data.status === 1) {
                        console.log("Successful clock in:", res);                
                        uni.setStorageSync("isClockedIn", true);
                        uni.switchTab({ url: "/pages/home/home" });
                    } else if (res.data.status === 0) {
                        console.log("Failed clock in:", res);
                        uni.showToast({ title: "Clock in failed, you are too far from office!", icon: "none" });
                    } else {
                        console.log("Failed clock in:", res);
                        uni.showToast({ title: "Clock in Failed", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Clock in Failed, error", icon: "none" });
                }        
            }
        }
    };
</script>

<style scoped>
    .clock_in {
        width: 750rpx;
        background: #fff;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .title {
        width: 750rpx;
        height: 150rpx;
        padding-bottom: 30rpx;
        background: #fff;
        display: flex;
        align-items: end;
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