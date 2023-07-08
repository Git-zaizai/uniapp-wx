// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import {
	http
} from './common/api/index.js';
import * as request from './common/api/api-list.js';

import uView from '@/uni_modules/uview-ui'

Vue.use(uView);
Vue.prototype.$http = http;
Vue.prototype.$request = request;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'

export function createApp() {
	const app = createSSRApp(App);
	return {
		app
	}
}
// #endif
