// src/utils/generateTranId.ts
import crypto from "crypto";

/**
 * Returns a 20-char string composed of:
 *  • a base-36 timestamp prefix (e.g. "ktnwp3j3p" for Date.now())
 *  • plus random hex characters (so total length is 20).
 */
export function generateTranId(): string {
  // 1) Take the current UNIX timestamp in base-36 (e.g. "ktnwp3j3p")
  const tsBase36 = Date.now().toString(36); // typically ~8–9 chars

  // 2) Generate enough random bytes so that tsBase36 + hexString is ≥20 chars
  //    6 random bytes → 12 hex chars; so tsBase36 + 12 hex = ~20
  const randomHex = crypto.randomBytes(6).toString("hex"); // exactly 12 hex chars

  // 3) Concatenate and slice to 20 characters
  return (tsBase36 + randomHex).slice(0, 20);
}
