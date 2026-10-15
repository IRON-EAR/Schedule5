import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "./Firebase";

export async function saveSettings(
  activeDate: string
) {
  const batch = writeBatch(db);
  const collectionRef = collection(db, "Settings");


  batch.set(doc(collectionRef, 'activeDate'), {
    value: activeDate
  })

  await batch.commit()
}