import { Slider as SliderPrimitive } from 'bits-ui';

import Root from './slider.svelte';

type Props = SliderPrimitive.RootProps & {
	className?: string;
};

export {
	Root,
	type Props,
	//
	Root as Slider,
	type Props as SliderProps,
};
