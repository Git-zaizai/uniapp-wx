<template>
	<view>
		<template v-for="(item, index) in viewdata">
			<comm-view
				:key="item.id"
				:procommdata="item"
				:proindex="index"
				@fabulous="fabulousclick"
			>
				<view class="uc-del shadow-blur" @click.stop="delclick(item.id, index)">
					<text class="cuIcon-delete uc-d-icon"></text>
				</view>
			</comm-view>
		</template>
		<u-action-sheet
			:actions="list"
			:closeOnClickOverlay="true"
			:closeOnClickAction="true"
			:title="title"
			:show="show"
		></u-action-sheet>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import commView from '@/components/community/comm-view.vue';
// 要在前端进行分页 这个变量保存所有数据
let pagelist;
export default {
	components: {
		commView
	},
	data() {
		return {
			viewdata: [],
			slicep: 4
		};
	},
	onLoad() {
		this.getaxios();
	},
	onHide() {
		pagelist = null;
	},
	methods: {
		// 获取文章列表
		async getaxios() {
			const req = await this.$request.commview();
			if (req.data.length < 5) {
				this.viewdata = req.data;
			} else {
				pagelist = req.data;
				this.viewdata = req.data.slice(0, 5);
			}
			uni.stopPullDownRefresh();
		},
		// 点赞回调
		fabulousclick() {
			this.$refs.uToast.show({
				message: '不好意思，不能给自己点赞！',
				type: 'warning'
			});
		},
		// 删除文章
		delclick(id, index) {
			uni.showModal({
				title: '提示',
				content: '您确定要删除这篇文章吗？',
				success: async res => {
					if (res.confirm) {
						const reqdel = await this.$request.usercommdel({ id });
						if (reqdel.code === 200) {
							this.viewdata.splice(index, 1);
							pagelist && pagelist.splice(index, 1);
							this.$refs.uToast.show({
								type: 'success',
								message: '删除成功！'
							});
						}
					}
				}
			});
		}
	},
	// 上拉加载
	onReachBottom() {
		if (pagelist === undefined) return false;
		if (this.slicep >= pagelist.length) {
			this.$refs.uToast.show({
				type: 'success',
				message: '已经是最新的了！'
			});
			return;
		}
		this.viewdata = pagelist.slice(this.slicep, 4);
		thi.slicep = this.slicep + 4;
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getaxios();
	}
};
</script>

<style lang="scss" scoped>
.uc-del {
	position: absolute;
	width: 70rpx;
	height: 70rpx;
	background-color: #fa7272;
	top: 0;
	right: 0;
	border-bottom-left-radius: 100%;
}

.uc-d-icon {
	position: absolute;
	top: 12rpx;
	right: 8rpx;
	font-size: 34rpx;
	color: #ffffff;
}
</style>
