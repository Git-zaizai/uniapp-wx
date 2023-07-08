<template>
	<view>
		<template v-for="(item, index) in entrust">
			<ent-rust
				:key="item.id"
				:proitem="item"
				:proindex="index"
				@ennavclick="navroute"
			></ent-rust>
		</template>

		<u-loadmore
			:status="loadmore.status"
			:line="loadmore.line"
			height="32"
			:loadingText="loadmore.loadingText"
		/>
		<view class="tabbar-bottom"></view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { getectrustlimit, getonPull } from '@/common/api/api-list.js';
import { debounce } from '@/common/js/utils.js';
import EntRust from '@/components/entrust/entrust.vue';

export default {
	components: {
		EntRust
	},
	data() {
		const debounceList = debounce(this.getlimit, 1000, true);
		return {
			entrust: [],
			limit: 0,
			debounceList: debounceList
		};
	},
	onLoad() {
		uni.showLoading({
			title: '拼命加载中！'
		});
		this.getlimit(this.limit);
	},
	methods: {
		async getlimit(limit) {
			const { data } = await getectrustlimit({ limit });
			if (data.length >= 5) {
				this.limit = this.limit + data.length;
			} else {
				this.loadmore = {
					nomoreText: '没有更多了', //没有更多的提示语
					status: 'nomore',
					line: true
				};
				this.limit = false;
			}
			this.entrust = this.entrust.concat(data);
			uni.hideLoading();
		},
		async onPullcallback() {
			const request = await getonPull({
				id: this.entrust[0].id
			});
			if (request.data) {
				this.entrust.unshift(...request.data);
			} else if (request.data === 0) {
				this.$refs.uToast.show({
					type: 'success',
					message: request.msg
				});
			}
			uni.stopPullDownRefresh();
		},
		retdate(val) {
			const da = dateNew(Math.round(val / 1000));
			return da.Y + '年' + da.m + '月' + da.d + '日';
		},
		navroute(item, index) {
			this.$request.entrustbrowse({ id: item.id }).then(res => {
				if (res === 200) {
					this.entrust[index].browse++;
				}
			});
			uni.navigateTo({
				url: '/pages/index/entrust-details?id=' + item.id
			});
		}
	},
	onPullDownRefresh() {
		this.onPullcallback();
	},
	onReachBottom() {
		if (this.limit === false) return false;
		this.debounceList(this.limit);
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/css/entrust.scss';
.entrust {
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
