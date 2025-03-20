<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Add Office</text> 
        </view>
        <view class="search">
            <text>Office Name</text>
            <input v-model="name" placeholder="" />
            <text>Office Address</text>
            <input v-model="searchQuery" placeholder="" @input="searchAddress" />
            <view v-if="places.length > 0" class="place">
                <view 
                    v-for="(place, index) in places" 
                    :key="index" 
                    @click="selectPlace(place)">
                    {{ place.description }}
                </view>
            </view>
        </view>
        <view class="vbtm">
            <button @click="addOffice">Add this office</button>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                name: "",
                searchQuery: "",
                places: [],
                selectedPlace: null, 
                googleApiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968"
            };
        },
        methods: {
            back () {
                uni.navigateBack({
                    delta: 1
                });
            },
            searchAddress() {
                if (!this.searchQuery) return;
                const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${this.searchQuery}&key=${this.googleApiKey}&components=country:AU`;
                uni.request({
                    url: url,
                    method: "GET",
                    success: (res) => {
                    if (res.data.status === "OK") {
                        this.places = res.data.predictions;
                    } else {
                        uni.showToast({ title: "Google error", icon: "none" });
                        console.error("Google API error:", res.data);
                    }
                    },
                    fail: (err) => {
                        uni.showToast({ title: "Google error", icon: "none" });
                        console.error("fail:", err);
                    }
                });
            },
            selectPlace(place) {
                const placeId = place.place_id;
                const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.googleApiKey}`;
                uni.request({
                    url: url,
                    method: "GET",
                    success: (res) => {
                    if (res.data.status === "OK") {
                        const location = res.data.result.geometry.location;
                        this.selectedPlace = {
                            lat: location.lat,
                            lng: location.lng,
                            address: place.description
                        };
                    } else {
                        uni.showToast({ title: "Google error", icon: "none" });
                        console.error("Google API error:", res.data);
                    }
                    },
                    fail: (err) => {
                        uni.showToast({ title: "Google error", icon: "none" });
                        console.error("fail:", err);
                    }
                });
            },
            addOffice () {
                uni.navigateBack({
                    delta: 1
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .maindiv {
        width: 750rpx; 
        min-height: 100vh;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
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
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .search {
            width: 600rpx;
            padding: 30rpx 40rpx;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: start;
            border-radius: 10px;
            text {
                width: 600rpx;
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
                margin-bottom: 10rpx;
            }
            input {
                width: 560rpx;
                border-radius: 8px;
                padding: 20rpx;
                border: 1px solid #EAECF0;
                background: #fff;
                color: #344054;
                font-family: Inter;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.5px;
                margin-bottom: 20rpx;
            }
        }
        .vbtm {
            position: fixed;
            bottom: 0;
            width: 750rpx;
            height: 150rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #E9EAEC;
            background: #FEFEFE;        
            button {
                display: flex;
                width: 675rpx;
                height: 85rpx;
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
        }
    }
</style>