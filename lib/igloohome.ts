/**
 * Igloohome Integration
 *
 * For now, this uses mock access code generation.
 * When you have Igloohome API credentials, replace generateMockAccessCode with real API calls.
 */

/**
 * Generates a random 6-digit access code
 *
 * MOCK IMPLEMENTATION: Replace this with real Igloohome API when credentials are available
 */
export function generateMockAccessCode(): string {
  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

/**
 * Creates an access code for a booking
 * Currently uses mock generation, will be replaced with Igloohome API
 *
 * @param bookingId - The booking ID
 * @param startDate - Access code valid from this date
 * @param endDate - Access code expires after this date
 * @returns The generated access code
 */
export async function createAccessCode(
  bookingId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  // TODO: Replace with real Igloohome API call when credentials available
  // const lockId = process.env.IGLOOHOME_LOCK_ID;
  // const response = await igloohomeAPI.createAccessCode({
  //   lockId,
  //   startTime: startDate.getTime(),
  //   endTime: endDate.getTime(),
  //   name: `Booking ${bookingId}`
  // });
  // return response.accessCode;

  // MOCK: Generate random code for now
  const accessCode = generateMockAccessCode();

  console.log(`[MOCK] Generated access code ${accessCode} for booking ${bookingId}`);
  console.log(`[MOCK] Valid from ${startDate.toISOString()} to ${endDate.toISOString()}`);

  return accessCode;
}

/**
 * Deletes an access code from Igloohome
 * Currently a mock implementation
 */
export async function deleteAccessCode(accessCode: string): Promise<void> {
  // TODO: Replace with real Igloohome API call
  console.log(`[MOCK] Would delete access code ${accessCode} from Igloohome`);
}
