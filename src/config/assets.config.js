import indexConfig from './index.config.js'
const PATH = indexConfig.assetsPath;
/*
 * 图片静态资源表，所有图片资源路径在这统一管理，不应该写死在页面中，该数据挂载到Vue原型中。
 * 页面使用：this.$mAssetsPath.grid_1
 * CSS背景：应尽量使用:style="" 行内样式设置背景图
 * PATH说明：本地路径或者服务器路径
 *
 * 举例：<image :src="grid_1">  需要在data中映射 grid_1: this.$mAssetsPath.grid_1
 *
 * 特别注意：经测试小程序中不支持 <image :src="$mAssetsPath.grid_1"> 该用法
 */

export default {
	// 默认头像
	headImg: PATH + '/logo.png',

	// 出错填充图片
	errorImage: PATH + '/errorImage.jpg',

	// 品牌logo
	logo: PATH + '/logo.png',
	// 互通广告名字
	namepng: PATH + '/name.png',

	// white logi
	logoWhite: PATH + '/logo.png',

	// 家政新闻
	newsBg: PATH + '/news.png',

	// 家政新闻
	userBg: PATH + '/user-bg.jpg',
 
	// 弧形背景
	arc: PATH + '/arc.png',

	// 阿姨页面header背景
	productBg: PATH + '/bgd2.png',
	
	// 阿姨页面示例图
	productBottom: PATH + '/product-bottom.jpg',

	// 500
	noNetWorkImg: PATH + '/noNetWork.png',

	// 404
	notFoundImg: PATH + '/notFound.png'
}
