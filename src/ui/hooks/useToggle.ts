import { useCallback, useState } from 'react';

const useToggle = (defaultValue = false) => {
	const [value, setValue] = useState(defaultValue);

	const setFalse = () => setValue(false);
	const setTrue = () => setValue(true);

	const toggle = useCallback(() => setValue((x) => !x), []);

	return [value, toggle, setFalse, setTrue] as const;
};

export default useToggle;
