// Test script for login API
const baseUrl = "http://13.211.159.140";

// Function to test login with different inputs
function testLogin(email, password) {
  console.log(`Testing login with email: ${email}, password: ${password}`);
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/login/`,
      method: 'POST',
      data: { email, password },
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        console.log('Response:', res);
        resolve(res);
      },
      fail: (err) => {
        console.error('Error:', err);
        reject(err);
      }
    });
  });
}

// Function to test server connection
function testServerConnection() {
  console.log('Testing server connection...');
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl,
      method: 'GET',
      success: (res) => {
        console.log('Server is reachable:', res);
        resolve(res);
      },
      fail: (err) => {
        console.error('Server connection failed:', err);
        reject(err);
      }
    });
  });
}

// Export test functions
export {
  testLogin,
  testServerConnection
};
