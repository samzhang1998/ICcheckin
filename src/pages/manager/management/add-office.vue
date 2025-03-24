<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Add Office</text> 
        </view>
        <view class="search">
            <text>Office Name</text>
            <input v-model="name" placeholder="" class="name" />
            <text>Office Address</text>
            <input 
                v-model="searchQuery" 
                placeholder="" 
                @input="searchAddress"
                class="search_place"
                :class="autocomplete ? 'active' : ''"
            />
            <view v-if="autocomplete" class="place_card">
                <view 
                    v-for="(place, index) in places" 
                    :key="index" 
                    @click="selectPlace(place)"
                    class="place"
                >
                    {{ place.placePrediction.text.text }}
                </view>
            </view>
        </view>
        <view class="vbtm">
            <button @click="addOffice">Add this office</button>
        </view>
    </view>
</template>

<script>
    import { addCompany } from '@/api/admin';
    export default {
        data() {
            return {
                name: "",
                searchQuery: "",
                places: [],
                selectedPlace: null, 
                googleApiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968",
                autocomplete: false
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
                this.autocomplete = true;
                const url = "https://places.googleapis.com/v1/places:autocomplete";
                uni.request({
                    url: url,
                    method: "POST",
                    header: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": this.googleApiKey,
                    },
                    data: {
                        input: this.searchQuery,
                        locationBias: {
                            rectangle: {
                                low: { latitude: -44.0, longitude: 113.0 },
                                high: { latitude: -10.0, longitude: 154.0 }
                            }
                        },
                        languageCode: "en"
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            this.places = res.data.suggestions;
                            console.log("autocomplete", this.places)
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
                const placeId = place.placePrediction.placeId;
                const url = `https://places.googleapis.com/v1/places/${placeId}`;
                uni.request({
                    url: url,
                    method: "GET",
                    header: {
                        "X-Goog-Api-Key": this.googleApiKey,
                        "X-Goog-FieldMask": "id,location,formattedAddress"
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            this.searchQuery = place.placePrediction.text.text;
                            this.autocomplete = false;
                            const result = res.data;
                            this.selectedPlace = {
                                lat: result.location.latitude,
                                lng: result.location.longitude,
                                address: result.formattedAddress
                            };
                            console.log("selected place", this.selectedPlace);
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
            async addOffice () {
                const data = {
                    address: this.selectedPlace.address,
                    companyName: this.name,
                    latitude: this.selectedPlace.lat,
                    longitude: this.selectedPlace.lng,
                }
                console.log("data post", data);
                try {
                    const res = await addCompany(data);
                    if (res.data.status === 1) {
                        console.log("success create:", res);
                        uni.showToast({
                            title: "Created",
                            icon: "success",
                            duration: 3000,
                        });
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to create office", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of creating office", icon: "none" });
                }
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
            font-family: Nunito;
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
            .name {
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
            .search_place {
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
            }
            .active {
                border-bottom: none;
                border-radius: 8px 8px 0 0;
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
        .place_card {
            width: 560rpx;
            padding: 10rpx 20rpx;
            border: 1px solid #EAECF0;
            background: #fff;
            border-radius: 0 0 8px 8px;
            .place {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: start;
                gap: 10rpx;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
        }
    }
</style>