<template>
	<view>
		<view class="view-textarea view-tabbar">
			<textarea
				class="cv-t-textarea"
				confirm-type="send"
				placeholder="不笑天灾,不笑人祸,不笑贫穷,不明事理,不加评论"
				maxlength="-1"
				v-model="textareavalue"
				:auto-height="true"
				:show-confirm-bar="false"
				:focus="isfocus"
				@blur="showstop"
				@confirm="confirmclick"
			/>
		</view>
		<mask-view :isview="true" @showstop="showstop"></mask-view>
	</view>
</template>

<script>
import maskView from '@/components/mask-view.vue';

export default {
	name: 'comm-textarea',
	components: {
		maskView
	},
	props:{
		isfocus:{
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
			textareavalue: ''
		};
	},
	methods: {
		showstop() {
			this.$emit('textreavclick', this.textareavalue);
		},
		confirmclick() {
			this.$emit('confirmcEmit', this.textareavalue);
		}
	}
};
</script>

<style scoped>
.view-textarea {
	height: 57vh;
	padding: 10rpx 20rpx;
}
.cv-t-textarea {
	width: 100%;
	margin: 0 auto;
	min-height: 100rpx;
	border-radius: 10rpx;
	padding: 10rpx;
	background-color: #f5f5f6;
}
</style>
