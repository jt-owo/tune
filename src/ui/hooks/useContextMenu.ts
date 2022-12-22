import { useState, useEffect } from 'react';

const useContextMenu = () => {
	const [visibility, setVisibility] = useState(false);
	const [position, setPosition] = useState({
		x: 0,
		y: 0
	});

	useEffect(() => {
		const handleClick = () => setVisibility(false);
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return [visibility, setVisibility, position, setPosition] as const;
};

export default useContextMenu;
