# Changelog - April 2, 2025

## Add-Office Component Enhancements

### 1. Timezone and Local Time Features
- **Enhancement**: Added functionality to retrieve timezone and local time information for office locations
- **Solution**: Implemented Google Maps Timezone API integration to fetch timezone data based on coordinates
- **Files Modified**:
  - `src/components/home/add-office.vue`
- **Benefits**: Provides administrators with accurate timezone information when adding new office locations

### 2. Improved Location Information Display
- **Enhancement**: Added a new location information panel that displays coordinates, timezone, and local time
- **Solution**: Created a new UI section that appears after address selection with formatted location details
- **Files Modified**:
  - `src/components/home/add-office.vue`
- **Benefits**: Better user experience with immediate feedback about the selected location's time information

### 3. Backend Integration
- **Enhancement**: Added timezone and UTC offset data to the office creation payload
- **Solution**: Extended the data object sent to the backend API to include timezone information
- **Files Modified**:
  - `src/components/home/add-office.vue`
- **Benefits**: Enables the system to store and utilize timezone data for each office location

### 4. Timezone API Fallback Mechanism
- **Enhancement**: Added fallback mechanism when Timezone API access is denied
- **Solution**: Implemented longitude-based timezone estimation that calculates approximate local time
- **Files Modified**:
  - `src/components/home/add-office.vue`
- **Benefits**: Ensures the feature works even when the Google Timezone API is unavailable or not enabled

# Changelog - April 1, 2025

## Map Component UI Improvements

### 1. Enhanced Map Container Proportions
- **Enhancement**: Modified the map component's white container to always maintain 150% of the map's height
- **Solution**: Implemented dynamic height calculation based on the map element's dimensions
- **Files Modified**:
  - `src/components/home/map-location.vue`
- **Benefits**: More consistent UI appearance across different screen sizes and better visual balance

### 2. Fixed Map Display Issues
- **Issue**: Map was not taking up the full width of its container and had inconsistent margins
- **Solution**: Set map to 100% width of container and ensured proper centering
- **Files Modified**:
  - `src/components/home/map-location.vue`
- **Benefits**: Improved map visibility and better use of available space

### 3. Improved Map Interaction
- **Enhancement**: Added better gesture handling for map interactions
- **Solution**: Added `gestureHandling: 'cooperative'` and disabled fullscreen control
- **Files Modified**:
  - `src/components/home/map-location.vue`
- **Benefits**: Better user experience when interacting with the map, especially on touch devices

## PC Version Enhancements

### 1. Responsive Map Component for Desktop
- **Enhancement**: Optimized map component for desktop/PC view
- **Solution**: Added responsive styling for larger screens with proper container sizing
- **Files Modified**:
  - `src/components/home/map-location.vue`
  - `src/pages/home/home.vue`
- **Benefits**: Better user experience on desktop devices with consistent styling across platforms

### 2. Desktop-Friendly UI Adjustments
- **Enhancement**: Improved layout and spacing for desktop screens
- **Solution**: Modified container widths and margins to better utilize desktop screen real estate
- **Files Modified**:
  - `src/pages/home/home.vue`
- **Benefits**: More professional appearance on larger screens while maintaining mobile compatibility

# Changelog - March 31, 2025

## Google Maps API Improvements

### 1. Fixed Google Maps Loading Warning
- **Issue**: The Google Maps JavaScript API was being loaded without the `loading=async` attribute, causing suboptimal performance.
- **Solution**: Added `loading=async` parameter to the Google Maps script URL in both map components.
- **Files Modified**:
  - `src/components/home/map-location.vue`
  - `src/components/profile/attendance-tracking.vue`
- **Benefits**: Improved page loading performance and removed console warning.

### 2. Addressed Marker Deprecation Warning
- **Issue**: Google Maps is deprecating `google.maps.Marker` in favor of `google.maps.marker.AdvancedMarkerElement`.
- **Solution**: Initially attempted to migrate to Advanced Markers API but encountered compatibility issues. Reverted to standard Markers with `loading=async` for better compatibility while maintaining performance improvements.
- **Note**: According to Google, the current Marker API will continue to work for at least 12 more months, so this is not an urgent issue.
- **Files Modified**:
  - `src/components/home/map-location.vue`
  - `src/components/profile/attendance-tracking.vue`

### 3. Improved Map Route Indicators
- **Enhancement**: Changed the route order indicators in the profile page map from orange markers to dark blue circles with white numbers.
- **Benefits**: Better visual clarity and improved user experience when following the sequence of locations.
- **Files Modified**:
  - `src/components/profile/attendance-tracking.vue`

## Implementation Details

### Map Location Component
- Updated Google Maps script loading to use `loading=async` parameter
- Maintained standard marker implementation for compatibility
- Improved map initialization and marker handling

### Attendance Tracking Component
- Updated Google Maps script loading to use `loading=async` parameter
- Enhanced route visualization with custom styled markers
- Improved numbered indicators using dark blue circles with white numbers
- Maintained compatibility with existing functionality

## Future Considerations
1. **Advanced Markers Migration**: Consider a more comprehensive migration to the Advanced Markers API in the future, with proper feature detection and fallbacks.
2. **Performance Optimization**: Further optimize map loading and rendering for better mobile performance.
3. **Accessibility Improvements**: Enhance map accessibility features for users with disabilities.

## How to Test Changes
1. Check the browser console - the loading warning should be resolved
2. The marker deprecation warning may still appear (this is expected and not critical)
3. Verify that maps load and display correctly in both components
4. In the profile page, confirm that route indicators now appear as dark blue circles with white numbers

## References
- [Google Maps JavaScript API Loading Best Practices](https://goo.gle/js-api-loading)
- [Google Maps Advanced Markers Migration Guide](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration)
