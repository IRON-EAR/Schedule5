import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export async function getBookings(): Promise<{ date: string; username: string | null }[]> {
  const snapshot = await getDocs(collection(db, "Bookings"));
  return snapshot.docs.map((doc) => ({
    date: doc.id,
    username: doc.data().username ?? null,
  }));
}