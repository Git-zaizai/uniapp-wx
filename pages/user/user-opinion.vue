<template>
	<view class="opinion">
		<view class="title border-bom">建议</view>
		<view class="border-bom optext">
			<u--textarea
				v-model="text"
				placeholder="请填写10个字以上的问题描述以便我们提供更好的帮助"
				count
				height="200"
				:showConfirmBar="false"
				maxlength="200"
			></u--textarea>
		</view>
		<view class="cu-bar bg-white">
			<view>截图</view>
			<view class="action">{{ imgList.length }}/8</view>
		</view>
		<view class="cu-form-group border-bom">
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
		<view class="opipt border-bom">
			<text>联系方式</text>
			<uni-easyinput
				type="text"
				v-model="email"
				maxlength="20"
				placeholder="邮箱/手机号"
				placeholderStyle="color: #c3c3c3"
				:inputBorder="false"
			/>
		</view>

		<view class="op-but-view">
			<text>48小时内可有会有客服联系您</text>
			<button
				class="cu-btn lg opbut shadow-blur"
				:disabled="text.length >= 10 ? false : true"
				@click="opbutclicl"
			>
				提交
			</button>
		</view>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import axiosFile from '@/common/api/uploadFile.js';
import { imilEmail } from '@/common/js/utils.js';
export default {
	data() {
		return {
			text: '',
			imgList: [],
			email: '',
			imgurllist: [],
			imgindex: 0
		};
	},
	methods: {
		DelImg(e) {
			if (this.imgList.length > 1) {
				this.imgList.splice(e.currentTarget.dataset.index, 1);
			} else {
				uni.showModal({
					content: '确定不添加图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				});
			}
		},
		ChooseImage() {
			uni.chooseImage({
				count: 8, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择,
				success: res => {
					if (this.imgList.length != 0) {
						this.imgList.unshift(res.tempFilePaths);
					} else {
						this.imgList = res.tempFilePaths;
					}
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		async opbutclicl() {
			if (imilEmail('imil', this.email) || imilEmail('', this.email)) {
				uni.showLoading({
					title: '加载中'
				});

				const imgupload = async i => {
					const imgres = await axiosFile(this.imgList[i]);
					if (imgres.code === 200) {
						this.imgurllist.push(imgres.data);
					}
					if (i + 1 <= this.imgList.length - 1) {
						this.imgindex++;
						imgupload(this.imgindex);
					}
				};

				await imgupload(this.imgindex);

				const req = await this.$request.opinionadd({
					text: this.text,
					email: this.email,
					imgurllist: this.imgurllist
				});

				if (req.code === 200) {
					this.$refs.uToast.show({
						message: req.msg,
						type: 'success'
					});

					this.text = '';
					this.email = '';
					this.imgurllist = [];
					this.imgList = [];
				}
				uni.hideLoading();
			} else {
				this.$refs.uToast.show({
					message: '请填写正确的手机号或邮箱！',
					type: 'error'
				});
			}
		}
	}
};
</script>
<style>
page {
	background-color: #ffffff;
}
</style>
<style scoped lang="scss">
.cu-form-group {
	padding: 0;
}
.opinion {
	padding: 30rpx 40rpx;

	.title {
		height: 100rpx;
		line-height: 100rpx;
	}

	.optext {
		margin-top: 20rpx;
	}
	.opipt {
		@include dif-alc;
		height: 100rpx;

		text {
			margin-right: 20rpx;
		}
	}

	.op-but-view {
		@include dif-fdc-juc-alc;
		height: 20vh;

		text {
			font-size: 24rpx;
			margin-bottom: 20rpx;
			color: $git-text-coloc;
		}
	}

	.opbut {
		background-color: #05c05f;
		color: #ffffff;
		width: 300rpx;
		height: 70rpx;
		font-size: 28rpx;
	}
}
</style>
