export default (urls, indicator = 'default', long = {}) => {
	uni.previewImage({
		urls: urls,
		indicator: indicator,
		longPressActions: {
			itemList: long.itemList
		}
	});
}
