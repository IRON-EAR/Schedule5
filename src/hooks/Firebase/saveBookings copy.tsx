import { collection, doc, runTransaction, serverTimestamp, } from "firebase/firestore";
import { db } from "./Firebase";

export async function saveBookings(
  newDates: string[],
  oldDates: string[],
  username: string,
  emailAddress: string,
  refresh: () => Promise<void>,

): Promise<void> {
  
  const bookingsRef = collection(db, "Bookings");

  // Dates the user already owns are being replaced, so they aren't conflicts
  const toCheck: string[] = newDates.filter((d) => !oldDates.includes(d));

  await runTransaction(db, async (tx) => {
    // All reads must happen before any writes
    const snaps = await Promise.all(
      toCheck.map((d) => tx.get(doc(bookingsRef, d))),
    );

    if (snaps.some((s) => s.exists())) {
      throw new Error("Overlap with existing bookings");
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

  await refresh();
}