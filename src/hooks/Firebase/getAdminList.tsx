import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export async function getAdminList(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, "Admin"));
  return snapshot.docs.map((doc) => doc.id )
}