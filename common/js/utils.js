/**
 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param  func 需要执行的函数
 * @param  wait 延迟执行时间（毫秒）
 * @param  immediate---true 表立即执行，false 表非立即执行
 **/
export function debounce(func, wait, immediate) {
	let timer;
	return function() {
		let context = this;
		let args = arguments;
		if (timer) clearTimeout(timer);
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timer = setTimeout(function() {
				func.apply(context, args)
			}, wait);
		}
	}
}


export const dateNew = parameter => {
	let _date = new Date(parameter * 1000);
	let Y = _date.getFullYear(),
		m = _date.getMonth() + 1,
		d = _date.getDate(),
		H = _date.getHours(),
		i = _date.getMinutes(),
		s = _date.getSeconds();

	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	H = H < 10 ? '0' + H : H;
	i = i < 10 ? '0' + i : i;
	s = s < 10 ? '0' + s : s;
	let he = Y + '-' + m + '-' + d + '  ' + H + ':' + i;
	return {
		Y,
		m,
		d,
		H,
		i,
		s,
		he
	};
};

// 邮箱验证
export const imilEmail = (mo, value) => {
	if (mo === 'imil') {
		return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value);
	} else {
		const regexp =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regexp.test(value);
	}
}
