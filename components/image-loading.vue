<template>
	<view class="grid-img">
		<text class="cuIcon-loading2 gil-al"></text>
		<text class="gil-txt">拼命加载...</text>
	</view>
</template>

<script>
export default {
	name: 'image-loading',
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.grid-img {
	width: 92vw;
	min-height: 329rpx;
	max-height: 61.8vh;
	@include dif-fdc-juc-alc;

	.gil-al {
		font-size: 40rpx;
		color: #0081ff;
		animation: spin 1.5s linear infinite;
	}

	.gil-txt {
		font-size: 22rpx;
		margin-top: 20rpx;
		margin-left: 10rpx;
		color: $textColor;
	}
}
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
