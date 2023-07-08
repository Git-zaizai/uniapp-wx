<template>
	<view class="releaseEntrust">
		<view class="back-img"></view>
		<view class="from">
			<uni-forms :modelValue="formData" label-position="top">
				<uni-forms-item label="发布人">
					<uni-easyinput
						type="text"
						v-model="formData.publisher"
						maxlength="20"
						placeholder="请填写发布人"
						placeholderStyle="color: #c3c3c3"
					/>
				</uni-forms-item>
				<uni-forms-item label="微信号">
					<uni-easyinput
						type="text"
						v-model="formData.wxh"
						placeholder="请填写要联系的微信号(默认为您登录的微信号)"
						placeholderStyle="color: #c3c3c3"
					/>
				</uni-forms-item>
				<uni-forms-item label="手机号">
					<view class="fel-v">
						<view style="width: 100%;">
							<uni-easyinput
								type="text"
								v-model="formData.email"
								placeholder="请填写要联系的手机号"
								maxlength="11"
								placeholderStyle="color: #c3c3c3"
							/>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="头像">
					<view class="fel-switch">
						<text>是否公开头像</text>
						<switch
							@change="SwitchA"
							:class="formData.switchA ? 'checked' : ''"
							:checked="formData.switchA ? true : false"
						></switch>
					</view>
				</uni-forms-item>
				<uni-forms-item label="标题">
					<u--textarea
						v-model="formData.title"
						placeholder="请输入内容"
						count
						autoHeight
						maxlength="50"
					></u--textarea>
				</uni-forms-item>
				<uni-forms-item label="简述内容">
					<u--textarea
						v-model="formData.text"
						placeholder="请输入内容"
						count
						height="185"
						maxlength="-1"
					></u--textarea>
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="cu-bar bg-white">
			<view class="action">图片上传</view>
			<view class="action">{{ imgList.length }}/9</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view
					class="bg-img"
					v-for="(item, index) in imgList"
					:key="index"
					@tap="ViewImage"
					:data-url="imgList[index]"
				>
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length < 9">
					<text class="cuIcon-cameraadd"></text>
				</view>
			</view>
		</view>
		<view class="view-position"></view>
		<view class="re-bar">
			<view class="cu-bar bg-white tabbar border shop">
				<button class="cu-btn bg-red margin-tb-sm lg re-but" @click="bufaclikc">
					发布
				</button>
			</view>
		</view>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
		<view class="login-pores"><loginBut ref="loginbut"></loginBut></view>
	</view>
</template>

<script>
import loginBut from '@/components/login-but.vue';
import { resuest_config } from '@/common/api/index.js';
import { httpreleaseEntrust } from '@/common/api/api-list.js';
import uploadFile from '@/common/api/uploadFile.js';
const imgurlList = [];
export default {
	name: 'releaseEntrust',
	components: {
		loginBut
	},
	data() {
		return {
			formData: {
				publisher: '',
				wxh: '',
				email: '',
				title: '',
				text: '',
				avatarUrl: false
			},
			imgList: [],
			imgFilesList: [],
			imginddex: 0
		};
	},
	methods: {
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e) {
			if (this.imgList.length > 1) {
				this.imgList.splice(e.currentTarget.dataset.index, 1);
				this.imgFilesList.splice(e.currentTarget.dataset.index, 1);
			} else {
				uni.showModal({
					content: '确定不添加图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
							this.imgFilesList = [];
						}
					}
				});
			}
		},
		ChooseImage() {
			uni.chooseImage({
				// count: 4, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择,
				success: res => {
					console.log(res);
					if (this.imgList.length != 0) {
						this.imgList.unshift(res.tempFilePaths);
						this.imgFilesList.unshift(res.tempFiles);
					} else {
						this.imgList = res.tempFilePaths;
						this.imgFilesList = res.tempFiles;
					}
				}
			});
		},
		bufaclikc() {
			if (this.formData.publisher === '') {
				this.showToast('请填写发布人');
				return;
			}

			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.formData.email)) {
				this.showToast('请填写正确的手机号');
				return;
			}

			if (this.formData.title.length < 10) {
				this.showToast('标题不得少于10个字符');
				return;
			}

			if (this.formData.text.length < 10) {
				this.showToast('简书内容不得少于10个字符');
				return;
			}

			/* if (this.$store.state.userinfo === null) {
				this.$refs.loginbut.isView();
				return;
			} */

			if (getApp().globalData.userinfo === null) {
				this.$refs.loginbut.isView();
				return;
			}

			uni.showLoading({
				title: '发布中！'
			});
			if (this.imgFilesList.length === 0) {
				this.release();
			} else {
				this.httpFile(this.imgFilesList[this.imginddex].path);
			}
		},
		showToast(message, type = 'error', icon = 'close') {
			this.$refs.uToast.show({
				message,
				type,
				icon
			});
		},
		httpFile(filePath) {
			const formData = this.formData;
			uni.uploadFile({
				url: resuest_config.baseURL + '/wx/imgupload', //
				filePath: filePath,
				header: { token: uni.getStorageSync('userinfo').token },
				name: 'img',
				formData: formData,
				success: uploadFileRes => {
					const { data } = JSON.parse(uploadFileRes.data);
					imgurlList.push(data);
					this.imginddex++;
					if (this.imginddex < this.imgFilesList.length) {
						this.httpFile(this.imgFilesList[this.imginddex].path);
					} else if (this.imginddex === this.imgFilesList.length) {
						this.release();
					}
				}
			});
		},
		async release() {
			this.imginddex = 0;
			const fdata = this.formData;
			const releaserequest = await httpreleaseEntrust({
				imgurl: imgurlList,
				...fdata
			});
			if (releaserequest.code === 200) {
				uni.showToast({
					title: releaserequest.msg,
					icon: 'success',
					success: () => {
						setTimeout(() => {
							uni.hideLoading();
							uni.navigateBack();
						}, 2000);
					}
				});
			}
		},
		SwitchA(e) {
			this.formData.switchA = e.target.value;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}

.view-position {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	padding-bottom: calc(env(safe-area-inset-bottom) / 2);
}

.from {
	padding: 20rpx 30rpx;

	::v-deep .u-textarea {
		border: 1rpx solid #e5e5e5;
	}

	.re-textarea {
		height: 20vh;
	}

	.fel-v {
		@include dif-alc;
	}

	.fel-but {
		margin-left: 20rpx;
		height: 36px;
		font-size: 27rpx;
	}

	.fel-switch {
		width: 100%;
		@include dif-juspb-alic;
		color: #666666;
	}

	// ::v-deep .uni-forms-item__inner {
	// 	padding-bottom: 5px;
	// }
}

.re-bar {
	position: fixed;
	width: 100vw;
	bottom: calc(env(safe-area-inset-bottom) / 2 - 30rpx);

	.re-but {
		width: 90vw;
		margin: 0 auto;
	}
}

.login-pores {
	position: relative;
}
</style>
