<template>
    <view class="map-location">
        <view class="recording_title">
            <text class="title">Current Location</text>
            <text class="sub_title">GPS Coordinates</text>
        </view>
        <view class="map-container">
            <view class="map" id="map-container" ref="mapElement">
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
                    <text class="status-text">{{ isInRange ? 'In range' : 'Out of range' }}</text>
                </view>
                <text class="distance">Distance to office: {{ distanceToOffice }}</text>
            </view>
        </view>
        <view class="check-button" @click="handleCheckAction">
            <text>{{ isClockedIn ? 'Check Out' : 'Check In' }}</text>
        </view>
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
        },
        isPc: {
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
            // Allowed radius in meters - increased for testing
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
        
        // Adjust map size for PC if needed
        if (this.isPc) {
            this.$nextTick(() => {
                const mapContainer = document.getElementById('map-container');
                if (mapContainer) {
                    mapContainer.style.height = '400px';
                }
            });
        }
        
        // Add resize observer to adjust container height after map loads
        this.$nextTick(() => {
            this.setupResizeObserver();
        });
    },
    watch: {
        isPc(newVal) {
            if (newVal && this.map) {
                // Resize map when switching to PC mode
                this.$nextTick(() => {
                    const mapContainer = document.getElementById('map-container');
                    if (mapContainer) {
                        mapContainer.style.height = '400px';
                        // Trigger resize event on the map to update its size
                        google.maps.event.trigger(this.map, 'resize');
                        // Re-center the map
                        this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
                    }
                });
            }
        },
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
            window.initGoogleMap = () => {
                // Make sure google is defined before calling initMap
                if (window.google && window.google.maps) {
                    this.initMap();
                } else {
                    console.error("Google Maps API loaded but google.maps is not available");
                }
            };
            
            document.head.appendChild(script);
        },
        initMap() {
            if (!document.getElementById('map-container')) {
                setTimeout(this.initMap, 100);
                return;
            }

            try {
                // Check if google maps is available
                if (!google || !google.maps) {
                    console.error("Google Maps API not loaded");
                    return;
                }

                // Create map centered on company location
                this.map = new google.maps.Map(document.getElementById('map-container'), {
                    center: { lat: this.companyLat, lng: this.companyLng },
                    zoom: 14, // Changed from 16 to 14 for a more zoomed out view
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    zoomControl: true,
                    fullscreenControl: false,
                    gestureHandling: 'cooperative',
                    mapTypeControl: false,
                    streetViewControl: false
                });

                // Add company marker (invisible base marker for click events)
                this.companyMarker = new google.maps.Marker({
                    position: { lat: this.companyLat, lng: this.companyLng },
                    map: this.map,
                    title: 'Office Location',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillOpacity: 0,
                        strokeOpacity: 0,
                        scale: 1
                    }
                });
                
                // Add yellow circle background for company marker
                new google.maps.Marker({
                    position: { lat: this.companyLat, lng: this.companyLng },
                    map: this.map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#EFC462',
                        fillOpacity: 1,
                        strokeColor: '#EFC462',
                        strokeWeight: 1,
                        scale: 15
                    },
                    clickable: false,
                    zIndex: 1
                });
                
                // Add white building icon on top of yellow circle
                new google.maps.Marker({
                    position: { lat: this.companyLat, lng: this.companyLng },
                    map: this.map,
                    icon: {
                        // Building icon with white color
                        path: 'M15,11V5.83c0-0.53-0.21-1.04-0.59-1.41L12.7,2.71c-0.39-0.39-1.02-0.39-1.41,0l-1.7,1.7C9.21,4.79,9,5.3,9,5.83V7H5C3.9,7,3,7.9,3,9v10c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-8C21,11.9,20.1,11,19,11H15z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M13,19h-2v-2h2V19z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M13,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z',
                        fillColor: '#FFFFFF',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 1,
                        scale: 1,
                        anchor: new google.maps.Point(12, 12)
                    },
                    clickable: false,
                    zIndex: 2
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
                
                // Adjust container height after map loads
                setTimeout(() => {
                    this.adjustContainerHeight();
                }, 500);
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        },
        addUserMarker() {
            try {
                if (!this.map) return;

                // Remove existing marker if any
                if (this.userMarker) {
                    this.userMarker.setMap(null);
                }

                // Add user marker (white circle with blue center)
                this.userMarker = new google.maps.Marker({
                    position: { lat: this.lat, lng: this.lng },
                    map: this.map,
                    icon: {
                        // Custom SVG for white circle with blue inner circle
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#FFFFFF',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        scale: 15
                    },
                    title: 'Your Location',
                    zIndex: 1
                });
                
                // Add the inner blue circle (40% of white circle size)
                new google.maps.Marker({
                    position: { lat: this.lat, lng: this.lng },
                    map: this.map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#2196F3',
                        fillOpacity: 1,
                        strokeWeight: 0,
                        scale: 6 // 40% of the white circle (15 * 0.4 = 6)
                    },
                    clickable: false,
                    zIndex: 2
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
                
                // Adjust container height after adding user marker
                this.adjustContainerHeight();
            } catch (error) {
                console.error("Error adding user marker:", error);
            }
        },
        updateMap() {
            try {
                if (this.lat && this.lng && this.map) {
                    this.addUserMarker();
                    
                    // Don't zoom in too much even if points are close
                    const currentZoom = this.map.getZoom();
                    if (currentZoom > 14) {
                        this.map.setZoom(14);
                    }
                }
            } catch (error) {
                console.error("Error updating map:", error);
            }
        },
        calculateDistance(lat1, lon1, lat2, lon2) {
            try {
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
            } catch (error) {
                console.error("Error calculating distance:", error);
                return 0;
            }
        },
        toRadians(degrees) {
            try {
                return degrees * Math.PI / 180;
            } catch (error) {
                console.error("Error converting to radians:", error);
                return 0;
            }
        },
        formatCoordinate(value) {
            try {
                return value ? value.toFixed(5) : '0.00000';
            } catch (error) {
                console.error("Error formatting coordinate:", error);
                return '0.00000';
            }
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
        },
        
        setupResizeObserver() {
            // Check if ResizeObserver is available
            if (typeof ResizeObserver !== 'undefined') {
                const mapContainer = document.getElementById('map-container');
                const mapLocation = document.querySelector('.map-location');
                
                if (mapContainer && mapLocation) {
                    const observer = new ResizeObserver(entries => {
                        // When map container size changes, adjust the parent container
                        this.adjustContainerHeight();
                    });
                    
                    // Start observing the map container
                    observer.observe(mapContainer);
                }
            } else {
                // Fallback for browsers without ResizeObserver
                window.addEventListener('resize', this.adjustContainerHeight);
                // Also adjust after map loads
                setTimeout(this.adjustContainerHeight, 1000);
            }
        },
        
        adjustContainerHeight() {
            const mapContainer = document.getElementById('map-container');
            const mapLocation = document.querySelector('.map-location');
            const locationInfo = document.querySelector('.location-info');
            
            if (mapContainer && mapLocation && locationInfo) {
                // Get the actual height of all content
                const mapHeight = mapContainer.offsetHeight;
                const infoHeight = locationInfo.offsetHeight;
                const titleHeight = document.querySelector('.recording_title')?.offsetHeight || 0;
                const buttonHeight = document.querySelector('.check-button')?.offsetHeight || 0;
                
                // Calculate total content height plus padding
                const totalContentHeight = mapHeight + infoHeight + titleHeight + buttonHeight + 80; // 80 for padding
                
                // Set the container height to fit all content
                mapLocation.style.height = `${totalContentHeight}px`;
                
                // Trigger map resize if Google Maps is loaded
                if (window.google && window.google.maps && this.map) {
                    google.maps.event.trigger(this.map, 'resize');
                }
            }
        }
    }
};
</script>

