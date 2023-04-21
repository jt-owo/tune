import { ReactNode, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function createWrapper(wrapperID: string): HTMLDivElement {
	const wrapperEl = document.createElement('div');
	wrapperEl.setAttribute('id', wrapperID);
	document.body.appendChild(wrapperEl);
	return wrapperEl;
}

interface PortalProps {
	wrapperID: string;
	children: ReactNode;
}

const Portal = ({ children, wrapperID }: PortalProps): JSX.Element | null => {
	const [wrapperElement, setWrapperElement] = useState<HTMLDivElement>();

	useLayoutEffect(() => {
		let element = document.getElementById(wrapperID) as HTMLDivElement;
		let systemCreated = false;
		if (!element) {
			element = createWrapper(wrapperID);
			systemCreated = true;
		}
		setWrapperElement(element);

		return () => {
			if (systemCreated && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		};
	}, [wrapperID]);

	if (wrapperElement == null) return null;

	return createPortal(children, wrapperElement);
};

export default Portal;
