<template>
	<view class="user-config">
		<view class="ucg-view">
			<text class="ucg-tilte">
				额！没啥好设置的，\n 当然你也可以绑定一下手机号，\n 哈哈！
			</text>
			<view class="ucg-ipt">
				<uni-easyinput
					v-model="email"
					placeholder="请输入手机号"
					maxlengt="11"
					confirmType="send"
					:styles="styles"
					:disabled="disabled"
					@confirm="conft"
				></uni-easyinput>
				<button
					class="cu-btn margin-tb-sm lg shadow-blur"
					style="background-color: #81c995; color: #FFFFFF;"
					@click="conft"
				>
					{{ buttext }}
				</button>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			disabled: false,
			buttext: '发送'
		};
	},
	onLoad() {
		this.getemail();
	},
	methods: {
		async getemail() {
			const res = await this.$request.selectemail();
			if (res.data !== 0) {
				this.email = res.data;
				this.disabled = true;
				this.buttext = '修改绑定号码';
			}
		},
		async conft() {
			if (this.disabled) {
				this.disabled = false;
				this.buttext = '发送';
				return;
			}
			const res = await this.$request.userupdataemail({
				email: this.email
			});
			if (res.code === 200) {
				this.$refs.uToast.show({
					message: '绑定成功',
					type: 'success'
				});
				this.disabled = true;
				this.buttext = '修改绑定号码';
			}
		}
	}
};
</script>

<style>
.user-config {
	height: 100%;
	background: url('https://www.cubcub.top/img/hoawande.svg') repeat-y;
	background-size: contain;
}
.ucg-view {
	position: absolute;
	width: 80%;
	height: 30vh;
	background-color: #ffffff;
	top: calc(50vh - 15vh);
	left: 10%;
	border-radius: 25rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: 1.2s ease 0s 1 normal none running show;
}

.ucg-tilte {
	width: 80%;
	margin-top: 50rpx;
	text-align: center;
}
.ucg-ipt {
	width: 100%;
	padding: 7% 10% 0 10%;
}
.cu-btn {
	width: 100%;
	margin-top: 50rpx;
}
@keyframes show {
	0% {
		transform: translateY(-100px);
	}

	60% {
		transform: translateY(40rpx);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
