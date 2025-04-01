<template>
  <view class="pc-layout">
    <view class="pc-header">
      <slot name="header"></slot>
    </view>
    
    <view class="pc-content">
      <view class="pc-main">
        <slot name="main"></slot>
      </view>
      
      <view class="pc-sidebar">
        <slot name="sidebar"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PcLayout'
}
</script>

<style scoped>
.pc-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #FBFBFB;
}

.pc-header {
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.pc-content {
  display: flex;
  gap: 30px;
}

.pc-main {
  flex: 3; /* Takes 60% of the space */
}

.pc-sidebar {
  flex: 2; /* Takes 40% of the space */
}

@media screen and (min-width: 1024px) {
  .pc-layout {
    padding: 30px;
  }
  
  .pc-content {
    gap: 40px;
  }
}

@media screen and (min-width: 1440px) {
  .pc-layout {
    max-width: 1400px;
  }
}
</style>
