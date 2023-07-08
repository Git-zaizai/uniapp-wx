<template>
	<view
		class="mask-view"
		:style="{ 'z-index': zindex,'background-color': 'rgba(0, 0, 0, '+ proopacity +')'}"
		v-show="isview"
		@touchmove.stop.prevent=""
		@click.stop="showclick"
	></view>
</template>

<script>
export default {
	name: 'mask-view',
	props: {
		zindex: {
			type: [String, Number],
			default: 1023
		},
		isview: {
			type: Boolean,
			default: false
		},
		proopacity: {
			type: [String, Number],
			default: 0.1
		}
	},
	data() {
		return {};
	},
	methods: {
		showclick() {
			this.$emit('showstop');
		}
	}
};
</script>

<style scoped>
.mask-view {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
}
</style>
