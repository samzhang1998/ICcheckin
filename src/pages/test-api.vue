<template>
  <view class="test-api">
    <view class="header">
      <text class="title">API Testing Tool</text>
    </view>
    
    <view class="form-section">
      <text class="section-title">Login Test</text>
      
      <view class="input-group">
        <text class="label">Email:</text>
        <input v-model="email" placeholder="Enter email" class="input" />
      </view>
      
      <view class="input-group">
        <text class="label">Password:</text>
        <input v-model="password" placeholder="Enter password" type="password" class="input" />
      </view>
      
      <button @click="testLoginApi" class="test-button">Test Login API</button>
      
      <view class="server-test">
        <button @click="testServerConnection" class="test-button secondary">Test Server Connection</button>
      </view>
    </view>
    
    <view class="results-section" v-if="results">
      <text class="section-title">Test Results</text>
      <view class="results-container">
        <text class="result-status">Status Code: {{ results.statusCode || 'N/A' }}</text>
        <text class="result-header">Headers:</text>
        <text class="result-data">{{ JSON.stringify(results.header, null, 2) }}</text>
        <text class="result-header">Response Data:</text>
        <text class="result-data">{{ JSON.stringify(results.data, null, 2) }}</text>
      </view>
    </view>
    
    <view class="error-section" v-if="error">
      <text class="section-title">Error</text>
      <view class="error-container">
        <text class="error-message">{{ error }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { testLogin, testServerConnection } from '@/api/test-login';

export default {
  data() {
    return {
      email: '',
      password: '',
      results: null,
      error: null
    };
  },
  methods: {
    async testLoginApi() {
      this.results = null;
      this.error = null;
      
      if (!this.email || !this.password) {
        this.error = 'Please enter both email and password';
        return;
      }
      
      try {
        const response = await testLogin(this.email, this.password);
        this.results = response;
        console.log('Test completed:', response);
      } catch (err) {
        this.error = `Test failed: ${err.message || JSON.stringify(err)}`;
        console.error('Test failed:', err);
      }
    },
    
    async testServerConnection() {
      this.results = null;
      this.error = null;
      
      try {
        await testServerConnection();
        this.results = { statusCode: 'Checking console for results' };
      } catch (err) {
        this.error = `Connection test failed: ${err.message || JSON.stringify(err)}`;
      }
    }
  }
};
</script>

<style>
.test-api {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #444;
}

.form-section {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
}

.input-group {
  margin-bottom: 20rpx;
}

.label {
  display: block;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.test-button {
  width: 100%;
  height: 90rpx;
  background-color: #EFC462;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin-top: 20rpx;
}

.secondary {
  background-color: #666;
  margin-top: 20rpx;
}

.server-test {
  margin-top: 30rpx;
}

.results-section, .error-section {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
}

.results-container, .error-container {
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
  border: 1px solid #eee;
}

.result-status {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.result-header {
  font-size: 28rpx;
  font-weight: bold;
  margin: 20rpx 0 10rpx;
  color: #555;
}

.result-data {
  font-size: 26rpx;
  color: #666;
  word-break: break-all;
  white-space: pre-wrap;
  font-family: monospace;
}

.error-message {
  color: #e74c3c;
  font-size: 28rpx;
}
</style>
