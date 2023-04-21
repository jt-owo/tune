/* eslint-disable no-bitwise */

/**
 * Guid class to create unique ids for main and ui.
 */
class Guid {
	/**
	 * Generates a new guid.
	 *
	 * https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
	 * @returns Guid.
	 */
	static new = () => {
		const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
	};
}

export default Guid;
