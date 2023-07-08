<template>
	<view class="release">
		<view class="re-alua">
			<text class="re-title" @click="retitleclk">
				<text class="cuIcon-write re-ti-icon"></text>
				编辑事项
			</text>
			<view class="re-ta" :class="{ 'show-chucang': is_realue }" v-show="is_realue">
				编辑注意事项：
				<text class="re-tt">
					\n\n额 在编译的时候还是不要退出当前页面，会清楚掉编写的内容
				</text>
				<text>
					\n\n1、内容的第一个回车之前的文本内容都将作为标题使用，不管有没有加标题的设置
				</text>
				<text>
					\n\n2、内容从上往下第一张图片将会作为标题图片使用，建议您在标题之后插入图片作为标题图片使用
				</text>
				<text>\n\n3、由于资源的限制暂不支持视频的上传</text>
			</view>
		</view>
		<cu-editor
			ref="editor"
			:url="uploadUrl"
			:header="header"
			:formData="formData"
			:content="content"
			@before="onUploadBefore"
			@update="onUpdate"
			@save="onSave"
			:readOnly="isreadonly"
		></cu-editor>
	</view>
</template>

<script>
import cuEditor from '@/components/cu-editor/cu-editor';
import { handleHtmlImage } from '@/components/cu-editor/util';
import { resuest_config } from '@/common/api/index.js';
import { httparticleText } from '@/common/api/api-list.js';
export default {
	components: {
		cuEditor
	},
	data() {
		return {
			content: '',
			uploadUrl: resuest_config.baseURL + '/wx/imgupload',
			header: {},
			formData: {},
			isreadonly: '',
			is_realue: false
		};
	},
	onLoad(options) {
		if (options.item) {
			const item = JSON.parse(decodeURIComponent(options.item));
			item.content ? (this.content = item.content) : '';
		}

		/* 	wx.enableAlertBeforeUnload({
			message: '退出本页面文章将会清楚，您确定吗？'
		}); */

		/* 	uni.showModal({
			title: '注意事项',
			showCancel: false,
			content: '在您编辑的过程中，请勿退出本页面，退出本页面文章将会清楚掉。'
		}); */

		this.header = {
			token: uni.getStorageSync('userinfo').token
		};
	},
	methods: {
		onUploadBefore: function(e) {
			// console.log(e);
			this.formData = {
				timestamp: Date.parse(new Date()) / 1000,
				iscommunity: true
			};
		},
		onUpdate(res) {
			res.html = handleHtmlImage(res.html);
			this.value = res.html;
		},
		//保存
		async onSave(e) {
			console.log(e);
			let html = e.html;
			var containsImage = html.search(/<img /i) >= 0; //内容是否包含图片标签
			let txt = e.text.replace(/(^\s*)|[\r\n]|(\s*$)/g, ''); //去掉换行符和两端空格

			const title = e.text.split(/\s/)[0]; //获取标题
			// 拿取封面图
			let cover_picture = '';
			if (containsImage) {
				//拿第一个img标签的url
				cover_picture = html.match(/src=[\'\"]?([^\'\"]*)?/)[0];
				// 在拿取http或https链接
				cover_picture = cover_picture.match(/(http|https):\/\/([\w.]+\/?)\S*/)[0];
			}

			const request = await httparticleText({
				text: html,
				title: title,
				titleimg: cover_picture
			});

			if (request.code === 200) {
				uni.showToast({
					title: request.msg,
					icon: 'success',
					duration: 2000,
					success() {
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000);
					}
				});
			}
		},
		// 编辑事项
		retitleclk() {
			this.is_realue = !this.is_realue;
		}
	}
};
</script>

<style lang="scss" scoped>
.release {
	position: relative;

	.re-alua {
		position: absolute;
		z-index: 1000;
		top: 30rpx;
		left: 20rpx;
	}

	.re-title {
		font-size: 26rpx;
		color: $textColor;
	}

	.re-ti-icon {
		margin-right: 5rpx;
		color: #e03997;
	}

	.re-ta {
		position: absolute;
		width: 80vw;
		top: 10vh;
		left: 7vw;
		background-color: #ffffff;
		border-radius: 15rpx;
		box-shadow: 0 0 5rpx #dcdcdc;
		padding: 30rpx;
		padding-bottom: 60rpx;
		font-weight: 700;
	}

	.re-tt {
		color: $textColor;
	}
}
</style>
