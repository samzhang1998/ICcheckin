<template>
    <view class="clock_in">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>Clock In Area</text>
        </view>                
        <view id="map" class="map"></view>
        <view class="clock_in_info">
            <image src="/static/Clockin.png" alt="banner"></image>
            <text class="sub_title">MY PROFILE</text>
            <view class="profile">
                <image src="/static/profile_photo.png" alt="photo"></image>
                <view class="profile_info">
                    <text class="name">{{ name }}</text>
                    <text class="date">{{ timeTrack[0] }}</text>
                    <view class="coordinate">
                        <image src="/static/Check_location.png" alt="check"></image>
                        <text>lan {{ lat }} long {{ lng }}</text>
                    </view>
                </view>
            </view>
            <text class="sub_title">SCHEDULE</text>
            <view class="clock_time">
                <view class="clock_time_info">
                    <text class="type">CLOCK IN</text>
                    <text class="time">{{ timeTrack[1] }}</text>
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
                map: null,
                userMarker: null,
                userCircle: null,
                lat: null,
                lng: null,
                radius: 200,
                apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                name: "",
                clockOutTime: "5:00 pm",
                timeTrack: [],
                address: ""
            };
        },
        onLoad () {
            this.name = uni.getStorageSync("firstName") + "" + uni.getStorageSync("lastName");
            this.loadGoogleMaps();
        },
        mounted () {
            this.updateTime();
            console.log(this.timeTrack)
            setInterval(this.updateTime, 60000);
        },
        methods: {
            updateTime () {
                const now = new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Sydney",
                    hour12: true,
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                });
                this.timeTrack = now.split(" at ");
            },
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
            },
            loadGoogleMaps() {
                if (typeof google !== "undefined") {
                    this.initMap();
                } else {
                    const script = document.createElement("script");
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
                    script.async = true;
                    script.defer = true;
                    window.initMap = this.initMap;
                    document.head.appendChild(script);
                }
            },
            initMap () {
                uni.getLocation({
                    type: "wgs84",
                    success: async (res) => {
                        this.lat = res.latitude;
                        this.lng = res.longitude;
                        console.log("location:", this.lat, this.lng);
                        await this.getAddress(this.lat, this.lng);
                        this.map = new google.maps.Map(document.getElementById("map"), {
                            center: { lat: this.lat, lng: this.lng },
                            zoom: 15,
                            mapTypeId: "roadmap"
                        });
                        this.userMarker = new google.maps.Marker({
                            position: { lat: this.lat, lng: this.lng },
                            map: this.map,
                            title: "Your Location",
                            icon: {
                                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                scaledSize: new google.maps.Size(40, 40)
                            }
                        });
                        this.userCircle = new google.maps.Circle({
                            strokeColor: "#EFC462",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#EFC462",
                            fillOpacity: 0.35,
                            map: this.map,
                            center: { lat: this.lat, lng: this.lng },
                            radius: this.radius
                        });
                    },
                    fail: (err) => {
                        console.error("fail to get location:", err);
                        uni.showToast({
                            title: "unable to get location, please check GPS",
                            icon: "none"
                        });
                    }
                });
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
            async clockIn () {
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
                try {
                    const res = await clockInRequest(body);
                    if (res.statusCode === 200) {
                        console.log("Successful clock in:", res);                
                        uni.setStorageSync("isClockedIn", true);
                        uni.switchTab({ url: "/pages/home/home" });
                    } else if (res.statusCode === 400) {
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
        width: 100%;
        height: 100vh;
        background: #fff;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .title {
        width: 100%;
        margin-top: 5%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    .title image {
        width: 36px;
        height: auto;
        aspect-ratio: 1/1;
        position: absolute;
        left: 5%;
    }
    .title text {
        color: #101828;
        font-size: 18px;
        font-weight: 600;
        line-height: 140%;
        text-align: center;
    }
    .map {
        width: 100%;
        height: 40vh;
        border: 0;
        margin-top: 5%;
    }
    .sub_title {
        width: 100%;
        color: #101828;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.5px;
    }
    .clock_in_info {
        width: 90%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .clock_in_info image {
        width: 100%;
        height: auto;
        aspect-ratio: 360/86;
    }
    .profile {
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        padding: 5%;
        gap: 5%;
        border-radius: 12px;
        border: 1px solid var(--Color-Gray-Gray-200, #EAECF0);
        background: #F9FAFB;
    }
    .profile image {
        width: 64px;
        height: 64px;
    }
    .profile_info {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
    }
    .name {
        color:  #141414;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
    .date {
        color: #EFC462;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
    .coordinate {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 3px;
        margin-top: 5px;
    }
    .coordinate image {
        width: 12px;
        height: 12px;
    }
    .coordinate text {
        color: #475467;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .clock_time {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5%;
    }
    .clock_time_info {
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5% 10%;
        border-radius: 10px;
        border: 1px solid #EAECF0;
        background: #F9FAFB;
    }
    .type {
        color: #475467;
        text-align: center;
        font-size: 11px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.15px;
    }
    .time {
        color: #000;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: -0.5px;
    }
    button {
	  display: flex;
	  width: 90%;
	  height: 48px;
	  padding: 12px 20px;
	  margin-bottom: 5%;
	  justify-content: center;
	  align-items: center;
	  gap: 10px;
	  flex-shrink: 0;
	  border-radius: 100px;
	  border: none;
	  background: #EFC462;
	  color: #fff;
	  text-align: center;
	  font-family: Nunito;
	  font-size: 16px;
	  font-style: normal;
	  font-weight: 600;
	  line-height: 20px;
	  letter-spacing: 0.1px;
    }
</style>