<style scoped>
.map-location {
    width: 800px;
    padding: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
    border-radius: 10px;
    background: #FEFEFE;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    /* Increase the container's min-height to better accommodate the map */
    min-height: 700px;
    overflow: visible;
}


.recording_title {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;
}

.title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.sub_title {
    font-size: 24rpx;
    color: #999;
}

.map-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    position: relative; /* Added position relative */
    z-index: 1; /* Added z-index */
}

.map {
    width: 90%;
    /* Set a fixed height for the map instead of percentage */
    height: 300px; /* Adjust this value as needed */
    border-radius: 10px;
    overflow: hidden; /* Keep this as hidden to maintain border radius */
    margin: 0 auto 20rpx auto;
    position: relative;
}
.loading-map {
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 10px;
}

.location-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20rpx;
}

.coordinate {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
}

.coordinate image {
    width: 32rpx;
    height: 32rpx;
    margin-right: 10rpx;
}

.coordinate text {
    font-size: 28rpx;
    color: #333;
}

.address {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 20rpx;
    padding-left: 42rpx;
}

.status-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
}

.status-dot {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: #ff4d4f;
    margin-right: 10rpx;
}

.status-dot.in-range {
    background-color: #52c41a;
}

.status-text {
    font-size: 28rpx;
    color: #333;
}

.distance {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
}

.check-button {
    margin-top: 30rpx;
    width: 80%;
    height: 80rpx;
    background-color: #1890ff;
    border-radius: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 32rpx;
    font-weight: bold;
}

/* PC specific styles */
@media screen and (min-width: 768px) {
    .map-location {
        width: 800rpx;
        padding: 60rpx;
    }
    
    .map {
        height: 500rpx;
    }
    
    .title {
        font-size: 44rpx;
    }
    
    .sub_title {
        font-size: 28rpx;
    }
}
</style>