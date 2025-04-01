<template>
    <view class="map-location">
        <view class="recording_title">
            <text class="title">Current Location</text>
            <text class="sub_title">GPS Coordinates</text>
        </view>
        <view class="map-container">
            <view class="map" id="map-container">
                <!-- Custom map will be rendered here -->
                <view v-if="!mapLoaded" class="loading-map">
                    <text>Loading map...</text>
                </view>
            </view>
            <view class="location-info">
                <view class="coordinate">
                    <image src="/static/Check_location.png" alt="check"></image>
                    <text>lat {{ formatCoordinate(lat) }}, long {{ formatCoordinate(lng) }}</text>
                </view>
                <text class="address">{{ address }}</text>
                <view class="status-indicator">
                    <view class="status-dot" :class="{ 'in-range': isInRange }"></view>
                    <text>{{ isInRange ? 'Within check-in range' : 'Outside check-in range' }}</text>
                </view>
                <view class="distance-info">
                    <text>Distance to office: {{ distanceToOffice }}</text>
                </view>
            </view>
        </view>
        <button 
            :class="{ 'in-range': isInRange }" 
            @click="handleCheckAction">
            {{ isInRange ? 'Onsite Check In' : 'Onsite Check Out' }}
        </button>
    </view>
</template>

<script>
export default {
    props: {
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        },
        address: {
            type: String,
            default: ''
        },
        apiKey: {
            type: String,
            required: true
        },
        isClockedIn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // Company location: 33°52'28.1"S 151°12'29.1"E (Sydney, Australia)
            // Converting from DMS to decimal degrees:
            // South latitude is negative
            companyLat: -33.87447, // 33°52'28.1"S = -(33 + 52/60 + 28.1/3600)
            companyLng: 151.20808, // 151°12'29.1"E = 151 + 12/60 + 29.1/3600
            // Allowed radius in meters
            allowedRadius: 200,
            mapLoaded: false,
            map: null,
            userMarker: null,
            companyMarker: null,
            radiusCircle: null
        }
    },
    computed: {
        isInRange() {
            if (!this.lat || !this.lng) return false;
            
            // Calculate distance between user and company location
            const distance = this.calculateDistance(
                this.lat, this.lng,
                this.companyLat, this.companyLng
            );
            
            // Check if user is within allowed radius
            return distance <= this.allowedRadius;
        },
        distanceToOffice() {
            if (!this.lat || !this.lng) return "Unknown";
            
            const distance = this.calculateDistance(
                this.lat, this.lng,
                this.companyLat, this.companyLng
            );
            
            if (distance < 1000) {
                return `${Math.round(distance)} meters`;
            } else {
                return `${(distance / 1000).toFixed(2)} km`;
            }
        }
    },
    mounted() {
        this.loadGoogleMapsScript();
    },
    watch: {
        lat() {
            this.updateMap();
        },
        lng() {
            this.updateMap();
        }
    },
    methods: {
        loadGoogleMapsScript() {
            if (window.google && window.google.maps) {
                this.initMap();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initGoogleMap&loading=async&libraries=marker`;
            script.async = true;
            script.defer = true;
            
            // Define global callback
            window.initGoogleMap = this.initMap;
            
            document.head.appendChild(script);
        },
        initMap() {
            if (!document.getElementById('map-container')) {
                setTimeout(this.initMap, 100);
                return;
            }

            // Create map centered on company location
            this.map = new google.maps.Map(document.getElementById('map-container'), {
                center: { lat: this.companyLat, lng: this.companyLng },
                zoom: 14, // Changed from 16 to 14 for a more zoomed out view
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                zoomControl: true
            });

            // Add company marker (red pin)
            this.companyMarker = new google.maps.Marker({
                position: { lat: this.companyLat, lng: this.companyLng },
                map: this.map,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                },
                title: 'Office Location'
            });

            // Add radius circle (transparent orange)
            this.radiusCircle = new google.maps.Circle({
                strokeColor: '#EFC462',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#EFC462',
                fillOpacity: 0.35,
                map: this.map,
                center: { lat: this.companyLat, lng: this.companyLng },
                radius: this.allowedRadius
            });

            // Add user marker if coordinates are available
            if (this.lat && this.lng) {
                this.addUserMarker();
            }

            this.mapLoaded = true;
        },
        addUserMarker() {
            if (!this.map) return;

            // Remove existing marker if any
            if (this.userMarker) {
                this.userMarker.setMap(null);
            }

            // Add user marker (blue dot)
            this.userMarker = new google.maps.Marker({
                position: { lat: this.lat, lng: this.lng },
                map: this.map,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                },
                title: 'Your Location'
            });

            // Adjust map to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: this.companyLat, lng: this.companyLng });
            bounds.extend({ lat: this.lat, lng: this.lng });
            this.map.fitBounds(bounds);
            
            // Don't zoom in too much even if points are close
            const currentZoom = this.map.getZoom();
            if (currentZoom > 14) {
                this.map.setZoom(14);
            }
        },
        updateMap() {
            if (this.lat && this.lng && this.map) {
                this.addUserMarker();
                
                // Don't zoom in too much even if points are close
                const currentZoom = this.map.getZoom();
                if (currentZoom > 14) {
                    this.map.setZoom(14);
                }
            }
        },
        calculateDistance(lat1, lon1, lat2, lon2) {
            // Haversine formula to calculate distance between two points on Earth
            const R = 6371e3; // Earth's radius in meters
            const φ1 = this.toRadians(lat1);
            const φ2 = this.toRadians(lat2);
            const Δφ = this.toRadians(lat2 - lat1);
            const Δλ = this.toRadians(lon2 - lon1);

            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            return distance; // Distance in meters
        },
        toRadians(degrees) {
            return degrees * Math.PI / 180;
        },
        formatCoordinate(value) {
            return value ? value.toFixed(5) : '0.00000';
        },
        handleCheckAction() {
            if (!this.isInRange && !this.isClockedIn) {
                // If out of range and not clocked in, show error
                uni.showToast({
                    title: 'You must be within range to check in',
                    icon: 'none'
                });
                return;
            }
            
            // Emit event to parent component to handle check in/out
            this.$emit('check-action', {
                isInRange: this.isInRange,
                lat: this.lat,
                lng: this.lng,
                address: this.address
            });
        }
    }
};
</script>

<style scoped>
.map-location {
    width: 600rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
    border-radius: 10px;
    background: #FEFEFE;
}

.recording_title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom: 20rpx;
}

.title {
    color: #101828;
    font-size: 26rpx;
    font-weight: 600;
    line-height: 140%;
}

.sub_title {
    color: #667085;
    font-size: 22rpx;
    font-weight: 400;
    line-height: 140%;
}

.map-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #EBECEE;
    background: #F9F9F9;
    margin-bottom: 20rpx;
}

.map {
    width: 100%;
    height: 300rpx;
    position: relative;
}

.loading-map {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.location-info {
    width: 100%;
    padding: 20rpx;
    background-color: #F9FAFB;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.coordinate {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10rpx;
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

.address {
    color: #101828;
    font-size: 22rpx;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: -0.2px;
}

.status-indicator {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10rpx;
    margin-top: 10rpx;
}

.status-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background-color: #667085;
}

.status-dot.in-range {
    background-color: #EFC462;
}

.status-indicator text {
    color: #475467;
    font-size: 22rpx;
    font-weight: 500;
}

.distance-info {
    margin-top: 10rpx;
    padding: 5rpx 0;
}

.distance-info text {
    color: #475467;
    font-size: 22rpx;
    font-weight: 500;
}

button {
    display: flex;
    width: 100%;
    height: 85rpx;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 100px;
    border: none;
    background: #141414;
    color: #fff;
    text-align: center;
    font-family: Nunito;
    font-size: 30rpx;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.1px;
}

button.in-range {
    background: #EFC462;
}
</style>
