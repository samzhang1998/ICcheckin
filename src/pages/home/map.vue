<template>
    <view class="clock_in">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>Check in recordings in China</text>
        </view>
        <map 
            style="width: 750rpx; height: 500rpx"
            :latitude="userCn.lat"
            :longitude="userCn.lng"
            :markers="markersCn"
            scale="17"
        ></map>
        <text>Check in recordings in Australia</text>
        <view class="map">
            <!-- <web-view :src="googleMapUrl" :style="{width: '750rpx', height: '300rpx'}" /> -->
            <iframe
                :src="googleMapUrl"
                width="100%"
                height="150%"
                style="border: 0;"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                loading="lazy">
            </iframe>
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                lat: "-33.874116301818525",
                lng: "151.20795194094683",
                apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                googleMapUrl: 'static/googlemap.html',
                userCn: {
                    lat: "",
                    lng: ""
                },
                markersCn: [
                    {
                        id: 1,
                        latitude: 23.186899,
                        longitude: 113.419151,
                        iconPath: "/static/Leave_approved.png",
                        width: 30,
                        height: 30,
                        callout: {
                            content: "Check In",
                            color: "#ffffff",
                            fontSize: 12,
                            borderRadius: 5,
                            bgColor: "#007AFF",
                            padding: 0,
                            display: "ALWAYS"
                        }
                    },
                    {
                        id: 2,
                        latitude: 23.187399,
                        longitude: 113.418651,
                        iconPath: "/static/Leave_approved.png",
                        width: 30,
                        height: 30,
                        callout: {
                            content: "Meeting",
                            color: "#ffffff",
                            fontSize: 12,
                            borderRadius: 5,
                            bgColor: "#007AFF",
                            padding: 0,
                            display: "ALWAYS"
                        }
                    },
                    {
                        id: 3,
                        latitude: 23.186499,
                        longitude: 113.419851,
                        iconPath: "/static/Leave_approved.png",
                        width: 30,
                        height: 30,
                        callout: {
                            content: "Check Out",
                            color: "#ffffff",
                            fontSize: 12,
                            borderRadius: 5,
                            bgColor: "#007AFF",
                            padding: 0,
                            display: "ALWAYS"
                        }
                    }
                ],
                markersAu: [
                    { lat: -33.87401179677703, lng: 151.20792194207306, title: "Check In" },
                    { lat: -33.86979975181109, lng: 151.21025362784482, title: "Meeting" },
                    { lat: -33.87467096986611, lng: 151.20780392488683, title: "Check Out" },
                ]
            }
        },
        methods: {
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
            },
            async getLocation () {
                return new Promise((resolve, reject) => {
                    uni.getLocation({
                        type: "wgs84",
                        success: (res) => {
                            this.userCn.lat = res.latitude;
                            this.userCn.lng = res.longitude;
                            resolve({ lat: this.userCn.lat, lng: this.userCn.lng });
                        },
                        fail: (err) => {
                            console.error("failed GPS:", err);
                            uni.showToast({ title: "cannot get location", icon: "none" });
                            reject(err);
                        }
                    });
                });
            }
        },
        async mounted () {
            await this.getLocation();
            const encodedMarkers = encodeURIComponent(JSON.stringify(this.markersAu));
            this.googleMapUrl = `static/googlemap.html?markers=${encodedMarkers}`;
        }
    }
</script>

<style scoped lang="scss">
    .clock_in {
        width: 750rpx;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 30rpx;
        align-items: center;
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
    text {
        color: #101828;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 35rpx;
        font-weight: 600;
        line-height: 140%;
        text-align: center;
    }
    .map {
        width: 750rpx;
        height: 300rpx;
    }
</style>