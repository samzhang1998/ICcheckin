<template>
  <view>
    <!-- PC Layout -->
    <pc-layout v-if="isPc">
      <template #header>
        <slot name="pc-header"></slot>
      </template>
      
      <template #main>
        <slot name="pc-main"></slot>
      </template>
      
      <template #sidebar>
        <slot name="pc-sidebar"></slot>
      </template>
    </pc-layout>
    
    <!-- Mobile Layout -->
    <view v-else class="mobile-layout">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import PcLayout from './pc-layout.vue';
import { isPcScreen, addResizeListener } from '@/utils/responsive';

export default {
  name: 'ResponsiveLayout',
  components: {
    PcLayout
  },
  data() {
    return {
      isPc: false
    }
  },
  mounted() {
    // Check device on mount
    this.checkDevice();
    
    // Add resize listener
    // #ifdef H5
    this.removeResizeListener = addResizeListener(this.checkDevice);
    // #endif
  },
  beforeDestroy() {
    // Remove resize listener
    // #ifdef H5
    if (this.removeResizeListener) {
      this.removeResizeListener();
    }
    // #endif
  },
  methods: {
    checkDevice() {
      this.isPc = isPcScreen();
      console.log("Responsive Layout - Device is PC:", this.isPc);
    }
  }
}
</script>

<style scoped>
.mobile-layout {
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #FBFBFB;
  min-height: 100vh;
}
</style>
