<template>
	<view>
		<view v-if="isview">
			<view class="view-login" @click="isView" @touchmove.stop.prevent="">
				<view class="vl-views">
					<view class="vl-icon-view" v-show="closeview">
						<text class="cuIcon-close vl-icon"></text>
					</view>
					<text class="vl-title">您还没有登录</text>
					<text class="vl-title_er">请先登录在进行操作</text>
					<button
						class="cu-btn block lg bg-red vl-button shadow-blur"
						@click.stop="loginbut"
					>
						<view v-show="but_text">
							<text class="cuIcon-my"></text>
							立即登录
						</view>

						<view v-show="!but_text">
							<text class="cuIcon-loading2 cuIconfont-spin"></text>
							登录中
						</view>
					</button>
					<view class="vl-zhan" @click.stop="isView">暂不登录</view>
				</view>
			</view>
		</view>
		<view
			v-else
			class="view-login-transparent"
			v-show="transparent"
			@click.stop="loginbut(0)"
		></view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import promiselogin from '@/common/js/login.js';
import { httplogin, httprefreshToken } from '@/common/api/api-list.js';
export default {
	name: 'login-but',
	props: {
		transparent: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			closeview: false,
			but_text: true,
			isview: false
		};
	},
	methods: {
		async loginbut(min) {
			this.but_text = !this.but_text;
			let userinfo = uni.getStorageSync('userinfo');

			// 用户登录过
			if (userinfo != '') {
				if (Math.ceil(new Date().getTime() / 1000) - userinfo.past_time <= 259200) {
					// 登录时间没有超时
					getApp().globalData.userinfo = userinfo;
					this.uToastShow(min);
					return false;
				} else {
					// 登录时间超时 刷新token
					const { data } = await httprefreshToken();
					getApp().globalData.userinfo = userinfo;
					uni.setStorageSync('userinfo', { ...data, ...userinfo });
					this.uToastShow(min);
					return false;
				}
			}

			uni.getUserProfile({
				desc: '登录',
				lang: 'zh_CN',
				success: async res => {
					const requestcode = await promiselogin();
					if (requestcode.respoeo.code !== 200) {
						uni.showToast({
							title: '登录失败，意外错误，请联系管理员',
							duration: 2000,
							icon: 'none'
						});
						return;
					}
					const requestlogin = await httplogin({ res, code: requestcode.code });
					if (requestlogin.code === 200) {
						getApp().globalData.userinfo = { ...requestlogin.data, ...res.userInfo };
						uni.setStorageSync('userinfo', { ...requestlogin.data, ...res.userInfo });
					}
					this.uToastShow(min);
				},
				fail: err => {
					uni.showModal({
						title: '提示',
						content: '您取消了授权，请手动关闭登录界面',
						showCancel: false,
						confirmText: '您知道了'
					});
					this.but_text = !this.but_text;
				}
			});
		},
		isView() {
			this.isview = !this.isview;
		},
		uToastShow(min) {
			let than = this;
			this.$refs.uToast.show({
				message: '登录成功',
				type: 'success',
				complete() {
					if (min !== 0) {
						than.isView();
						than.but_text = !than.but_text;
					}
					than.$emit('logunShow');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.view-login {
	position: fixed;
	z-index: 1030;
	top: 0rpx;
	left: 0rpx;
	width: 100vw;
	height: 100vh;
	background-color: rgba(85, 85, 85, 0.5);
	@include dif-jucc-alc;

	.vl-views {
		width: 80%;
		padding: 32rpx 40rpx 24rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		@include dif-fdc-juc-alc;
	}

	.vl-title {
		font-size: 36rpx;
		font-weight: 600;
	}

	.vl-title_er {
		font-size: 28rpx;
		color: $git-text-coloc;
		margin-top: 10rpx;
	}

	.vl-button {
		width: 100%;
		height: 70rpx;
		margin: 20rpx 0;
	}

	.vl-zhan {
		width: 100%;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
	}

	.vl-icon-view {
		position: relative;
		width: 100%;
		height: 40rpx;
	}
	.vl-icon {
		position: absolute;
		right: 3vw;
		font-size: 38rpx;
	}
}

.view-login-transparent {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: transparent;
}
</style>
