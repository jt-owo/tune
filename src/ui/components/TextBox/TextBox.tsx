import { ChangeEvent, KeyboardEvent } from 'react';

import styles from './TextBox.module.scss';

type TextBoxSize = 'small' | 'medium' | 'large';

interface TextBoxProps {
	value?: string;
	size?: TextBoxSize;
	className?: string;
	placeholder?: string;
	defaultValue?: string;
	autoFocus?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	onKeyDown?: (e: KeyboardEvent) => void;
}

const TextBox = ({ value, size, className, placeholder, defaultValue, autoFocus, onChange, onBlur, onKeyDown }: TextBoxProps): JSX.Element => {
	let classes = styles['text-box'];
	if (size) classes = styles[`text-box-${size}`];
	if (className) classes += ` ${className}`;

	return <input type="text" value={value} placeholder={placeholder} defaultValue={defaultValue} className={classes} autoFocus={autoFocus} onBlur={onBlur} onChange={onChange} onKeyDown={onKeyDown} />;
};

export default TextBox;
