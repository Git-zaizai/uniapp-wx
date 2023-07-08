<template>
	<view class="notice-views">
		<view>
			<view class="cu-bar bg-white border-bom">
				<view class="action">
					<text class="cuIcon-titles not-title-coloc"></text>
					<text class="text-xl text-bold not-title-coloc">最新公告</text>
				</view>
			</view>
			<view
				class="cu-card dynamic no-card border-top"
				v-for="(item, index) in NoticeList.newest"
				:key="index"
			>
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<image
								v-if="item.userimg != ''"
								class="cu-avatar round lg"
								style="background-color: #FFFFFF;"
								:src="item.userimg"
							></image>
							<!-- <text class="cuIcon-profilefill notice-user"></text> -->
							<image
								class="cu-avatar round lg"
								style="background-color: #FFFFFF;"
								src="@/static/tab_icon/userfons.png"
							></image>

							<view class="content flex-sub text-sm text-gray">
								<view>发布人：{{ item.username }}</view>
								<view class="text-gray text-sm flex justify-between">
									发布时间：{{ item.date }}
								</view>
							</view>
						</view>
					</view>
					<view class="notice-text">
						<view class="nt-title">{{ item.title }}</view>
						<text class="nt-text" :class="item.isntxq.is ? 'text-hien' : ''">
							{{ item.text }}
						</text>
						<view
							class="nt-xq"
							v-show="item.isntxq.is"
							@click="ntxq(item.isntxq.nokey, index)"
						>
							<text class="cuIcon-triangledownfill nt-xq_icon"></text>
							<text>查看详情</text>
						</view>
						<view
							class="nt-xq nt-shou"
							v-show="!item.isntxq.is"
							@click="ntxq(item.isntxq.nokey, index)"
						>
							<text class="cuIcon-triangleupfill"></text>
							<text>收起</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="notice-history">
			<view class="cu-bar bg-white border-bom">
				<view class="action">
					<text class="cuIcon-titles not-title-coloc"></text>
					<text class="text-xl text-bold not-title-coloc">历史公告</text>
				</view>
			</view>
			<view
				class="cu-card dynamic no-card border-top"
				v-for="(item, index) in NoticeList.newest"
				:key="index"
			>
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<image
								v-if="item.userimg != ''"
								class="cu-avatar round lg"
								style="background-color: #FFFFFF;"
								:src="item.userimg"
							></image>
							<image
								class="cu-avatar round lg"
								style="background-color: #FFFFFF;"
								src="@/static/tab_icon/userfons.png"
							></image>

							<view class="content flex-sub text-sm text-gray">
								<view>发布人：{{ item.username }}</view>
								<view class="text-gray text-sm flex justify-between">
									发布时间：{{ item.date }}
								</view>
							</view>
						</view>
					</view>
					<view class="notice-text">
						<view class="nt-title">{{ item.title }}</view>
						<text class="nt-text" :class="item.isntxq.is ? 'text-hien' : ''">
							{{ item.text }}
						</text>
						<view
							class="nt-xq"
							v-show="item.isntxq.is"
							@click="ntxq(item.isntxq.nokey, index)"
						>
							<text class="cuIcon-triangledownfill nt-xq_icon"></text>
							<text>查看详情</text>
						</view>
						<view
							class="nt-xq nt-shou"
							v-show="!item.isntxq.is"
							@click="ntxq(item.isntxq.nokey, index)"
						>
							<text class="cuIcon-triangleupfill"></text>
							<text>收起</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getnotice } from '@/common/api/api-list.js';
export default {
	name: 'Notice',
	data() {
		return {
			NoticeList: {}
		};
	},
	onReady() {
		this.http();
	},
	methods: {
		async http() {
			try {
				const res = await getnotice();
				for (let key in res) {
					res[key].forEach(item => {
						item.isntxq = {
							nokey: key,
							is: true
						};
					});
				}
				this.NoticeList = res;
			} catch (e) {}
		},
		ntxq(key, index) {
			this.NoticeList[key][index].isntxq.is = !this.NoticeList[key][index].isntxq.is;
		}
	}
};
</script>

<style lang="scss" scoped>
.not-title-coloc {
	color: #1cbbb4;
}
.notice-views {
	.notice-user {
		position: absolute;
		left: 5.5vw;
		top: 1.5vh;
		font-size: 3em;
	}

	.notice-text {
		position: relative;
		padding: 0 30rpx;
		font-size: 30rpx;
		margin-bottom: 30rpx;
		background-color: #f9f9f9;
		position: relative;
		border-radius: 17rpx;
	}

	.nt-title {
		font-size: 1.4rem;
		margin-bottom: 30rpx;
	}

	.nt-text {
		height: auto;
		transition: height linear 1m;
	}

	.text-hien {
		height: 7.5vh;
		@include text-overflow-line(3);
	}

	.nt-xq {
		position: relative;
		text-align: center;
		color: #8ad1ff;
		line-height: 40rpx;

		.nt-xq_icon {
			position: absolute;
			font-size: 50rpx;
			left: 29vw;
		}

		:last-child {
			font-size: 22rpx;
		}
	}

	.nt-shou {
		font-size: 24rpx;
		color: #aaaaaa;
	}

	.notice-history {
		padding: 40rpx;
	}
}
</style>
