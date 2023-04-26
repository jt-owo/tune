import { useState, useEffect, RefObject } from 'react';
import useToggle from './useToggle';

const useContextMenu = (target?: RefObject<HTMLElement>) => {
	const [visibility, toggle, hide] = useToggle();
	const [position, setPosition] = useState({
		x: 0,
		y: 0
	});

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (target) {
				if (target.current && !target.current.contains(e.target as Node)) hide();
			} else {
				hide();
			}
		};
		document.addEventListener('click', (e) => {
			handleClick(e);
		});
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [hide, target]);

	return [visibility, toggle, position, setPosition] as const;
};

export default useContextMenu;
