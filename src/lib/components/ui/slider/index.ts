import Root from './slider.svelte';
import { Slider as SliderPrimitive } from 'bits-ui';

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
