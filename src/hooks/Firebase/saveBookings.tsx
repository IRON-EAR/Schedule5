import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

class OverlapError extends Error {}

export type SaveResult = "success" | "overlap" | "failure";

export async function saveBookings(
  newDates: string[],
  oldDates: string[],
  username: string,
  emailAddress: string,
  refresh: () => Promise<void>,
): Promise<"success" | "overlap" | "failure"> {
  const bookingsRef = collection(db, "Bookings");

  // Dates the user already owns are being replaced, so they aren't conflicts
  const toCheck = newDates.filter((d) => !oldDates.includes(d));

  try {
    await runTransaction(db, async (tx) => {
      // All reads must happen before any writes
      const snaps = await Promise.all(
        toCheck.map((d) => tx.get(doc(bookingsRef, d))),
      );

      if (snaps.some((s) => s.exists())) {
        throw new OverlapError("Overlap with existing bookings");
      }

      oldDates.forEach((d) => tx.delete(doc(bookingsRef, d)));

      newDates.forEach((d) =>
        tx.set(doc(bookingsRef, d), {
          username: username ?? null,
          emailAddress: emailAddress ?? null,
          dateCreated: serverTimestamp(),
        }),
      );
    });
  } catch (error) {
    if (error instanceof OverlapError) return "overlap";
    console.error("saveBookings failed:", error);
    return "failure";
  }

  // Saved at this point; a refresh error shouldn't report the save as failed
  try {
    await refresh();
  } catch (error) {
    console.error("refresh failed:", error);
  }

  return "success";
}