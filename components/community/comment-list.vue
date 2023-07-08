<template>
	<view class="comm-view">
		<view class="cv-item">
			<view class="cv-top">
				<view class="cv-spl" v-if="prpcommentobj.divinepraise">神</view>
				<image
					class="cu-avatar round margin-left solid"
					:src="prpcommentobj.wx_avatarUrl || '../../static/tab_icon/my_cur.png'"
				></image>
				<view class="cv-t-name">
					<text>{{ prpcommentobj.wx_nickname || '匿名用户' }}</text>
					<text>{{ formatdate(prpcommentobj.date) }}</text>
				</view>
				<view class="cv-t-icon">
					<view class="cv-t-icon_view cv-t-icon_before" @click="appreciatefillClick">
						<u-icon name="thumb-up" size="21" :color="uiconcolor"></u-icon>
						<text class="cv-t-icon_text">{{ fabulous }}</text>
					</view>
					<view class="cv-t-icon_view" @click="fabulousclick">
						<text class="cuIcon-forward" style="font-size: 34rpx;"></text>
						<view class="cv-t-icon_shen" :class="{ 'cv-t-icon_res': shenclass }">
							{{ shenclass ? '已 送' : '送神评' }}
						</view>
					</view>
				</view>
			</view>
			<view class="cv-in">
				<view class="cv-i-view border-bom">
					<text
						class="createcla"
						:class="cvitext ? 'cv-i-text' : ''"
						@click="doubleclick"
					>
						{{ prpcommentobj.content }}
						<text class="vc-i-read" v-show="cvitext">
							<text>...</text>
							[ 双击展开 ]
						</text>
					</text>
					<view class="cv-i-img_view" v-if="prpcommentobj.comment_img">
						<image
							class="cv-i-img"
							:src="prpcommentobj.comment_img"
							mode="aspectFill"
						></image>
					</view>
					<template v-if="prpcommentobj.subcomment">
						<view class="cv-i-recc">
							<view
								class="cv-i-retext"
								v-for="subitem in prpcommentobj.subcomment"
								:key="subitem.id"
							>
								<text class="cv-i-username">{{ subitem.wx_nickname }}:</text>
								{{ subitem.content }}
							</view>
							<view class="cv-ir-chakn" @click="chakanc">
								查看{{ prpcommentobj.subcomment.length }}条评论
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { dateNew } from '@/common/js/utils';
import { httpappreciatefillClick } from '@/common/api/api-list.js';
export default {
	name: 'comment-list',
	props: {
		prpcommentobj: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			cvitext: false,
			uiconcolor: '',
			fabulous: this.prpcommentobj.comment_like,
			shenclass: false
		};
	},
	mounted() {
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.createcla')
			.boundingClientRect(data => {
				if (data.height >= 180) {
					this.cvitext = true;
				}
			})
			.exec();
	},
	methods: {
		doubleclick() {
			const timestamp = Date.parse(new Date());
			if (timestamp - this.lastClickTime <= 400) {
				console.log('双击');
				this.cvitext = !this.cvitext;
			}
			this.lastClickTime = timestamp;
		},
		chakanc() {
			this.$emit('plclick', 1);
		},
		formatdate(val) {
			const dateobj = dateNew(Math.round(val / 1000));
			return dateobj.m + '/' + dateobj.d;
		},
		async appreciatefillClick() {
			if (!getApp().globalData.userinfo) {
				this.$emit('comlogin');
				return;
			}
			const request = await httpappreciatefillClick({
				modele: 0,
				articleid: this.$parent.artiobj.id,
				commentid: this.prpcommentobj.id,
				divinepraise: this.prpcommentobj.divinepraise
			});
			if (request.code !== 200) return false;
			if (request.data) {
				this.uiconcolor = '#2d98e5';
				this.fabulous++;
			} else {
				this.uiconcolor = '#2d98e5';
			}
		},
		async fabulousclick() {
			if (this.shenclass) return;
			const res = await this.$request.divinereviewAdd({
				topic_id: this.$parent.artiobj.id,
				commid: this.prpcommentobj.id
			});
			if (res.data) {
				this.shenclass = true;
			}
		}
	}
};
</script>

<style scoped lang="scss">
$pl-textcoloc: #2d98e5;

.cv-spl {
	position: absolute;
	background-color: #fe90a6;
	color: #ffffff;
	font-size: 19rpx;
	left: 0;
	top: 0;
	width: 35rpx;
	height: 35rpx;
	border-bottom-right-radius: 100%;
	padding: 3rpx 0 0 5rpx;
}

.comm-view {
	background-color: #ffffff;
}

.cv-item {
	.cu-avatar {
		background-color: #fafafa;
	}
}

.cv-top {
	@include dif-alc;
	padding: 0 10rpx;
	height: 100rpx;
	position: relative;

	.cv-t-name {
		@include dif-fdc;
		width: 50%;
		padding-left: 32rpx;

		text:first-of-type {
			font-size: 24rpx;
			color: $git-text-coloc;
		}

		text:last-child {
			font-size: 21rpx;
			color: #b1b1b1;
			margin-top: 8rpx;
		}
	}

	.cv-t-icon {
		width: 34%;
		@include dif-juspb-alic;
	}

	.cv-t-icon_view {
		@include dif-alc;
		font-size: 24rpx;
		position: relative;

		.cv-t-icon_text {
			margin-top: 2rpx;
			margin-left: 10rpx;
			color: #5cabff;
		}

		.cv-t-icon_shen {
			margin-left: 15rpx;
			background-color: #5cabff;
			color: #ffffff;
			border-radius: 30rpx;
			padding: 8rpx 12rpx;
			font-size: 23rpx;
		}

		.cv-t-icon_res {
			background-color: #f5f5f7;
			color: #bbbbbb;
		}
	}
}
.cv-t-icon_before::before {
	content: ' ';
	width: 1rpx;
	height: 30rpx;
	background-color: #d5d5d5;
	position: absolute;
	left: -15px;
	top: 6rpx;
}

.cv-in {
	background-color: #ffffff;
	padding-bottom: 5px;

	.cv-i-view {
		width: calc(100% - 17.5% - 25rpx);
		margin: 10rpx 15rpx 15rpx 17.5%;
		padding-bottom: 40rpx;
	}

	.cv-i-text {
		max-height: 22vh;
		overflow: hidden;
		word-break: break-all; /* break-all(允许在单词内换行。) */
		// text-overflow: ellipsis; /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		// -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 8; /** 显示的行数 **/
		position: relative;
	}

	.cv-i-img_view {
		margin-top: 25rpx;
	}

	.cv-i-img {
		width: 190rpx;
		height: 190rpx;
		border-radius: 15rpx;
		margin: 5rpx;
	}
}

.vc-i-read {
	width: 180rpx;
	position: absolute;
	background-color: #ffffff;
	color: #b9b9b9;
	bottom: 4rpx;
	right: 7rpx;

	text {
		color: #000000;
	}
}

.cv-i-recc {
	padding: 30rpx;
	border-radius: 10rpx;
	background-color: #f5f5f7;
	margin-top: 30rpx;

	.cv-i-retext {
		margin-bottom: 20rpx;
		@include text-overflow-line(2);
	}

	.cv-i-username {
		color: $pl-textcoloc;
	}

	.cv-ir-chakn {
		color: $pl-textcoloc;
	}
}
</style>
