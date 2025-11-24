/**
 * Convert a plain object to a single-line "key: value, key2: value2" string.
 * Keys are sorted alphabetically by default to produce deterministic output.
 * By default this function will omit "empty" values (null/undefined, empty
 * strings or whitespace-only strings, empty arrays/objects).
 *
 * Example:
 *   stringifyObject({ mail: "example.com", name: "john" })
 *   // "name: john, mail: example.com"
 *
 * @param {Object} obj - Plain object to stringify
 * @param {Object} [opts]
 * @param {boolean} [opts.sort=true] - If true, sort keys alphabetically
 * @param {string} [opts.separator=", "] - Separator between pairs
 * @param {string} [opts.kvSeparator=": "] - Separator between key and value
 * @param {boolean} [opts.skipEmpty=true] - Omit null/undefined/empty values
 * @param {boolean} [opts.treatWhitespaceAsEmpty=true] - Treat "  " as empty
 * @param {boolean} [opts.skipEmptyObjects=true] - Omit empty plain objects
 * @param {boolean} [opts.skipEmptyArrays=true] - Omit empty arrays
 * @returns {string}
 */
function stringifyObject(obj, opts = {}) {
    const {
        sort = true,
        separator = ',\n',
        kvSeparator = ': ',
        skipEmpty = true,
        treatWhitespaceAsEmpty = true,
        skipEmptyObjects = true,
        skipEmptyArrays = true,
    } = opts;

    if (obj === null || obj === undefined) return String(obj);
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        // For non-object inputs, return a simple string representation
        return String(obj);
    }

    const keys = Object.keys(obj);
    if (sort) keys.sort((a, b) => a.localeCompare(b));

    const pairs = [];
    for (const key of keys) {
        const val = obj[key];

        // Optionally skip "empty" values
        if (skipEmpty) {
            if (val === null || val === undefined) continue;
            if (typeof val === 'string') {
                if (treatWhitespaceAsEmpty ? val.trim() === '' : val === '') continue;
            }
            if (typeof val === 'number' && Number.isNaN(val)) continue;
            if (typeof val === 'object') {
                if (Array.isArray(val)) {
                    if (skipEmptyArrays && val.length === 0) continue;
                } else {
                    if (skipEmptyObjects && Object.keys(val).length === 0) continue;
                }
            }
        }

        let out;
        if (val === null || val === undefined) out = String(val);
        else if (typeof val === 'object') out = JSON.stringify(val);
        else out = String(val);

        pairs.push(`${key}${kvSeparator}${out}`);
    }

    return pairs.join(separator);
}

// Export as ESM default and also provide a compatibility alias
export default stringifyObject;
export const stringiftObject = stringifyObject;