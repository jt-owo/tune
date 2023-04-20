import { useState, useEffect } from 'react';
import useToggle from './useToggle';

const useContextMenu = () => {
	const [visibility, toggle, hide] = useToggle();
	const [position, setPosition] = useState({
		x: 0,
		y: 0
	});

	useEffect(() => {
		const handleClick = () => hide();
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [hide]);

	return [visibility, toggle, position, setPosition] as const;
};

export default useContextMenu;
