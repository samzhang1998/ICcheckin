<template>
    <view class="add-office">
        <view class="card-header">
            <text class="title">Add New Office</text>
            <text class="sub-title">Register a new company office location</text>
        </view>
        <view class="form-container">
            <view class="form-group">
                <text class="label">Office Name</text>
                <input v-model="name" placeholder="Enter office name" class="input-field" />
            </view>
            <view class="form-group">
                <text class="label">Office Address</text>
                <input 
                    v-model="searchQuery" 
                    placeholder="Search for address" 
                    @input="searchAddress"
                    class="input-field"
                    :class="autocomplete ? 'active' : ''"
                />
                <view v-if="autocomplete" class="autocomplete-container">
                    <view 
                        v-for="(place, index) in places" 
                        :key="index" 
                        @click="selectPlace(place)"
                        class="place-item"
                    >
                        {{ place.placePrediction.text.text }}
                    </view>
                </view>
            </view>
            <view v-if="selectedPlace" class="location-info">
                <view class="info-row">
                    <text class="info-label">Coordinates:</text>
                    <text class="info-value">{{ formatCoordinates(selectedPlace.lat, selectedPlace.lng) }}</text>
                </view>
                <view class="info-row">
                    <text class="info-label">Time Zone:</text>
                    <text class="info-value">{{ selectedPlace.timezone || 'Loading...' }}</text>
                </view>
                <view class="info-row">
                    <text class="info-label">Local Time:</text>
                    <text class="info-value">{{ selectedPlace.localTime || 'Loading...' }}</text>
                </view>
            </view>
        </view>
        <button @click="addOffice" class="add-button">Add Office Location</button>
    </view>
</template>

