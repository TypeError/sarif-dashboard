import { z } from "zod";

export const SarifLogSchema = z.object({
  version: z.literal("2.1.0"),
  runs: z.array(
    z.object({
      tool: z.object({
        driver: z.object({
          name: z.string().min(1, "Tool name is required."),
        }),
      }),
    })
  ),
});

/**
 * Attempt to parse and validate the SARIF content.
 * Returns `true` if valid, `false` if invalid.
 */
export function validateSarif(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    SarifLogSchema.parse(parsed);
    return true;
  } catch (error) {
    console.error("SARIF validation failed:", error);
    return false;
  }
}
