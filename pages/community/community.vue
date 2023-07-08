<template>
	<view id="page-scroll">
		<template v-if="communityList.length">
			<view
				class="cu-card dynamic no-card"
				v-for="(item, index) in communityList"
				:key="item.id"
			>
				<view class="cu-item shadow" @click="vitemclick(item, index)">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<image
								v-if="item.userimg"
								class="cu-avatar round lg"
								:src="item.userimg"
							></image>
							<image
								v-else
								class="cu-avatar round lg"
								src="../../static/tab_icon/userfons.png"
								style="background-color: #FFFFFF;"
							></image>

							<view class="content flex-sub">
								<view>{{ item.username }}</view>
								<view class="text-gray text-sm flex justify-between">
									{{ item.date }}
								</view>
							</view>
						</view>
					</view>
					<view class="text-content">{{ item.title }}</view>
					<view
						class="grid flex-sub padding-lr"
						:class="isCard ? 'col-3 grid-square' : 'col-1'"
						v-if="item.titleimg !== ''"
					>
						<image
							class="grid-image"
							:src="item.titleimg"
							@load="imgload(index)"
							v-show="item.is_load"
							mode="widthFix"
						></image>
						<image-loading v-show="!item.is_load"></image-loading>
					</view>

					<view class="text-shen" v-if="item.divinepraise">
						<view class="appreciatefill">
							<view class="are-shen">
								<text
									class="t-icon t-icon-a-gaoxinghaoxinqingbiaoqingxihuanbiaoqingxiaolian"
								></text>
								<text>神评</text>
							</view>
							<view
								:class="{ 'icon-click': item.divinepraiseid }"
								@click.stop="appreciatefillClick(0, item, index)"
							>
								<text class="cuIcon-appreciatefill appicon"></text>
								{{ item.divinepraisenubder }}
							</view>
						</view>
						<text class="text-textarea">{{ item.divinepraisetext }}</text>
					</view>

					<view class="text-gray text-sm padding interaction">
						<view class="inter-view">
							<text class="cuIcon-attention margin-lr-xs inter-icon_margin"></text>
							{{ item.attentionfill }}
						</view>
						<view
							class="inter-view"
							:class="{ 'icon-click': item.community_click }"
							@click.stop="appreciatefillClick(1, item, index)"
						>
							<u-icon
								name="thumb-up"
								top="1px"
								:color="item.community_click ? '#9bc6fc' : '#b1b0b0'"
								size="20px"
							></u-icon>
							<text class="inv-ict">{{ item.appreciatefill }}</text>
						</view>
						<view class="inter-view">
							<text class="cuIcon-message margin-lr-xs inter-icon_margin"></text>
							{{ item.messagefill }}
						</view>
					</view>
				</view>
			</view>
			<u-loadmore
				:status="loadmore.status"
				:line="loadmore.line"
				height="32"
				:loadingText="loadmore.loadingText"
			/>
			<view style="height: 1px;"></view>
		</template>

		<template v-else>
			<u-empty
				mode="news"
				width="100%"
				height="100%"
				icon="http://cdn.uviewui.com/uview/empty/data.png"
				text="东西都去哪里？"
				textSize="20"
				textColor="#bfc3ca"
			></u-empty>
		</template>
		<login-but ref="loginbut" :transparent="false"></login-but>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import {
	httpcommunityindex,
	httpappreciatefillClick,
	httpattention,
	httpcommunonPull
} from '@/common/api/api-list.js';
import { debounce, dateNew } from '@/common/js/utils.js';
import LoginBut from '@/components/login-but.vue';
import ImageLoading from '@/components/image-loading.vue';
export default {
	name: 'community',
	components: {
		LoginBut,
		ImageLoading
	},
	data() {
		const debounceList = debounce(this.httpcommun, 1000, true);
		return {
			communityList: [],
			loadmore: {
				loadingText: '努力加载中,先喝杯茶', //加载中提示语
				nomoreText: '', //没有更多的提示语
				status: 'loading',
				line: false
			},
			debounceList: debounceList,
			limit: 0,
			commpages: []
		};
	},
	onLoad() {
		uni.showLoading({
			title: '拼命加载中！'
		});
		this.httpcommun(this.limit);
	},
	methods: {
		async httpcommun(limit) {
			const { data } = await httpcommunityindex({ limit });
			if (data.length >= 5) {
				this.limit = this.limit + data.length;
			} else {
				this.loadmore = {
					nomoreText: '没有更多了', //没有更多的提示语
					status: 'nomore',
					line: true
				};
				this.limit = false;
			}
			data.forEach(item => {
				const dateobj = dateNew(item.date);
				item.date = dateobj.Y + '年' + dateobj.m + '月' + dateobj.d + '日';
				item.community_click = false;
				item.divinepraiseid = false;
				item.is_load = false;
			});
			this.communityList = this.communityList.concat(data);
			uni.hideLoading();
		},
		scrollToBottom(height) {
			// 获取竖直滚动位置
			uni.createSelectorQuery()
				.selectViewport()
				.scrollOffset(res => {
					// 设置滚到哪里
					uni.pageScrollTo({
						scrollTop: res.scrollTop + height
					});
				})
				.exec();
		},
		async getcomm() {
			await this.httpcommun(this.limit);
		},
		/**
		 * num  判断是文章点赞或神评点赞
		 * */
		async appreciatefillClick(modele, item, index) {
			if (!getApp().globalData.userinfo) {
				this.$refs.loginbut.isView();
				return;
			}
			const request = await httpappreciatefillClick({
				modele,
				articleid: item.id,
				commentid: item.divinepraise_id,
				divinepraise: item.divinepraise
			});
			const key = modele ? 'community_click' : 'divinepraiseid';
			const keyjia = modele ? 'appreciatefill' : 'divinepraisenubder';
			if (request.data === 1) {
				this.communityList[index][key] = true;
				this.communityList[index][keyjia]++;
			} else {
				this.communityList[index][key] = true;
			}
		},
		vitemclick(item, index) {
			if (!this.commpages.includes(item.id)) {
				httpattention({
					id: item.id,
					attentionfill: item.attentionfill
				}).then(res => {
					if (res.data === 1) {
						this.communityList[index].attentionfill++;
						this.commpages.push(item.id);
					}
				});
			}
			uni.navigateTo({
				url: '/pages/community/commarticle?id=' + item.id
			});
		},
		// 下拉刷新
		async onPullcallback() {
			const request = await httpcommunonPull({
				id: this.communityList[0].id
			});
			if (request.data) {
				this.communityList.unshift(...request.data);
			} else if (request.data === 0) {
				this.$refs.uToast.show({
					type: 'success',
					message: request.msg
				});
			}
			uni.stopPullDownRefresh();
		},
		// 图片加载完成  切换图片
		imgload(i) {
			this.communityList[i].is_load = true;
		}
	},
	onPullDownRefresh() {
		this.onPullcallback();
	},
	onReachBottom() {
		if (this.limit === false) return false;
		this.scrollToBottom(40);
		this.debounceList(this.limit);
	}
};
</script>

<style lang="scss" scoped>
#page-scroll {
	height: 100%;
}
.cu-card {
	margin-top: 5rpx;
	margin-bottom: 10rpx;
}

.grid-image {
	width: 100%;
	min-height: 329rpx;
	// max-height: 61.8vh;
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
	// border-top: 0.5rpx solid rgba(0, 0, 0, 0.1);
	// border-bottom: 0.5rpx solid rgba(0, 0, 0, 0.1);

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
