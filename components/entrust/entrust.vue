<template>
	<view>
		<view class="entrust">
			<!-- 委托推荐 -->
			<title-bar icon="cuIcon-mail" bartitle="委托" barentitle="entrust"></title-bar>
			<slot></slot>
			<view class="entr-text" @click.stop="navroute">
				<view class="entr-user">
					<text
						class="t-icon t-icon-wode1"
						v-if="proitem.avatarUrl == 0 || proitem.avatarUrl === null"
					></text>
					<image class="cu-avatar round lg" v-else :src="proitem.avatarUrl"></image>
					<view class="eu-name-date">
						<text>发布人：{{ proitem.publisher }}</text>
						<text :decode="true">
							&emsp;&emsp;发布时间：{{ retdate(proitem.releasedate) }}
						</text>
					</view>
				</view>
				<view class="entr-uesr_text">
					<text class="enut-title">{{ proitem.title }}</text>
					<text class="enut-text">{{ proitem.text }}</text>
				</view>
				<view class="entr-img">
					<template v-if="proitem.imgurl.length !== 0">
						<image
							v-for="(imgitem, index) in imgurls"
							:key="index"
							class="entr-item-img"
							:src="imgitem"
							@click.stop="preimageclikc(imgurls)"
							mode="aspectFill"
						></image>
					</template>
				</view>
				<view class="entr-number">
					<view>
						<text class="cuIcon-attentionfill margin-lr-xs inter-icon_coloc"></text>
						{{ proitem.browse }}
					</view>
					<view>
						<text class="cuIcon-mark en-icon_mark"></text>
						已聊：{{ proitem.tochat }} &nbsp;人
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import TitleBar from '@/components/titlebar.vue';
import previewImage from '@/common/js/previewImage.js';
import { resuest_config } from '@/common/api/index.js';
import { dateNew } from '@/common/js/utils.js';
export default {
	name: 'entrust',
	components: {
		TitleBar
	},
	props: {
		proitem: {
			type: Object,
			default() {
				return {};
			}
		},
		proindex: Number
	},
	data() {
		return {};
	},
	computed: {
		imgurls() {
			let imgs = null;
			if (this.proitem.imgurl) {
				imgs = JSON.parse(this.proitem.imgurl).map(item => resuest_config.baseURL + item);
			}
			return imgs;
		}
	},
	methods: {
		preimageclikc(imgs) {
			previewImage(imgs);
		},
		navroute() {
			this.$emit('ennavclick', this.proitem, this.proindex);
		},
		retdate(val) {
			const da = dateNew(Math.round(val / 1000));
			return da.Y + '年' + da.m + '月' + da.d + '日';
		}
	}
};
</script>

<style lang="scss">
@import '@/common/css/entrust.scss';
.entrust {
	position: relative;
	margin-bottom: 10rpx;
}
.entr-text {
	padding: 10rpx 20rpx;

	.enut-text {
		line-height: 45rpx !important;
	}

	.eu-name-date {
		flex: 1;
	}
}
.entr-number {
	padding: 30rpx 20rpx 30rpx 10rpx;
}
</style>
