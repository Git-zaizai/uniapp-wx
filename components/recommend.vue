<template>
	<!-- 本月吐槽文章 -->
	<view class="community-card" :style="top >= 1 ? 'margin-top: 40rpx;' : ''">
		<view class="cu-bar bg-white comm-border_rop">
			<view class="action title-style-3">
				<text class="cuIcon-hotfill comm-icon"></text>
				<text class="text-xl text-bold">{{ bartitle || '月吐槽' }}</text>
				<text class="text-Abc text-gray self-end margin-left-sm">
					{{ barentitle || 'Mcatm' }}
				</text>
			</view>
		</view>
		<template v-if="cucard.length">
			<view
				class="cu-card article bor-t_solid"
				v-for="(item, index) in cucard"
				:key="item.id"
				@click="atop(item.id)"
			>
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut">{{ item.title }}</view>
					</view>
					<view class="content">
						<image
							v-if="item.titleimg !== ''"
							:src="item.titleimg"
							mode="aspectFill"
						></image>
						<view class="desc">
							<view class="text-content">{{ strfun(item.text) }}</view>
							<view class="text-gray text-sm desc-text_view">
								<view class="inter-view">
									<text
										class="cuIcon-attentionfill margin-lr-xs inter-icon_margin"
									></text>
									{{ item.attentionfill }}
								</view>
								<view class="inter-view icon-click">
									<text
										class="cuIcon-appreciatefill margin-lr-xs inter-icon_margin"
									></text>
									{{ item.appreciatefill }}
								</view>
								<view class="inter-view">
									<text
										class="cuIcon-messagefill margin-lr-xs inter-icon_margin"
									></text>
									{{ item.messagefill }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="cu-empty">
				<u-empty
					text="额,东西不见了呀!"
					width="300"
					textSize="18"
					icon="http://cdn.uviewui.com/uview/empty/data.png"
				></u-empty>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	name: 'recommend',
	props: {
		bartitle: {
			type: String,
			default: ''
		},
		barentitle: {
			type: String,
			default: ''
		},
		top: Number,
		cucard: {
			type: Array,
			default() {
				return [
					{
						id: 1,
						url: '',
						title: '文章标题',
						img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg',
						text: `文章内容，3行隐藏`,
						attentionfill: 10,
						appreciatefill: 20,
						messagefill: 10
					}
				];
			}
		}
	},
	methods: {
		atop(id) {
			uni.navigateTo({
				url: '/pages/community/commarticle?id=' + id
			});
		},
		strfun(val) {
			return val.match(/[\u4e00-\u9fa5]/g).join('');
		}
	}
};
</script>

<style scoped lang="scss">
.community-card {
	padding: 0px 40rpx 0px;

	.bor-t_solid {
		border-top: 1rpx solid #f3f3f3;
	}

	.comm-border_rop {
		@include border-top_lr(12rpx);
	}

	.cu-item {
		margin: 0;
	}

	.text-content {
		@include text-overflow-line(3);
	}
}

.comm-icon {
	color: #fa7272;
}
.desc-text_view {
	@include dif-juspb-alic;
	margin-left: 30%;
}
.cu-empty {
	background-color: #ffffff;
	padding-bottom: 80rpx;
	border-radius: 15rpx;
}
</style>
