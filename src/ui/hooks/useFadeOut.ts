import { useCallback, useEffect, useState } from 'react';

/**
 * Returns a fading out state and a function to trigger the fade.
 * @param callback Function to invoke after fade out.
 * @param autoFade If the fading should start automatically.
 * @param autoFadeTimeout Amount of ms it will take before the auto fade starts.
 */
const useFadeOut = (callback: () => void, autoFade = false, autoFadeTimeout = 3000): [boolean, () => void] => {
	const [isFadingOut, setFadingOut] = useState(false);

	/**
	 * Sets {@link isFadingOut} to true and invokes the callback function {@link cb} with a timeout of 300ms
	 */
	const fadeOut = useCallback(() => {
		setTimeout(() => {
			callback();
		}, 300);
		setFadingOut(true);
	}, [callback]);

	useEffect(() => {
		if (autoFade) {
			const timeID = setTimeout(() => fadeOut(), autoFadeTimeout);
			return () => clearTimeout(timeID);
		}

		return () => {};
	}, [autoFade, fadeOut, autoFadeTimeout]);

	return [isFadingOut, fadeOut];
};

export default useFadeOut;
