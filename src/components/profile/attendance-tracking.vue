<template>
  <view class="my-attendance">
    <!-- Header Bar -->
    <view class="header-bar">
      <view class="back-button" @click="goBack">
        <view class="yellow-circle">
          <text class="chevron">←</text>
        </view>
      </view>
      <text class="title">My Attendance</text>
      <view class="menu-button" @click="openMenu">
        <text class="dots">⋮</text>
      </view>
    </view>
    
    <!-- Date Selection Calendar -->
    <view class="calendar-section">
      <attendance-calendar 
        v-model="selectedDate"
        :office-location="officeLocation"
        @date-selected="onDateSelected"
      />
    </view>
    
    <!-- Offsite Leave Section -->
    <view class="leave-section" v-if="leaveInfo.length > 0">
      <text class="section-title">Offsite Leave</text>
      <view class="leave-slots">
        <view class="leave-slot" v-for="(leave, index) in leaveInfo" :key="index">
          <text class="leave-time">{{ leave.date }} {{ leave.timeSlot }}</text>
          <view class="status-badge" :class="leave.status.toLowerCase()">
            <text>{{ leave.status }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Check-In Record Timeline -->
    <view class="timeline-section">
      <text class="section-title">Check-In Record</text>
      <view class="timeline">
        <view class="timeline-item" v-for="(record, index) in checkInRecords" :key="index">
          <view class="timeline-marker" :class="record.type">
            <text class="marker-icon">{{ record.type === 'onsite' ? '✓' : '📍' }}</text>
          </view>
          <view class="timeline-connector" v-if="index < checkInRecords.length - 1"></view>
          <view class="timeline-content">
            <view class="content-header">
              <text class="action-text">{{ record.action }}</text>
              <text class="time-text">{{ record.time }}</text>
            </view>
            <text class="location-text" v-if="record.location">{{ record.location }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Map Route Tracking -->
    <view class="map-section">
      <text class="section-title">Route Tracking</text>
      <view class="map-container" id="attendance-map">
        <!-- Map will be rendered here by JavaScript -->
      </view>
      <view class="map-legend">
        <view class="legend-item">
          <view class="legend-marker office"></view>
          <text>Office Location</text>
        </view>
        <view class="legend-item" v-for="(marker, index) in offSiteMarkers" :key="index" v-if="offSiteMarkers.length > 0">
          <view class="legend-marker offsite"></view>
          <text>{{ marker.label }}</text>
        </view>
        <view class="legend-item" v-if="offSiteMarkers.length === 0">
          <text class="no-offsite">No offsite visits on this day</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AttendanceCalendar from './attendance-calendar.vue';

export default {
  components: {
    AttendanceCalendar
  },
  data() {
    return {
      selectedDate: new Date(),
      apiKey: "AIzaSyCW1YKJStLW3GXfu0ghMNiN_1ww9_Jz968", // Using the same API key from clock-in.vue
      map: null,
      infoWindow: null,
      leaveInfo: [
        { date: '14/03/2025', timeSlot: '11:00am-1:00pm', status: 'Approved' },
        { date: '14/03/2025', timeSlot: '3:00pm-5:00pm', status: 'Approved' }
      ],
      checkInRecords: [
        { type: 'onsite', action: 'Onsite Check In', time: '9:00 AM', location: null },
        { type: 'offsite', action: 'Offsite Check In', time: '11:30 AM', location: '123 Main St, Sydney', clientName: 'ABC Corp' },
        { type: 'offsite', action: 'Offsite Check Out', time: '1:30 PM', location: '123 Main St, Sydney', clientName: 'ABC Corp' },
        { type: 'offsite', action: 'Offsite Check In', time: '3:30 PM', location: '456 Park Ave, Sydney', clientName: 'XYZ Ltd' },
        { type: 'offsite', action: 'Offsite Check Out', time: '5:15 PM', location: '456 Park Ave, Sydney', clientName: 'XYZ Ltd' },
        { type: 'onsite', action: 'Onsite Check Out', time: '6:00 PM', location: null }
      ],
      showMap: true,
      officeLocation: { lat: -33.87447, lng: 151.20808 }, // Sydney office coordinates
      offSiteMarkers: [
        { 
          label: 'Mark 1', 
          position: { lat: -33.88247, lng: 151.21608 },
          time: '11:30 AM - 1:30 PM',
          clientName: 'ABC Corp',
          location: '123 Main St, Sydney'
        },
        { 
          label: 'Mark 2', 
          position: { lat: -33.86647, lng: 151.20008 },
          time: '3:30 PM - 5:15 PM',
          clientName: 'XYZ Ltd',
          location: '456 Park Ave, Sydney'
        }
      ]
    };
  },
  mounted() {
    this.loadGoogleMapsScript();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    openMenu() {
      uni.showActionSheet({
        itemList: ['Export Data', 'Filter View', 'Settings'],
        success: (res) => {
          console.log('Selected option:', res.tapIndex);
        }
      });
    },
    loadGoogleMapsScript() {
      if (typeof window !== 'undefined') {
        if (window.google && window.google.maps) {
          this.initMap();
        } else {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initAttendanceMap&loading=async&libraries=marker`;
          script.async = true;
          script.defer = true;
          
          // Define global callback
          window.initAttendanceMap = this.initMap;
          
          document.head.appendChild(script);
        }
      } else {
        // Handle non-browser environment (like SSR)
        console.log('Window object not available');
      }
    },
    initMap() {
      try {
        // Check if map container exists
        const mapContainer = document.getElementById('attendance-map');
        if (!mapContainer) {
          console.log("Map container not found, retrying...");
          setTimeout(this.initMap, 100);
          return;
        }
        
        console.log("Initializing map with office location:", this.officeLocation);
        console.log("Offsite markers:", this.offSiteMarkers);
        
        // Create map with grayscale style
        const mapStyles = [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ saturation: -100 }]
          },
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [{ saturation: -100 }]
          }
        ];
        
        this.map = new google.maps.Map(mapContainer, {
          center: this.officeLocation,
          zoom: 14,
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true
        });
        
        // Create a single info window to be reused
        this.infoWindow = new google.maps.InfoWindow();
        
        // Add office marker
        this.addMarker(
          this.officeLocation, 
          'Office', 
          '#4CAF50', 
          {
            location: 'Company Office',
            time: '9:00 AM - 6:00 PM',
            clientName: 'Your Company'
          }
        );
        
        // Add offsite markers if they exist
        if (this.offSiteMarkers && this.offSiteMarkers.length > 0) {
          this.offSiteMarkers.forEach(marker => {
            if (marker && marker.position) {
              this.addMarker(
                marker.position,
                marker.label || 'Location',
                '#2196F3',
                {
                  location: marker.location || 'Unknown Location',
                  time: marker.time || 'N/A',
                  clientName: marker.clientName || 'Unknown Client'
                }
              );
            } else {
              console.warn("Invalid marker data:", marker);
            }
          });
          
          // Draw route lines
          this.drawRoute();
        } else {
          console.log("No offsite markers to add");
        }
        
        // Fit map to show all markers or just center on office
        if (this.offSiteMarkers && this.offSiteMarkers.length > 0) {
          this.fitMapToBounds();
        } else {
          // If no offsite markers, just center on office with appropriate zoom
          this.map.setCenter(this.officeLocation);
          this.map.setZoom(15);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    },
    addMarker(position, label, color, info) {
      // Ensure info object has all required properties with defaults
      const safeInfo = {
        location: info?.location || 'Unknown Location',
        time: info?.time || 'N/A',
        clientName: info?.clientName || 'N/A'
      };
      
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: label,
        icon: {
          url: color === '#4CAF50' ? 
            'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 
            'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });
      
      // Add click event to show info window
      marker.addListener('click', () => {
        const contentString = `
          <div class="info-window">
            <h3>${label}</h3>
            <p><strong>Location:</strong> ${safeInfo.location}</p>
            <p><strong>Time:</strong> ${safeInfo.time}</p>
            <p><strong>Client:</strong> ${safeInfo.clientName}</p>
          </div>
        `;
        
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(this.map, marker);
      });
      
      return marker;
    },
    drawRoute() {
      // Check if we have markers to draw
      if (!this.offSiteMarkers || this.offSiteMarkers.length === 0) {
        console.log("No offsite markers to draw route");
        return;
      }
      
      try {
        // Create array of coordinates for the route in chronological order
        let routePoints = [];
        let markers = [];
        
        // Add office as first point if it exists
        const officeMarker = { 
          position: this.officeLocation,
          time: '9:00 AM', // Start of day
          order: 1
        };
        routePoints.push(officeMarker);
        markers.push(officeMarker);
        
        // Add offsite markers with their visit order
        this.offSiteMarkers.forEach((marker, index) => {
          // Ensure marker has all required properties
          if (!marker || !marker.position || !marker.time) {
            console.warn("Invalid marker data:", marker);
            return;
          }
          
          const times = marker.time.split(' - ');
          const checkInTime = times[0] || '12:00 PM'; // Default if missing
          
          const checkInMarker = {
            position: marker.position,
            time: checkInTime,
            order: index + 2 // Start after office
          };
          
          markers.push(checkInMarker);
        });
        
        // Sort all markers by time
        markers.sort((a, b) => {
          return this.parseTime(a.time) - this.parseTime(b.time);
        });
        
        // Create the route in chronological order
        routePoints = markers.map(marker => marker.position);
        
        // Create the polyline with numbered markers
        const polyline = new google.maps.Polyline({
          path: routePoints,
          geodesic: true,
          strokeColor: '#2196F3',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          map: this.map
        });
        
        // Add numbered markers along the path
        markers.forEach((marker, index) => {
          if (index > 0) { // Skip first point
            try {
              // Calculate midpoint between this marker and previous marker
              const prevPosition = markers[index - 1].position;
              const currPosition = marker.position;
              
              const midLat = (prevPosition.lat + currPosition.lat) / 2;
              const midLng = (prevPosition.lng + currPosition.lng) / 2;
              
              // Add a numbered marker with custom dark blue circle and white number
              new google.maps.Marker({
                position: { lat: midLat, lng: midLng },
                map: this.map,
                label: {
                  text: index.toString(),
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 'bold'
                },
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#0D47A1', // Dark blue color
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 12
                }
              });
            } catch (error) {
              console.error("Error adding numbered marker:", error);
            }
          }
        });
      } catch (error) {
        console.error("Error drawing route:", error);
      }
    },
    fitMapToBounds() {
      const bounds = new google.maps.LatLngBounds();
      
      // Add office location to bounds
      bounds.extend(this.officeLocation);
      
      // Add all offsite markers to bounds
      this.offSiteMarkers.forEach(marker => {
        bounds.extend(marker.position);
      });
      
      // Fit the map to the bounds
      this.map.fitBounds(bounds);
    },
    onDateSelected(data) {
      this.selectedDate = data.date;
      
      // Update offsite markers based on the selected date's locations
      this.offSiteMarkers = data.locations && data.locations.length > 0 
        ? data.locations.filter(loc => loc.type === 'offsite')
        : [];
      
      // Update check-in records based on the locations
      this.checkInRecords = [];
      
      if (data.locations && data.locations.length > 0) {
        // Add office check-in if present
        const officeLocation = data.locations.find(loc => loc.type === 'office');
        if (officeLocation) {
          this.checkInRecords.push({
            type: 'onsite',
            action: 'Onsite Check In',
            time: officeLocation.time.split(' - ')[0],
            location: null
          });
        }
        
        // Add offsite check-ins
        data.locations.filter(loc => loc.type === 'offsite').forEach(loc => {
          const times = loc.time.split(' - ');
          
          // Add check-in
          this.checkInRecords.push({
            type: 'offsite',
            action: 'Offsite Check In',
            time: times[0],
            location: loc.location,
            clientName: loc.clientName
          });
          
          // Add check-out
          this.checkInRecords.push({
            type: 'offsite',
            action: 'Offsite Check Out',
            time: times[1],
            location: loc.location,
            clientName: loc.clientName
          });
        });
        
        // Add office check-out if present
        if (officeLocation) {
          this.checkInRecords.push({
            type: 'onsite',
            action: 'Onsite Check Out',
            time: officeLocation.time.split(' - ')[1],
            location: null
          });
        }
        
        // Sort records by time
        this.checkInRecords.sort((a, b) => {
          const timeA = this.parseTime(a.time);
          const timeB = this.parseTime(b.time);
          return timeA - timeB;
        });
        
        // Set leave info if it's a leave day
        const leaveLocation = data.locations.find(loc => loc.type === 'leave');
        if (leaveLocation) {
          this.leaveInfo = [
            { 
              date: this.formatDateForDisplay(data.date), 
              timeSlot: 'All Day', 
              status: 'Approved' 
            }
          ];
        } else {
          this.leaveInfo = [];
        }
      } else {
        this.leaveInfo = [];
      }
      
      // Always update the map
      this.$nextTick(() => {
        this.loadGoogleMapsScript();
      });
    },
    parseTime(timeStr) {
      // Convert time string like "9:00 AM" to minutes since midnight
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    },
    formatDateForDisplay(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    fetchAttendanceData(date) {
      // This would be an API call in a real app
      // For now, we'll just simulate different data for different dates
      const formattedDate = this.formatDate(date);
      
      if (formattedDate === '2025-03-14') {
        this.leaveInfo = [
          { date: '14/03/2025', timeSlot: '11:00am-1:00pm', status: 'Approved' },
          { date: '14/03/2025', timeSlot: '3:00pm-5:00pm', status: 'Approved' }
        ];
        this.checkInRecords = [
          { type: 'onsite', action: 'Onsite Check In', time: '9:00 AM', location: null },
          { type: 'offsite', action: 'Offsite Check In', time: '11:30 AM', location: '123 Main St, Sydney', clientName: 'ABC Corp' },
          { type: 'offsite', action: 'Offsite Check Out', time: '1:30 PM', location: '123 Main St, Sydney', clientName: 'ABC Corp' },
          { type: 'offsite', action: 'Offsite Check In', time: '3:30 PM', location: '456 Park Ave, Sydney', clientName: 'XYZ Ltd' },
          { type: 'offsite', action: 'Offsite Check Out', time: '5:15 PM', location: '456 Park Ave, Sydney', clientName: 'XYZ Ltd' },
          { type: 'onsite', action: 'Onsite Check Out', time: '6:00 PM', location: null }
        ];
        this.offSiteMarkers = [
          { 
            label: 'Mark 1', 
            position: { lat: -33.88247, lng: 151.21608 },
            time: '11:30 AM - 1:30 PM',
            clientName: 'ABC Corp',
            location: '123 Main St, Sydney'
          },
          { 
            label: 'Mark 2', 
            position: { lat: -33.86647, lng: 151.20008 },
            time: '3:30 PM - 5:15 PM',
            clientName: 'XYZ Ltd',
            location: '456 Park Ave, Sydney'
          }
        ];
        this.showMap = true;
      } else if (formattedDate === '2025-03-15') {
        this.leaveInfo = [];
        this.checkInRecords = [
          { type: 'onsite', action: 'Onsite Check In', time: '8:45 AM', location: null },
          { type: 'onsite', action: 'Onsite Check Out', time: '5:30 PM', location: null }
        ];
        this.offSiteMarkers = [];
        this.showMap = false;
      } else {
        this.leaveInfo = [];
        this.checkInRecords = [];
        this.offSiteMarkers = [];
        this.showMap = false;
      }
      
      // Update map if needed
      if (this.showMap) {
        this.$nextTick(() => {
          this.loadGoogleMapsScript();
        });
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
.my-attendance {
  background-color: #FFFFFF;
  padding: 20rpx;
  min-height: 100vh;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 30rpx;
}

.back-button {
  width: 70rpx;
  height: 70rpx;
}

.yellow-circle {
  width: 60rpx;
  height: 60rpx;
  background-color: #EFC462;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chevron {
  color: #000000;
  font-size: 32rpx;
  font-weight: bold;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #101828;
}

.dots {
  font-size: 40rpx;
  font-weight: bold;
  color: #101828;
}

.calendar-section {
  margin-bottom: 40rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #101828;
  margin-bottom: 20rpx;
}

.leave-section {
  margin-bottom: 40rpx;
}

.leave-slots {
  background-color: #F9FAFB;
  border-radius: 12rpx;
  padding: 20rpx;
}

.leave-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1px solid #EBECEE;
}

.leave-slot:last-child {
  border-bottom: none;
}

.leave-time {
  font-size: 28rpx;
  color: #101828;
}

.status-badge {
  padding: 6rpx 16rpx;
  border-radius: 100rpx;
  font-size: 24rpx;
}

.status-badge.approved {
  background-color: #E6F4EA;
  color: #137333;
}

.status-badge.pending {
  background-color: #FEF7E0;
  color: #B54708;
}

.status-badge.rejected {
  background-color: #FEEAE6;
  color: #B3261E;
}

.timeline-section {
  margin-bottom: 40rpx;
}

.timeline {
  position: relative;
  padding-left: 30rpx;
}

.timeline-item {
  position: relative;
  padding-bottom: 30rpx;
}

.timeline-marker {
  position: absolute;
  left: -30rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.timeline-marker.onsite {
  background-color: #4CAF50;
  color: white;
}

.timeline-marker.offsite {
  background-color: #2196F3;
  color: white;
}

.marker-icon {
  font-size: 20rpx;
}

.timeline-connector {
  position: absolute;
  left: -15rpx;
  top: 30rpx;
  width: 2rpx;
  height: calc(100% - 30rpx);
  background-color: #D0D5DD;
  z-index: 1;
}

.timeline-content {
  background-color: #F9FAFB;
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
}

.content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rpx;
}

.action-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #101828;
}

.time-text {
  font-size: 24rpx;
  color: #667085;
}

.location-text {
  font-size: 24rpx;
  color: #667085;
}

.map-section {
  margin-bottom: 40rpx;
}

.map-container {
  height: 400rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background-color: #F5F5F5;
}

/* Info window styling */
.gm-style .gm-style-iw-c {
  padding: 12px !important;
  border-radius: 8px !important;
}

.info-window h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  color: #101828;
}

.info-window p {
  margin: 4px 0;
  font-size: 14px;
  color: #475467;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.legend-marker {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.legend-marker.office {
  background-color: #4CAF50;
}

.legend-marker.offsite {
  background-color: #2196F3;
}
</style>
.no-offsite {
  color: #667085;
  font-size: 24rpx;
  font-style: italic;
}
