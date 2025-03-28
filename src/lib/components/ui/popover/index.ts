import { Popover as PopoverPrimitive, type PopoverContentProps } from 'bits-ui';

import Content from './popover-content.svelte';
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;
const Close = PopoverPrimitive.Close;

type Props = PopoverContentProps & {
	transition?: null;
	transitionConfig?: null;
};

export {
	Root,
	Content,
	Trigger,
	Close,
	type Props,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	Close as PopoverClose,
	type Props as PopoverProps,
};
