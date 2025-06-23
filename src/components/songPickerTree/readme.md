### 树形选择器，支持多选、单选、级联选择、数据懒加载


原插件地址：[](https://ext.dcloud.net.cn/plugin?id=9966)
## 原插件不支持vue3  特 改为vue3版本

属性名	类型	默认值	说明
range	Array	-	本地渲染数据
idKey	String	id	指定 Object 中 key 的值作为单条数据的唯一id
nameKey	String	name	指定 Object 中 key 的值作为选择器显示的内容
allKey	String	value	指定 Object 中 其他需要返回的内容
title	String	-	选择器的名称默认为空
titleColor	String	#757575	标题的颜色
confirmColor	String	#007aff	确定按钮及选择框的颜色
cancelColor	String	#757575	取消按钮的颜色
currentIcon	String	默认图标	折叠时的图标
defaultIcon	String	默认图标	打开之后的图标
lastIcon	String	默认无	没有子集时的图标
multiple	Boolean	true	是否可以多选（true:多选、false:单选）
cascade	Boolean	false	在(多选 && 父级可选)模式下，开启级联选择（true:级联、false:不级联）
selectParent	Boolean	true	父级是否可选（true:可选、false:不可选）
maskClick	Boolean	true	点击遮罩层是否关闭
@cancel	Handler	-	点击取消或点击遮罩层关闭时的回调方法
@confirm	Handler	-	点击确定按钮时的回调方法