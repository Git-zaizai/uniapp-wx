<template>
	<view class="cu-bar bg-white comm-border_rop">
		<view class="action title-style-3">
			<text :class="icon" :style="[{ color: iconColoc }, iconStyle]"></text>
			<text class="text-xl text-bold">{{ bartitle || '月吐槽' }}</text>
			<text class="text-Abc text-gray self-end margin-left-sm">
				{{ barentitle || 'Mcatm' }}
			</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'titlebar',
	props: {
		bartitle: {
			type: String,
			default: ''
		},
		barentitle: {
			type: String,
			default: ''
		},
		icon: {
			type: String,
			default: 'cuIcon-hotfill'
		},
		iconColoc: {
			type: String,
			default: '#fa7272'
		},
		iconStyle: {
			type: String,
			default: ''
		}
	}
};
</script>

<style lang="scss">
.comm-border_rop {
	@include border-top_lr(12rpx);
}
</style>
