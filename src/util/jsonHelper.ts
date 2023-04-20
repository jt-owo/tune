/**
 * Json Utility class for main and ui.
 */
class Json {
	/**
	 * Checks if the given string is a valid JSON string.
	 * @param json JSON string to validate.
	 * @returns True if the string is a valid JSON string.
	 */
	static validate(json: string) {
		try {
			JSON.parse(json);
		} catch (err) {
			return false;
		}

		return true;
	}
}

export default Json;
