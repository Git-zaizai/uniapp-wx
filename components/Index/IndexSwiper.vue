<template>
	<view class="inex-swiper">
		<swiper
			class="card-swiper"
			:class="dotStyle ? 'square-dot' : 'round-dot'"
			:indicator-dots="true"
			:circular="true"
			:autoplay="false"
			interval="5000"
			duration="1000"
			@change="cardSwiper"
			indicator-color="#8799a3"
			indicator-active-color="#0081ff"
		>
			<swiper-item
				v-for="(item, index) in swiperList"
				:key="index"
				:class="cardCur == index ? 'cur' : ''"
			>
				<view class="swiper-item">
					<image :src="item.url" mode="aspectFill" v-if="item.type == 'image'"></image>
					<video
						:src="item.url"
						autoplay
						loop
						muted
						:show-play-btn="false"
						:controls="false"
						objectFit="cover"
						v-if="item.type == 'video'"
					></video>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { resuest_config } from '@/common/api/index.js';
export default {
	name: 'IndexSwiper',
	data() {
		return {
			cardCur: 0,
			swiperList: [
				{
					id: 0,
					type: 'image',
					url: resuest_config.baseURL + '/img/inex-swiper.png'
				}
			],
			dotStyle: false,
			towerStart: 0,
			direction: ''
		};
	},
	onLoad() {
		this.TowerSwiper('swiperList');
		// 初始化towerSwiper 传已有的数组名即可
	},
	methods: {
		DotStyle(e) {
			this.dotStyle = e.detail.value;
		},
		// cardSwiper
		cardSwiper(e) {
			this.cardCur = e.detail.current;
		},
		// towerSwiper
		// 初始化towerSwiper
		TowerSwiper(name) {
			let list = this[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex =
					parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
				list[i].mLeft = i - parseInt(list.length / 2);
			}
			this.swiperList = list;
		},

		// towerSwiper触摸开始
		TowerStart(e) {
			this.towerStart = e.touches[0].pageX;
		},

		// towerSwiper计算方向
		TowerMove(e) {
			this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left';
		},

		// towerSwiper计算滚动
		TowerEnd(e) {
			let direction = this.direction;
			let list = this.swiperList;
			if (direction == 'right') {
				let mLeft = list[0].mLeft;
				let zIndex = list[0].zIndex;
				for (let i = 1; i < this.swiperList.length; i++) {
					this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft;
					this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex;
				}
				this.swiperList[list.length - 1].mLeft = mLeft;
				this.swiperList[list.length - 1].zIndex = zIndex;
			} else {
				let mLeft = list[list.length - 1].mLeft;
				let zIndex = list[list.length - 1].zIndex;
				for (let i = this.swiperList.length - 1; i > 0; i--) {
					this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft;
					this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex;
				}
				this.swiperList[0].mLeft = mLeft;
				this.swiperList[0].zIndex = zIndex;
			}
			this.direction = '';
			this.swiperList = this.swiperList;
		}
	}
};
</script>

<style lang="scss" scoped>
.inex-swiper {
	padding-bottom: 30rpx;

	swiper-item {
		padding: 40rpx 0rpx 11rpx;
	}
}
</style>
