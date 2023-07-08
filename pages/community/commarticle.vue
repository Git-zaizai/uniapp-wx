<template>
	<view>
		<view class="comm-article">
			<view class="cu-card dynamic no-card">
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<image
								v-if="artiobj.userimg"
								class="cu-avatar round lg"
								:src="artiobj.userimg"
							></image>
							<image
								v-else
								class="cu-avatar round lg"
								src="../../static/tab_icon/userfons.png"
							></image>

							<view class="content flex-sub">
								<view>Token-没了</view>
								<view class="text-gray text-sm flex justify-between">
									2022年02月10日
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="comm-editor">
					<view v-show="is_load">
						<u-parse :content="artiobj.text" @load="uparseload"></u-parse>
					</view>
					<image-loading v-show="!is_load"></image-loading>
				</view>
				<view class="text-gray text-sm padding interaction">
					<view class="inter-view">
						<text class="cuIcon-attention margin-lr-xs inter-icon_margin"></text>
						{{ artiobj.attentionfill }}
					</view>
					<view
						class="inter-view"
						:class="{ 'icon-click': community_click }"
						@click.stop="appreciatefillClick(1, 1)"
					>
						<text class="cuIcon-appreciate margin-lr-xs inter-icon_margin"></text>
						{{ artiobj.appreciatefill }}
					</view>
					<view class="inter-view">
						<text class="cuIcon-message margin-lr-xs inter-icon_margin"></text>
						{{ artiobj.messagefill }}
					</view>
				</view>
			</view>
		</view>
		<view class="cv-bar border-bom">评论</view>

		<template v-if="commentlist.length">
			<commentList
				v-for="item in commentlist"
				:key="item.id"
				:prpcommentobj="item"
				@singleclick="singleclick"
				@comlogin="oncomlogin"
			></commentList>
		</template>

		<template v-else>
			<u-empty
				text="还没有人占沙发哦!"
				width="300"
				height="300"
				textSize="24"
				icon="http://cdn.uviewui.com/uview/empty/comment.png"
			></u-empty>
			<!-- 空白占位 -->
			<view style="height: 150rpx;"></view>
		</template>

		<!-- 空白占位 -->
		<view style="height: 150rpx;"></view>
		<view class="view-tabbar cv-tabbar_view">
			<view v-show="inptshow">
				<view class="cv-t-vi">
					<input
						class="cv-tabbar_ipt"
						type="text"
						placeholder="不笑天灾,不笑人祸,不笑贫穷,不明事理,不加评论"
						@focus="InputFocus"
						:adjust-position="false"
						v-model="formdata.content"
					/>
					<text class="cuIcon-pic cv-tabbar_icon" @click="picclick"></text>
					<button
						class="cu-btn bg-green shadow-blur cv-tabar_but"
						@click="onconfirmcemit(1)"
					>
						发送
					</button>
				</view>
			</view>
			<view v-show="!inptshow">
				<comm-textarea
					ref="commtextarea"
					:isfocus="!inptshow"
					@textreavclick="textreavclick"
					@confirmc-emit="onconfirmcemit"
				></comm-textarea>
			</view>
		</view>
		<login-but ref="loginbut" :transparent="false"></login-but>
	</view>
</template>

<script>
import commentList from '@/components/community/comment-list.vue';
import maskView from '@/components/mask-view.vue';
import commTextarea from '@/components/community/comm-textarea.vue';
import LoginBut from '@/components/login-but.vue';
import { httpappreciatefillClick } from '@/common/api/api-list.js';
import ImageLoading from '@/components/image-loading.vue';
export default {
	name: 'commarticle',
	components: {
		commentList,
		commTextarea,
		maskView,
		LoginBut,
		ImageLoading
	},
	data() {
		return {
			artiobj: {},
			is_load: false,
			commentlist: [],
			inptshow: true,
			community_click: false,
			formdata: {
				topic_type: 0,
				content: '',
				to_uid: 0,
				to_wx_nickname: ''
			}
		};
	},
	onLoad(onldata) {
		this.getcommarticle(onldata.id);
	},
	methods: {
		async getcommarticle(id) {
			uni.showLoading({
				title: '加载中'
			});
			const { data } = await this.$request.getarticleid({ id });
			let sortlist = data.comment
				.filter(item => item.divinepraise === 1)
				.sort((itemindex, itemafter) => itemafter.comment_like - itemindex.comment_like);
			data.comment.forEach(item => {
				if (!item.divinepraise) sortlist.push(item);
			});
			this.artiobj = data.communityone;
			this.commentlist = sortlist;
			this.$nextTick(function() {
				uni.hideLoading();
			});
		},
		picclick() {
			uni.showToast({
				title: '由于空间有限，暂不开放！',
				icon: 'none'
			});
		},
		textreavclick(value) {
			this.inptshow = true;
			this.formdata.content = value;
		},
		InputFocus(e) {
			this.inptshow = false;
		},
		// 发送评论
		async onconfirmcemit(value) {
			// '用户直接用键盘的发送按钮发送',
			if (value !== 1) {
				this.formdata.content = value;
			}
			const req = await this.$request.getcomment({
				...this.formdata,
				topic_id: this.artiobj.id
			});
			if (req.data) {
				this.commentlist.unshift(req.data);
				uni.showToast({
					title: req.msg,
					icon: 'none'
				});
				this.artiobj.messagefill++;
				this.formdata.content = '';
				this.$refs.commtextarea.textareavalue = '';
			}
		},
		async appreciatefillClick(modele) {
			if (!getApp().globalData.userinfo) {
				this.$refs.loginbut.isView();
				return;
			}
			const request = await httpappreciatefillClick({
				modele,
				articleid: this.artiobj.id
			});
			if (request.code !== 200) return false;
			if (request.data) {
				this.artiobj.appreciatefill++;
				this.community_click = true;
			} else {
				this.community_click = true;
			}
		},
		oncomlogin() {
			this.$refs.loginbut.isView();
		},
		// dom 加载完成时触发
		uparseload() {
			this.is_load = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-card {
	margin-bottom: 10rpx;
}

.comm-article {
	background-color: #ffffff;
}
.comm-editor {
	padding: 20rpx;
}
.interaction {
	@include dif-juspb-alic;

	.inter-view {
		@include dif-alc;
	}

	.inter-icon_margin {
		margin-right: 30rpx;
		font-size: 33rpx;
	}
}
.icon-click {
	color: #9bc6fc;
}
.cv-bar {
	background-color: #ffffff;
	height: 80rpx;
	font-size: 30rpx;
	font-weight: 700;
	padding-left: 40rpx;
	line-height: 80rpx;
}

.cv-tabbar_view {
	background-color: #ffffff;
	height: 150rpx;
	padding-top: 20rpx;

	.cv-tabbar_ipt {
		width: 60%;
		background-color: #f5f5f6;
		height: 60rpx;
		border-radius: 30rpx;
		margin-left: 40rpx;
		padding: 0 30rpx;
		margin-bottom: 40rxp;
		line-height: 60rpx;
	}

	.cv-tabbar_icon {
		font-size: 62rpx;
		margin-left: 30rpx;
	}

	.cv-tabar_but {
		height: 60rpx;
		margin-left: 30rpx;
		margin-top: 4rpx;
		background-color: #92c1ff;
	}

	.cv-t-vi {
		width: 100%;
		display: flex;
	}

	.cv-t-textarea {
		width: 90%;
		margin: 0 auto;
		// height: 60rpx;
		border-radius: 10rpx;
		padding: 10rpx;
	}
}
</style>
