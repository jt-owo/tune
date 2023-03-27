import { FC } from 'react';

import style from './View.module.scss';

interface ViewProps {
	id: string;
	title?: string;
	children?: JSX.Element | JSX.Element[];
}

const View: FC<ViewProps> = (props) => {
	const { title, children, id } = props;

	return (
		<div className={style.view}>
			{title && (
				<>
					<div className={style['view-heading']}>{title}</div>
					{/* <div id="divider" /> */}
				</>
			)}
			<div className={style['view-content']}>
				<div className={style[`${id}-container`]}>{children}</div>
			</div>
		</div>
	);
};

export default View;
