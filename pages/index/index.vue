<template>
	<view class="container">
		<!-- 轮播 -->
		<index-swiper></index-swiper>
		<!-- 卡片 -->
		<nav-list :proelements="elements"></nav-list>
		<template v-if="isel">
			<!-- 月推荐 -->
			<template v-for="(item, index) in defultrecommend">
				<reco-mmend
					:bartitle="item.bartitle"
					:barentitle="item.barentitle"
					:cucard="item.recommend"
					:top="index"
					:key="index"
				></reco-mmend>
			</template>

			<view class="entrust">
				<!-- 委托推荐 -->
				<title-bar icon="cuIcon-mail" bartitle="委托" barentitle="entrust"></title-bar>
				<view
					class="entr-text"
					v-for="(esitem, index) in defaultentrust"
					:key="index"
					@click="navroute(esitem)"
				>
					<view class="entr-user">
						<image
							class="cu-avatar round lg"
							:src="
								esitem.avatarUrl == 0
									? '../../static/tab_icon/my_cur.png'
									: esitem.avatarUrl
							"
							style="background-color: #FFFFFF;"
						></image>
						<view class="eu-name-date">
							<text>发布人：{{ esitem.publisher }}</text>
							<text :decode="true">
								&emsp;&emsp;发布时间：{{ retdate(esitem.releasedate) }}
							</text>
						</view>
					</view>
					<view class="entr-uesr_text">
						<text class="enut-title">{{ esitem.title }}</text>
						<text class="enut-text text-dwoe">{{ esitem.text }}</text>
					</view>
					<view class="entr-number">
						<view>
							<text class="cuIcon-attentionfill margin-lr-xs inter-icon_coloc"></text>
							{{ esitem.browse }}
						</view>
						<view>
							<text class="cuIcon-mark en-icon_mark"></text>
							已聊：{{ esitem.tochat }} &nbsp;人
						</view>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import IndexSwiper from '@/components/Index/IndexSwiper.vue';
import NavList from '@/components/Navlist.vue';
import RecoMmend from '@/components/recommend.vue';
import TitleBar from '@/components/titlebar.vue';
import { dateNew } from '@/common/js/utils.js';
export default {
	components: {
		IndexSwiper,
		NavList,
		RecoMmend,
		TitleBar
	},
	data() {
		return {
			isel: true,
			elements: [
				{
					title: '发吐槽',
					name: 'community',
					color: 'red',
					iconfont: 'icon-fenxiang-copy',
					url: '/pages/index/releasecommunity'
				},
				{
					title: '发委托',
					name: 'Commission',
					color: 'cyan',
					cuIcon: 'mail',
					url: '/pages/index/releaseEntrust'
				},
				{
					title: '公告',
					name: 'Notice',
					color: 'orange',
					cuIcon: 'calendar',
					url: '/pages/index/Notice'
				},
				{
					title: '委托',
					name: 'Entrust',
					color: 'blue',
					cuIcon: 'edit',
					url: '/pages/index/entrust-list'
				}
			],
			defultrecommend: [
				{
					recommend: []
				},
				{
					bartitle: '周吐槽',
					barentitle: 'Week',
					recommend: []
				}
			],
			defaultentrust: []
		};
	},
	onLoad() {
		this.getrecommend();
	},
	methods: {
		async getrecommend() {
			try {
				const request = await this.$request.indexdata();
				this.defultrecommend[0].recommend = request.data.month;
				this.defultrecommend[1].recommend = request.data.week;
				this.defaultentrust = request.data.entrust_text_data;
			} catch (e) {}
		},
		retdate(val) {
			const da = dateNew(Math.round(val / 1000));
			return da.Y + '年' + da.m + '月' + da.d + '日';
		},
		navroute(item) {
			uni.navigateTo({
				url: '/pages/index/entrust-details?id=' + item.id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/css/entrust.scss';
.entrust {
	padding: 0px 40rpx 0px;
	margin-top: 40rpx;
	margin-bottom: 40rpx;

	.entr-text:last-child {
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
		margin-bottom: 30rpx;
	}
}
</style>
