import { z } from "zod";

export type ParseSchemaResult<T> =
    | { success: true; data: T }
    | { success: false; error: z.ZodError };

export function parseSchema<T>(
    value: unknown,
    schema: z.ZodType<T>,
): ParseSchemaResult<T> {
    const result = schema.safeParse(value);
    if (result.success) {
        return { success: true as const, data: result.data };
    }
    console.error(result.error);
    return { success: false as const, error: result.error };
}