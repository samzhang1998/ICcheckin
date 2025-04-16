const PI = Math.PI;
const a = 6378245.0; // 长半轴（克拉索夫斯基椭球参数）
const ee = 0.00669342162296594323; // 扁率

/**
 * GCJ-02 转 WGS-84
 * @param {number} lng - GCJ-02 经度
 * @param {number} lat - GCJ-02 纬度
 * @returns {[number, number]} [wgsLng, wgsLat]
 */
export function gcj02ToWgs84(lng, lat) {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  }
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  return [lng * 2 - mgLng, lat * 2 - mgLat];
}

// 辅助函数：判断是否在中国境外
function outOfChina(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

/**
 * 判断经纬度是否在中国境内
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @returns {boolean} 是否在中国境内
 */
function isInChina(lng, lat) {
  // 中国矩形边界范围（粗略估算）
  const chinaRect = {
    west: 73.66,  // 最西端经度
    east: 135.05, // 最东端经度
    north: 53.55, // 最北端纬度
    south: 3.86   // 最南端纬度
  };
  
  // 首先检查是否在中国矩形范围内
  if (lng < chinaRect.west || lng > chinaRect.east || 
      lat < chinaRect.south || lat > chinaRect.north) {
    return false;
  }
  
  // 排除一些特殊区域（如南海诸岛需要单独判断）
  // 这里可以添加更精确的判断逻辑
  
  // 台湾省范围（简化版）
  const taiwanRect = {
    west: 119.3,
    east: 124.6,
    north: 26.2,
    south: 20.7
  };
  if (lng >= taiwanRect.west && lng <= taiwanRect.east && 
      lat >= taiwanRect.south && lat <= taiwanRect.north) {
    return true;
  }
  
  // 海南岛范围（简化版）
  const hainanRect = {
    west: 108.3,
    east: 111.3,
    north: 20.2,
    south: 18.1
  };
  if (lng >= hainanRect.west && lng <= hainanRect.east && 
      lat >= hainanRect.south && lat <= hainanRect.north) {
    return true;
  }
  
  // 更精确的判断可以通过地理围栏多边形算法实现
  // 这里返回true表示在中国矩形范围内且不在排除区域
  return true;
}

// 使用示例
console.log(isInChina(116.404, 39.915));  // 北京 - true
console.log(isInChina(121.474, 31.230)); // 上海 - true
console.log(isInChina(114.109, 22.396));  // 香港 - true
console.log(isInChina(121.559, 25.025));  // 台北 - true
console.log(isInChina(109.503, 18.254)); // 三亚 - true
console.log(isInChina(139.691, 35.689)); // 东京 - false
console.log(isInChina(-0.127, 51.507));  // 伦敦 - false


 export function wgs84ToGcj02(wgsLat, wgsLng) {
  if (!isInChina(wgsLng, wgsLat)) {
    console.log("ddddddddddddddddddddddd")
      return {lat: wgsLat, lng: wgsLng};
  }
  
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  
  let dLat = transformLat(wgsLng - 105.0, wgsLat - 35.0);
  let dLng = transformLng(wgsLng - 105.0, wgsLat - 35.0);
  
  const radLat = wgsLat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  
  return {lat: wgsLat + dLat, lng: wgsLng + dLng};
}
// 辅助函数：纬度变换
function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

// 辅助函数：经度变换
function transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

// 示例：转换北京天安门坐标（GCJ-02 → WGS-84）
const [gcjLng, gcjLat] = [116.404, 39.915];
const [wgsLng, wgsLat] = gcj02ToWgs84(gcjLng, gcjLat);

console.log("WGS-84 坐标:", wgsLng, wgsLat);