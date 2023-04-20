import styles from './View.module.scss';

interface ViewProps {
	id: string;
	title?: string;
	children?: JSX.Element | JSX.Element[];
}

const View = ({ title, children, id }: ViewProps): JSX.Element => {
	return (
		<div className={styles.view}>
			{title && <div className={styles['view-heading']}>{title}</div>}
			<div className={styles['view-content']}>
				<div className={styles[`${id}-container`]}>{children}</div>
			</div>
		</div>
	);
};

export default View;
