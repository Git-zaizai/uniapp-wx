<template>
	<view class="views">
		<view class="user-title">
			<!-- <image class="backimg" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg" mode="">
			</image> -->
			<view class="user-svg"></view>
			<view class="user-img">
				<image
					:src="userinfo.avatarUrl || '../../static/tab_icon/userfons.png'"
					mode=""
				></image>
				<text>{{ userinfo.nickName || '请登录' }}</text>
				<login-but @logunShow="logunShow"></login-but>
			</view>
		</view>

		<!-- 暂时没有东西 -->

		<view class="user-name shadow-warp">
			<text>每日签到，额，没什么用，随便点点也行</text>
			<button class="cu-btn round bg-cyan bg-cyan shadow-blur" @click="suixin">
				随心签到
			</button>
		</view>
		<view style="height: 7vh"></view>
		<view class="user-list-function" v-for="(nlmfitem, index) in ulnfunction" :key="index">
			<text class="uln-title">{{ nlmfitem.title }}</text>
			<view class="uln-ctr">
				<view
					class="uln-item"
					v-for="(ulni, ui) in nlmfitem.ulnitem"
					:key="ui"
					@click="nlnitemclikc(ulni.uid, ulni.url)"
				>
					<text
						class="uln-icon"
						:class="ulni.iconclass"
						:style="{ color: ulni.iconColor }"
					></text>
					<text class="uln-icon-text">{{ ulni.text }}</text>
				</view>
			</view>
		</view>
		<view class="tabbar-bottom"></view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import NavList from '@/components/Navlist.vue';
import loginBut from '@/components/login-but.vue';
export default {
	components: {
		NavList,
		loginBut
	},
	data() {
		return {
			userinfo: null,
			ulnfunction: [
				{
					title: '常用',
					ulnitem: [
						{
							uid: 0,
							iconclass: 'iconfont icon-fenxiang-copy',
							iconColor: '#f37b1d',
							text: '我的文章',
							url: '/pages/user/user-community'
						},
						{
							uid: 1,
							iconclass: 'cuIcon-mail',
							iconColor: '#1cbbb4',
							text: '我的委托',
							url: '/pages/user/user-entrust'
						},
						// {
						// 	uid: 2,
						// 	iconclass: 'cuIcon-commandfill',
						// 	iconColor: '#fdd663',
						// 	text: '接受的委托'
						// }
					]
				},
				{
					title: '我的账户',
					ulnitem: [
						{
							uid: 3,
							iconclass: 'cuIcon-my',
							iconColor: '#9b26ae',
							text: '账号管理',
							url: '/pages/user/user-config'
						},
						{
							uid: 4,
							iconclass: 'cuIcon-expressman',
							iconColor: '#ee675c',
							text: '退出登录'
						}
					]
				},
				{
					title: '功能反馈',
					ulnitem: [
						{
							uid: 5,
							iconclass: 'cuIcon-repairfill',
							iconColor: '#ff0000',
							text: '功能反馈',
							url: '/pages/user/user-opinion'
						}
					]
				}
			]
		};
	},
	onShow() {
		// 页面出现  获取用户登录数据
		this.userinfo = getApp().globalData.userinfo;
	},
	methods: {
		// 用户登录完成 获取在globalData中的用户数据
		logunShow() {
			this.userinfo = getApp().globalData.userinfo;
		},
		// 判断用户是否登录  限制功能
		nlnitemclikc(uid, usr) {
			if (uid <= 3) {
				if (!this.userinfo) {
					this.$refs.uToast.show({
						message: '请先登录才可以哦！',
						type: 'error'
					});
					return;
				}
			}

			if (uid === 4) {
				uni.removeStorage({
					key: 'userinfo',
					success: () => {
						this.$refs.uToast.show({
							message: '退出成功',
							type: 'success'
						});
					}
				});
				return;
			}
			
			uni.navigateTo({
				url: usr
			});
		},
		// 无聊签到
		suixin() {
			this.$refs.uToast.show({
				message: '随心签',
				type: 'warning'
			});
		}
	}
};
</script>

<style scoped lang="scss">
.user-title {
	position: relative;
	width: 100%;
	height: 25vh;
	background-color: #ffffff;
	border-bottom-left-radius: 10rpx;
	border-bottom-right-radius: 10rpx;
	// background-color: rgba(0, 0, 0, 0.7);
	// background-size: 100%;

	.backimg {
		position: absolute;
		top: 0;
		width: 100%;
		height: 35vh;
		opacity: 0.1;
	}
}

.user-svg {
	z-index: 2;
	position: absolute;
	width: 100%;
	height: 100%;
	background: url('https://www.cubcub.top/img/hoawande.svg') repeat-y;
	background-size: 100% 100%;
}

.user-img {
	position: relative;
	width: 20vw;
	height: 75%;
	margin: 0 auto;
	z-index: 10;
	@include dif-fdc-juc-alc;

	image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}

	text {
		margin-top: 5%;
	}
}

.user-name {
	position: absolute;
	width: 90%;
	top: 21.5vh;
	left: 5%;
	height: 120rpx;
	background-color: #ffffff;
	border-radius: 35rpx;
	@include dif-juspey-alc;

	text {
		font-size: 24rpx;
		color: $textColor;
	}
}

.scroll {
	position: absolute;
	width: 90%;
	height: calc(100vh - 20vh);
	margin: 0 auto;
	top: 20vh;
	left: calc(100vw - 95%);
	box-shadow: 0 0px 6px 0px #c7c7c7;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;

	.scroll_view {
		background-color: #ffffff;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		padding-top: 45rpx;
	}

	::v-deep .nav-li {
		width: 95%;
	}
}

.user-list-function {
	background-color: #ffffff;
	width: 95%;
	margin: 0 auto;
	margin-top: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx 30rpx 0rpx 30rpx;

	.uln-title {
		color: #878787;
		font-size: 28rpx;
	}

	.uln-ctr {
		@include dif-alc;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}
}

.uln-item {
	@include dif-fdc-juc-alc;
	width: 33%;
	height: 160rpx;
	margin-bottom: 20rpx;

	.uln-icon {
		font-size: 60rpx;
	}

	.uln-icon-text {
		margin-top: 10rpx;
		font-size: 26rpx;
		letter-spacing: 5rpx;
	}
}
</style>
