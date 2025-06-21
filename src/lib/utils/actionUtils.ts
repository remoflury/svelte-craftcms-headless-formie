/**
 * A custom svelte action that listens for click events outside of a specified node.
 * When a click occurs outside the node, a custom event 'clickoutside' is dispatched on the node.
 * The type of it is defined in app.d.ts

 * @param {HTMLElement} node 
 * @param ignore 
 * @returns 
 * 
 * @example
 * <div use:clickOutside onclickoutside={someFn}>...</div>
 */
export const clickOutside = (node: HTMLElement, ignore?: string) => {
	const handleClick = (event: Event) => {
		const target = event.target as HTMLElement;
		if (!event.target || (ignore && target.closest(ignore))) {
			return;
		}
		if (node && !node.contains(target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickoutside'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
