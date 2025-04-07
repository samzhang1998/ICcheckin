<template>
  <view class="attendance-calendar">
    <view class="calendar-header">
      <text class="month-title">{{ currentMonthName }} {{ currentYear }}</text>
    </view>
    
    <scroll-view 
      class="days-scroll" 
      scroll-x 
      :scroll-left="initialScrollPosition"
      @scroll="handleScroll"
      :show-scrollbar="false"
      ref="daysScroll"
    >
      <view class="days-container">
        <view 
          v-for="(day, index) in visibleDays" 
          :key="index" 
          class="day-cell" 
          :class="{ 
            'today': day.isToday,
            'past': day.isPast,
            'future': day.isFuture,
            'has-events': day.hasEvents,
            'selected': isSelected(day.date)
          }"
          @click="selectDate(day)"
        >
          <view class="day-name">{{ weekdays[day.date.getDay()] }}</view>
          <view class="day-number" :class="{ 'today-number': day.isToday }">{{ day.dayNumber }}</view>
          <view v-if="day.hasEvents" class="event-indicators">
            <view 
              v-for="(eventType, i) in day.eventTypes" 
              :key="i" 
              class="event-dot"
              :class="eventType"
            ></view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    officeLocation: {
      type: Object,
      default: () => ({ lat: -33.87447, lng: 151.20808 }) // Sydney office coordinates
    }
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: this.value,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      mockEvents: {},
      mockLocations: {},
      visibleDays: [],
      initialScrollPosition: 0,
      dayWidth: 100, // Width of each day cell in rpx
      daysToShow: 60, // Show 60 days (about 2 months)
      cutoffDate: new Date() // Default to today, will be adjusted to 5 days before
    };
  },
  computed: {
    currentYear() {
      return this.selectedDate.getFullYear();
    },
    currentMonth() {
      return this.selectedDate.getMonth();
    },
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('default', { month: 'long' });
    }
  },
  created() {
    // Set cutoff date to 5 days in the future
    this.cutoffDate = new Date();
    this.cutoffDate.setDate(this.cutoffDate.getDate() + 5);
    
    this.generateVisibleDays();
    this.generateMockData();
  },
  mounted() {
    // Scroll to today's date
    this.$nextTick(() => {
      const todayIndex = this.visibleDays.findIndex(day => day.isToday);
      if (todayIndex !== -1) {
        // Calculate position to center today
        const scrollViewWidth = 750; // Default uni-app width in rpx
        const centerPosition = (todayIndex * this.dayWidth) - (scrollViewWidth / 2) + (this.dayWidth / 2);
        this.initialScrollPosition = centerPosition > 0 ? centerPosition : 0;
      }
    });
  },
  methods: {
    generateVisibleDays() {
      const days = [];
      const today = new Date();
      
      // Start from 30 days ago
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 30);
      
      // End at 30 days in the future
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30);
      
      // Generate all days in the range
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        days.push(this.createDayObject(new Date(date)));
      }
      
      this.visibleDays = days;
    },
    createDayObject(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      
      const isToday = compareDate.getTime() === today.getTime();
      const isPast = compareDate < today;
      const isFuture = compareDate > this.cutoffDate;
      
      const dateKey = this.formatDate(date);
      const hasEvents = !isFuture && (this.mockEvents[dateKey] ? true : false);
      const eventTypes = hasEvents ? this.mockEvents[dateKey] : [];
      
      return {
        date: new Date(date),
        dayNumber: date.getDate(),
        isToday: isToday,
        isPast: isPast,
        isFuture: isFuture,
        hasEvents: hasEvents,
        eventTypes: eventTypes
      };
    },
    handleScroll(e) {
      // Update selected date based on scroll position
      const scrollLeft = e.detail.scrollLeft;
      const dayIndex = Math.round(scrollLeft / (this.dayWidth * 0.266)); // Convert rpx to px (approx)
      
      if (dayIndex >= 0 && dayIndex < this.visibleDays.length) {
        const newSelectedDate = this.visibleDays[dayIndex].date;
        if (!this.isSelected(newSelectedDate)) {
          this.selectDate(this.visibleDays[dayIndex], false);
        }
      }
    },
    selectDate(day, scroll = true) {
      if (day.isFuture) return; // Don't select future dates beyond cutoff
      
      this.selectedDate = new Date(day.date);
      this.$emit('input', this.selectedDate);
      
      // Emit event with the selected date and any associated locations
      const dateKey = this.formatDate(day.date);
      const locations = this.mockLocations[dateKey] || [];
      this.$emit('date-selected', {
        date: this.selectedDate,
        locations: locations
      });
      
      // Scroll to the selected date if requested
      if (scroll) {
        const index = this.visibleDays.findIndex(d => 
          d.date.getDate() === day.date.getDate() && 
          d.date.getMonth() === day.date.getMonth() && 
          d.date.getFullYear() === day.date.getFullYear()
        );
        
        if (index !== -1) {
          const scrollViewWidth = 750; // Default uni-app width in rpx
          const centerPosition = (index * this.dayWidth) - (scrollViewWidth / 2) + (this.dayWidth / 2);
          
          // Use scrollTo if available
          if (this.$refs.daysScroll && this.$refs.daysScroll.scrollTo) {
            this.$refs.daysScroll.scrollTo({
              left: centerPosition > 0 ? centerPosition : 0,
              behavior: 'smooth'
            });
          }
        }
      }
    },
    isSelected(date) {
      if (!this.selectedDate || !date) return false;
      
      return date.getDate() === this.selectedDate.getDate() && 
             date.getMonth() === this.selectedDate.getMonth() && 
             date.getFullYear() === this.selectedDate.getFullYear();
    },
    formatDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    generateRandomCoordinate(baseLat, baseLng, maxDistanceMeters) {
      // Earth's radius in meters
      const earthRadius = 6371000;
      
      // Convert degrees to radians
      const toRadians = (degree) => degree * Math.PI / 180;
      const fromRadians = (radian) => radian * 180 / Math.PI;
      
      // Generate a random distance between 400 and 800 meters
      const minDistance = 400; // Minimum 400 meters
      const distance = minDistance + Math.random() * (maxDistanceMeters - minDistance);
      
      // Convert distance to angular distance in radians
      const angularDistance = distance / earthRadius;
      
      // Generate a random angle in radians
      const angle = Math.random() * Math.PI * 2;
      
      // Convert lat/lng to radians
      const latRad = toRadians(baseLat);
      const lngRad = toRadians(baseLng);
      
      // Calculate new position
      const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(angle)
      );
      
      const newLngRad = lngRad + Math.atan2(
        Math.sin(angle) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
      );
      
      // Convert back to degrees
      const newLat = fromRadians(newLatRad);
      const newLng = fromRadians(newLngRad);
      
      // Calculate actual distance to verify
      const R = 6371e3; // Earth radius in meters
      const φ1 = toRadians(baseLat);
      const φ2 = toRadians(newLat);
      const Δφ = toRadians(newLat - baseLat);
      const Δλ = toRadians(newLng - baseLng);
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const actualDistance = R * c;
      
      console.log(`Generated coordinate at distance: ${actualDistance.toFixed(2)} meters`);
      
      return { lat: newLat, lng: newLng };
    },
    generateMockData() {
      // Generate events for each day in the visible range
      this.visibleDays.forEach(day => {
        // Skip future days beyond cutoff
        if (day.isFuture) return;
        
        const date = day.date;
        const dateKey = this.formatDate(date);
        
        // Skip weekends with 50% probability
        if ((date.getDay() === 0 || date.getDay() === 6) && Math.random() < 0.5) return;
        
        // Randomly decide what type of day this is
        const random = Math.random();
        
        if (random < 0.6) {
          // 60% chance of regular work day with onsite check-in
          this.mockEvents[dateKey] = ['onsite'];
          this.mockLocations[dateKey] = [
            { 
              type: 'office',
              position: { ...this.officeLocation },
              time: '9:00 AM - 5:00 PM',
              clientName: 'Office',
              location: 'Company Office'
            }
          ];
        } else if (random < 0.9) {
          // 30% chance of having offsite meetings
          this.mockEvents[dateKey] = ['offsite'];
          
          // Generate 2 random locations within 800 meters
          const location1 = this.generateRandomCoordinate(
            this.officeLocation.lat, 
            this.officeLocation.lng, 
            800
          );
          
          const location2 = this.generateRandomCoordinate(
            this.officeLocation.lat, 
            this.officeLocation.lng, 
            800
          );
          
          // Generate random client names and addresses
          const clients = [
            { name: 'ABC Corp', address: '123 Main St, Sydney' },
            { name: 'XYZ Ltd', address: '456 Park Ave, Sydney' },
            { name: 'Tech Solutions', address: '789 Market St, Sydney' },
            { name: 'Global Innovations', address: '321 Harbor View, Sydney' },
            { name: 'Data Systems', address: '555 Business Park, Sydney' }
          ];
          
          const client1 = clients[Math.floor(Math.random() * clients.length)];
          let client2;
          do {
            client2 = clients[Math.floor(Math.random() * clients.length)];
          } while (client2 === client1);
          
          // Generate time slots
          const morningStart = 9 + Math.floor(Math.random() * 2); // 9 or 10 AM
          const morningEnd = morningStart + 1 + Math.floor(Math.random() * 2); // 1-2 hours later
          
          const afternoonStart = 13 + Math.floor(Math.random() * 3); // 1-3 PM
          const afternoonEnd = afternoonStart + 1 + Math.floor(Math.random() * 2); // 1-2 hours later
          
          const formatTime = (hour) => {
            return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
          };
          
          this.mockLocations[dateKey] = [
            { 
              type: 'office',
              position: { ...this.officeLocation },
              time: '9:00 AM - 10:00 AM',
              clientName: 'Office',
              location: 'Company Office'
            },
            { 
              type: 'offsite',
              position: location1,
              time: `${formatTime(morningStart)} - ${formatTime(morningEnd)}`,
              clientName: client1.name,
              location: client1.address
            },
            { 
              type: 'offsite',
              position: location2,
              time: `${formatTime(afternoonStart)} - ${formatTime(afternoonEnd)}`,
              clientName: client2.name,
              location: client2.address
            },
            { 
              type: 'office',
              position: { ...this.officeLocation },
              time: '4:30 PM - 5:30 PM',
              clientName: 'Office',
              location: 'Company Office'
            }
          ];
        } else {
          // 10% chance of leave day
          this.mockEvents[dateKey] = ['leave'];
          this.mockLocations[dateKey] = [
            { 
              type: 'leave',
              time: 'All Day',
              clientName: 'N/A',
              location: 'Leave Day'
            }
          ];
        }
      });
      
      // Select today's date by default
      const today = this.visibleDays.find(day => day.isToday);
      if (today) {
        this.selectDate(today, false);
      } else {
        // If today is not visible, select the most recent past day
        const mostRecentPastDay = [...this.visibleDays]
          .filter(day => !day.isFuture)
          .sort((a, b) => b.date - a.date)[0];
          
        if (mostRecentPastDay) {
          this.selectDate(mostRecentPastDay, false);
        }
      }
    }
  }
};
</script>

<style scoped>
.attendance-calendar {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  border: 1px solid #EBECEE;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  background-color: #F9FAFB;
  border-bottom: 1px solid #EBECEE;
}

.month-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #101828;
}

.days-scroll {
  width: 100%;
  white-space: nowrap;
}

.days-container {
  display: flex;
  padding: 20rpx 0;
}

.day-cell {
  width: 100rpx;
  height: 120rpx;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  position: relative;
  flex-shrink: 0;
}

.day-name {
  font-size: 24rpx;
  color: #667085;
  margin-bottom: 8rpx;
}

.day-number {
  font-size: 32rpx;
  color: #101828;
  margin-bottom: 8rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.today-number {
  background-color: #EFC462;
  color: #FFFFFF;
}

.past .day-number {
  color: #101828;
}

.future .day-number {
  color: #D0D5DD;
}

.selected .day-number {
  background-color: #EFC462;
  color: #FFFFFF;
}

.event-indicators {
  display: flex;
  gap: 6rpx;
}

.event-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
}

.event-dot.onsite {
  background-color: #4CAF50;
}

.event-dot.offsite {
  background-color: #2196F3;
}

.event-dot.leave {
  background-color: #EFC462;
}
</style>
