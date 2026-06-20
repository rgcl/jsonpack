export interface PackOptions {
    verbose?: boolean;
    debug?: boolean;
}

export interface UnpackOptions {
    verbose?: boolean;
}

/**
 * Packs a JSON value into a compact string representation.
 * Date objects are serialized as ISO 8601 strings.
 */
export function pack(json: unknown, options?: PackOptions): string;

/**
 * Unpacks a string produced by `pack` back into its original JSON value.
 */
export function unpack<T = unknown>(packed: string, options?: UnpackOptions): T;
