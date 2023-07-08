<template>
	<view class="cu-card dynamic no-card">
		<view class="cu-item shadow" @click="vitemclick" @longpress="vitlongpress">
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<image
						v-if="procommdata.userimg"
						class="cu-avatar round lg"
						:src="procommdata.userimg"
					></image>
					<image
						v-else
						class="cu-avatar round lg"
						src="../../static/tab_icon/userfons.png"
						style="background-color: #FFFFFF;"
					></image>

					<view class="content flex-sub">
						<view>{{ procommdata.username }}</view>
						<view class="text-gray text-sm flex justify-between">{{ commdate }}</view>
					</view>
					<slot></slot>
				</view>
			</view>
			<view class="text-content">{{ procommdata.title }}</view>
			<view
				class="grid flex-sub padding-lr"
				:class="isCard ? 'col-3 grid-square' : 'col-1'"
				v-if="procommdata.titleimg !== ''"
			>
				<image
					class="grid-image"
					:src="procommdata.titleimg"
					@load="imgload(index)"
					v-show="is_load"
					mode="widthFix"
				></image>
				<image-loading v-show="!is_load"></image-loading>
			</view>

			<view class="text-shen" v-if="procommdata.divinepraise">
				<view class="appreciatefill">
					<view class="are-shen">
						<text
							class="t-icon t-icon-a-gaoxinghaoxinqingbiaoqingxihuanbiaoqingxiaolian"
						></text>
						<text>神评</text>
					</view>
					<view
						:class="{ 'icon-click': procommdata.divinepraiseid }"
						@click.stop="appclick(0)"
					>
						<text class="cuIcon-appreciatefill appicon"></text>
						{{ procommdata.divinepraisenubder }}
					</view>
				</view>
				<text class="text-textarea">{{ procommdata.divinepraisetext }}</text>
			</view>

			<view class="text-gray text-sm padding interaction">
				<view class="inter-view">
					<text class="cuIcon-attention margin-lr-xs inter-icon_margin"></text>
					{{ procommdata.attentionfill }}
				</view>
				<view
					class="inter-view"
					:class="{ 'icon-click': procommdata.community_click }"
					@click.stop="appclick(1)"
				>
					<u-icon
						name="thumb-up"
						top="1px"
						:color="procommdata.community_click ? '#9bc6fc' : '#b1b0b0'"
						size="20px"
					></u-icon>
					<text class="inv-ict">{{ procommdata.appreciatefill }}</text>
				</view>
				<view class="inter-view">
					<text class="cuIcon-message margin-lr-xs inter-icon_margin"></text>
					{{ procommdata.messagefill }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ImageLoading from '@/components/image-loading.vue';
import { dateNew } from '@/common/js/utils.js';
export default {
	components: {
		ImageLoading
	},
	props: {
		procommdata: {
			type: Object,
			default() {
				return {};
			}
		},
		proindex: Number
	},
	data() {
		return {
			// 当图片载入完毕时 切换图片
			is_load: false
		};
	},
	computed: {
		commdate() {
			const dateobj = dateNew(this.procommdata.date);
			const text = dateobj.Y + '年' + dateobj.m + '月' + dateobj.d + '日';
			return text;
		}
	},
	methods: {
		// 当图片载入完毕时 切换图片
		uparseload() {
			this.is_load = true;
		},
		// 挑战详情页
		vitemclick() {
			uni.navigateTo({
				url: '/pages/community/commarticle?id=' + this.procommdata.id
			});
		},
		// 点赞函数
		appclick(num) {
			this.$emit('fabulous', num, this.procommdata, this.proindex);
		},
		// 长按函数
		vitlongpress() {
			console.log('长按事件');
			this.$emit('vitlongpressem', this.procommdata.id, this.proindex);
		}
	}
};
</script>

<style lang="scss" scoped>
.comv-slot {
	position: relative;
}
.cu-card {
	margin-top: 5rpx;
	margin-bottom: 10rpx;
}

.grid-image {
	width: 100%;
	min-height: 329rpx;
}

.text-content {
	margin-top: 20rpx;
	@include text-overflow-line(3);
}

.text-shen {
	width: 92%;
	max-height: 24vh;
	margin: 30rpx auto;
	padding: 10rpx 20rpx 30rpx 20rpx;
	background-color: #f3f3f3d1;
	border-radius: 5rpx;

	.appreciatefill {
		color: #aaaaaa;
		font-size: 22rpx;
		text-align: right;
		padding-right: 11rpx;
		margin: 15rpx;
		@include dif-juspb-alic;

		.are-shen {
			@include dif-juspb-alic;
			width: 87rpx;
			background-color: rgba(255, 0, 0, 0.5);
			border-radius: 50rpx;
			padding: 5rpx;
			color: #ffffff;
		}

		.appicon {
			margin-right: 10rpx;
		}
	}

	.text-textarea {
		@include text-overflow-line(4);
	}
}

.interaction {
	@include dif-juspb-alic;

	.inter-view {
		@include dif-alc;
	}

	.inv-ict {
		margin-top: 8rpx;
		margin-left: 25rpx;
	}
	.inter-icon_margin {
		margin-right: 25rpx;
		font-size: 33rpx;
	}
}

.icon-click {
	color: #9bc6fc;
}
</style>
