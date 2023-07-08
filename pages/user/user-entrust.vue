<template>
	<view>
		<template v-for="(item, index) in userentrust">
			<ent-rust :key="item.id" :proitem="item" :proindex="index">
				<view class="uen-but">
					<button
						class="cu-btn round bg-red shadow-blur uen-bb"
						@click="cancelclk(item.id, item.todel, index)"
					>
						{{ item.todel ? '重新发布' : '取消委托' }}
					</button>
					<button
						class="cu-btn round bg-orange shadow-blur uen-bb"
						@click="entrustdelete(item.id, index)"
					>
						删除委托
					</button>
				</view>
			</ent-rust>
		</template>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import EntRust from '@/components/entrust/entrust.vue';

export default {
	components: {
		EntRust
	},
	data() {
		return {
			userentrust: []
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		});
		this.getuserentrust();
	},
	methods: {
		async getuserentrust() {
			const req = await this.$request.getuserentrust();
			this.userentrust = req.data;
			uni.hideLoading();
		},
		async cancelclk(id, todel, index) {
			const update = await this.$request.updatetodel({ id, todel });
			if (update.code === 200) {
				this.userentrust[index].todel = 1;
				this.$refs.uToast.show({
					message: update.msg,
					type: 'success'
				});
			}
		},
		async entrustdelete(id, index) {
			uni.showModal({
				title: '提示',
				content: '您确定要删除委托吗？',
				success: async res => {
					if (res.confirm) {
						const reqdel = await this.$request.delentrust({ id });
						if (reqdel.code === 200) {
							this.userentrust.splice(index, 1);
							this.$refs.uToast.show({
								type: 'success',
								message: '删除成功！'
							});
						}
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.uen-but {
	position: absolute;
	top: 30rpx;
	right: 0;
}
.uen-bb {
	border-radius: 15rpx;
	font-size: 20rpx;
	height: 50rpx;
	padding: 0 19rpx;
	margin-right: 30rpx;
	background-color: #fa7272;
}
</style>