<script>
    import { addCompany } from '@/api/admin';
    
    export default {
        name: "AddOffice",
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
            formatCoordinates(lat, lng) {
                if (!lat || !lng) return '';
                return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            },
            searchAddress() {
                if (!this.searchQuery) {
                    this.autocomplete = false;
                    return;
                }
                
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
                            console.log("autocomplete results:", this.places);
                        } else {
                            uni.showToast({ title: "Google API error", icon: "none" });
                            console.error("Google API error:", res.data);
                        }
                    },
                    fail: (err) => {
                        uni.showToast({ title: "Request failed", icon: "none" });
                        console.error("Request failed:", err);
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
                            console.log("Selected place details:", this.selectedPlace);
                            
                            // Get timezone and local time for the selected location
                            this.getTimezoneInfo(result.location.latitude, result.location.longitude);
                        } else {
                            uni.showToast({ title: "Google API error", icon: "none" });
                            console.error("Google API error:", res.data);
                        }
                    },
                    fail: (err) => {
                        uni.showToast({ title: "Request failed", icon: "none" });
                        console.error("Request failed:", err);
                    }
                });
            },
            getTimezoneInfo(lat, lng) {
                // Get current timestamp in seconds
                const timestamp = Math.floor(Date.now() / 1000);
                const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${this.googleApiKey}`;
                
                uni.request({
                    url: url,
                    method: "GET",
                    success: (res) => {
                        if (res.statusCode === 200 && res.data.status === "OK") {
                            const tzData = res.data;
                            console.log("Timezone data:", tzData);
                            
                            // Calculate the local time at the selected location
                            const localTime = this.calculateLocalTime(
                                timestamp, 
                                tzData.rawOffset, 
                                tzData.dstOffset
                            );
                            
                            // Update the selectedPlace with timezone info
                            this.selectedPlace = {
                                ...this.selectedPlace,
                                timezone: tzData.timeZoneId,
                                timezoneName: tzData.timeZoneName,
                                utcOffset: tzData.rawOffset / 3600, // Convert seconds to hours
                                localTime: localTime,
                                rawOffset: tzData.rawOffset,
                                dstOffset: tzData.dstOffset
                            };
                        } else {
                            console.error("Timezone API error:", res.data);
                            // Fallback: Use approximate timezone based on longitude
                            this.useTimezoneFallback(lat, lng);
                        }
                    },
                    fail: (err) => {
                        console.error("Timezone request failed:", err);
                        // Fallback: Use approximate timezone based on longitude
                        this.useTimezoneFallback(lat, lng);
                    }
                });
            },
            useTimezoneFallback(lat, lng) {
                // Simple fallback to estimate timezone based on longitude
                // Each 15 degrees of longitude represents roughly 1 hour time difference
                const utcOffset = Math.round(lng / 15);
                const now = new Date();
                
                // Adjust the UTC time by the estimated offset
                const localTimestamp = now.getTime() + (utcOffset * 3600 * 1000);
                const localDate = new Date(localTimestamp);
                
                // Format the date for display
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                
                const localTimeStr = localDate.toLocaleString('en-US', options);
                
                // Update the selectedPlace with estimated timezone info
                this.selectedPlace = {
                    ...this.selectedPlace,
                    timezone: `Estimated UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`,
                    timezoneName: "Estimated",
                    utcOffset: utcOffset,
                    localTime: `${localTimeStr} (estimated)`,
                    rawOffset: utcOffset * 3600,
                    dstOffset: 0
                };
            },
            calculateLocalTime(timestamp, rawOffset, dstOffset) {
                // Calculate local time based on UTC time and offsets
                const date = new Date((timestamp + rawOffset + dstOffset) * 1000);
                
                // Format the date and time
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                };
                
                return date.toLocaleString('en-US', options);
            },
            async addOffice() {
                if (!this.name) {
                    uni.showToast({ title: "Please enter office name", icon: "none" });
                    return;
                }
                
                if (!this.selectedPlace) {
                    uni.showToast({ title: "Please select an address", icon: "none" });
                    return;
                }
                
                const data = {
                    address: this.selectedPlace.address,
                    companyName: this.name,
                    latitude: this.selectedPlace.lat,
                    longitude: this.selectedPlace.lng,
                    timezone: this.selectedPlace.timezone || null,
                    utcOffset: this.selectedPlace.utcOffset || null
                };
                
                console.log("Submitting office data:", data);
                
                try {
                    const res = await addCompany(data);
                    if (res.data && res.data.status === 1) {
                        uni.showToast({
                            title: "Office added successfully",
                            icon: "success",
                            duration: 2000,
                        });
                        
                        // Reset form after successful submission
                        this.name = "";
                        this.searchQuery = "";
                        this.selectedPlace = null;
                        
                        // Emit event to notify parent component
                        this.$emit('office-added');
                    } else {
                        uni.showToast({ 
                            title: res.data?.message || "Failed to add office", 
                            icon: "none" 
                        });
                    }
                } catch (error) {
                    console.error("Error adding office:", error);
                    uni.showToast({ 
                        title: "Error adding office", 
                        icon: "none" 
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .add-office {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
        margin-bottom: 40rpx;
    }
    
    .card-header {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-bottom: 10rpx;
    }
    
    .title {
        color: #101828;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    
    .sub-title {
        color: #475467;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        width: 100%;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        position: relative;
    }
    
    .label {
        color: #101828;
        font-size: 24rpx;
        font-weight: 500;
    }
    
    .input-field {
        width: 100%;
        height: 80rpx;
        border-radius: 8px;
        padding: 0 20rpx;
        border: 1px solid #EAECF0;
        background: #fff;
        color: #344054;
        font-size: 24rpx;
        box-sizing: border-box;
    }
    
    .input-field.active {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    
    .autocomplete-container {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-height: 300rpx;
        overflow-y: auto;
        background: #fff;
        border: 1px solid #EAECF0;
        border-top: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        z-index: 10;
    }
    
    .place-item {
        padding: 20rpx;
        font-size: 24rpx;
        color: #344054;
        border-bottom: 1px solid #F2F4F7;
    }
    
    .place-item:last-child {
        border-bottom: none;
    }
    
    .place-item:hover {
        background-color: #F9FAFB;
    }
    
    .location-info {
        margin-top: 10rpx;
        padding: 20rpx;
        background-color: #F9FAFB;
        border-radius: 8px;
        border: 1px solid #EAECF0;
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;
    }
    
    .info-row:last-child {
        margin-bottom: 0;
    }
    
    .info-label {
        color: #667085;
        font-size: 22rpx;
        font-weight: 500;
    }
    
    .info-value {
        color: #344054;
        font-size: 22rpx;
        font-weight: 600;
        text-align: right;
        max-width: 70%;
        word-break: break-word;
    }
    
    .add-button {
        display: flex;
        width: 100%;
        height: 85rpx;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        border: none;
        background: #EFC462;
        color: #fff;
        text-align: center;
        font-size: 28rpx;
        font-weight: 600;
        margin-top: 10rpx;
    }
</style>
