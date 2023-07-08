<template>
	<view>
		<!-- <view class="entrust">
			<title-bar icon="cuIcon-mail" bartitle="委托" barentitle="entrust"></title-bar>
			<view class="entr-text">
				<view class="entr-user">
					<text
						class="t-icon t-icon-wode1"
						v-if="item.avatarUrl == 0 || item.avatarUrl === null"
					></text>
					<image class="cu-avatar round lg" v-else :src="details.avatarUrl"></image>
					<view class="eu-name-date">
						<text>发布人：{{ details.publisher }}</text>
						<text :decode="true">
							&emsp;&emsp;发布时间：{{ retdate(details.releasedate) }}
						</text>
					</view>
				</view>
				<view class="entr-uesr_text">
					<text class="enut-title">{{ details.title }}</text>
					<text class="enut-text">{{ details.text }}</text>
				</view>
				<view class="entr-img">
					<template v-if="details.imgurl.length !== 0">
						<image
							v-for="(item, index) in details.imgurl"
							:key="index"
							class="entr-item-img"
							:src="item"
							@click="preimageclikc"
							mode="aspectFill"
						></image>
					</template>
				</view>
				<view class="entr-number">
					<view>
						<text class="cuIcon-attentionfill margin-lr-xs inter-icon_coloc"></text>
						{{ details.browse }}
					</view>
					<view>
						<text class="cuIcon-mark en-icon_mark"></text>
						已聊：{{ details.tochat }} &nbsp;人
					</view>
				</view>
			</view>
		</view> -->
		<!-- <EntRust :proitem="details"></EntRust> -->
		<ent-rust :proitem="details"></ent-rust>
		<view class="en-tishi">
			<view class="en-ts_text">
				<text class="en-ts_title">温馨提示</text>
				<view class="en-ts_t">
					由于资源的限制， 在线聊天暂没开放， 所有请您自行联系发布委托人， 请谅解
				</view>
			</view>
			<button class="cu-btn round bg-cyan en-but shadow-blur" @click="butc">接受委托</button>
			<view class="tabbar-bottom"></view>
		</view>
		<view class="en-req" v-if="isenreq">
			<view class="en-rt">
				<text>微信号：</text>
				<view class="en-r_view">
					<view class="en-r_ipt">{{ details.wxh }}</view>
					<button class="cu-btn round bg-cyan en-rt_but shadow-blur" @click="setcbd(0)">
						点我复制
					</button>
				</view>
			</view>
			<view class="en-rt">
				<text>手机号：</text>
				<view class="en-r_view">
					<view class="en-r_ipt">{{ details.email }}</view>
					<button class="cu-btn round bg-cyan en-rt_but shadow-blur" @click="setcbd(1)">
						点我复制
					</button>
				</view>
			</view>
		</view>
		<mask-view zindex="1" :isview="isenreq" @showstop="enshowstop"></mask-view>
		<u-toast ref="uToast"></u-toast>
		<login-but ref="loginbut" :transparent="false"></login-but>
	</view>
</template>

<script>
import LoginBut from '@/components/login-but.vue';
import TitleBar from '@/components/titlebar.vue';
import { dateNew } from '@/common/js/utils.js';
import previewImage from '@/common/js/previewImage.js';
import MaskView from '@/components/mask-view.vue';
import { resuest_config } from '@/common/api/index.js';
import EntRust from '@/components/entrust/entrust.vue';
export default {
	components: {
		TitleBar,
		LoginBut,
		MaskView,
		EntRust
	},
	data() {
		return {
			details: {},
			isenreq: false,
			isreq: false
		};
	},
	onLoad(data) {
		if (data.id) {
			this.getdetails(data.id);
		}
	},
	methods: {
		async getdetails(id) {
			const req = await this.$request.entrustdetails({ id });
			if (req.data) {
				this.details = req.data;
			}
		},
		retdate(val) {
			const da = dateNew(Math.round(val / 1000));
			return da.Y + '年' + da.m + '月' + da.d + '日';
		},
		preimageclikc() {
			previewImage(imgurls);
		},
		butc() {
			if (this.isreq) {
				this.$refs.uToast.show({
					message: '不能接受同一个委托三次！',
					type: 'error'
				});
			}
			if (!getApp().globalData.userinfo) {
				this.$refs.loginbut.isView();
				return;
			}
			this.$request
				.acceptadd({
					id: this.details.id
				})
				.then(res => {
					if (res.data === 1) {
						uni.showToast({
							title: res.msg,
							success: () => {
								setTimeout(() => {
									this.isenreq = !this.isenreq;
								}, 1500);
							}
						});
					} else if (res.data === 3) {
						this.$refs.uToast.show({
							message: res.msg,
							type: 'error'
						});
						this.isreq = true;
					}
				});
		},
		setcbd(isnum) {
			const str = isnum ? this.details.email : this.details.wxh;
			uni.setClipboardData({
				data: str,
				success: function() {
					uni.showToast({
						title: '复制成功'
					});
				}
			});
		},
		enshowstop() {
			uni.showModal({
				title: '提示',
				content: '您确定关闭吗？',
				success: res => {
					if (res.confirm) {
						this.isenreq = !this.isenreq;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/css/entrust.scss';
.enut-text {
	line-height: 45rpx !important;
}
.entr-img {
	padding: 20rpx;
}

.en-tishi {
	@include dif-fdc-juc-alc;
	background-color: #ffffff;
	margin-top: 20rpx;
	// padding: 20rpx 0;
	// padding-bottom: 20rpx;
}
.en-ts_text {
	width: 90%;
	border-radius: 15rpx;
	margin: 20rpx auto;
	background-color: #f8f8f8;
	padding: 10rpx 0;

	.en-ts_t {
		text-align: left;
		width: 80%;
		margin: 0 auto;
	}
	.en-ts_title {
		color: #c13131;
		font-size: 36rpx;
		margin-left: 10%;
		margin-top: 10rpx;
	}
}

.en-but {
	width: 90%;
}

.en-req {
	position: fixed;
	z-index: 2;
	width: 90%;
	height: 30vh;
	top: calc(50vh - 15vh);
	left: 5%;
	background-color: #ffffff;
	border-radius: 30rpx;
	box-shadow: 0px 0px 13px 0px #a9a9a9;
	@include dif-fdc-juc-alc;

	.en-rt {
		width: 90%;
		margin: 20rpx auto;
	}
}

.en-r_view {
	@include dif-alc;
	margin-top: 20rpx;

	.en-r_ipt {
		width: 68%;
		height: 64rpx;
		background-color: #f1f1f1;
		border-radius: 30rpx;
		line-height: 64rpx;
		padding-left: 20rpx;
		color: #bfbfbf;
	}

	.en-rt_but {
		margin-left: 20rpx;
	}
}
</style>
