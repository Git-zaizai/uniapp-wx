<template>
	<view class="fabulousview fabulous_before" @click="commclick">
		<u-icon name="thumb-up" size="21" :color="uiconcolor"></u-icon>
		<text class="flicon_text">{{ textNuber }}</text>
	</view>
</template>

<script>
export default {
	name: 'fabulous',
	props: {
		textNuber: 0
	},
	data() {
		return {
			uiconcolor: ''
		};
	},
	methods: {
		commclick
	}
};
</script>

<style scoped lang="scss">
.fabulousview {
	@include dif-alc;
	font-size: 24rpx;
	position: relative;
}
.flicon_text {
	margin-top: 2rpx;
	margin-left: 10rpx;
	color: #5cabff;
}
.fabulous_before::before {
	content: ' ';
	width: 1rpx;
	height: 30rpx;
	background-color: #d5d5d5;
	position: absolute;
	left: -15px;
	top: 6rpx;
}
</style>
