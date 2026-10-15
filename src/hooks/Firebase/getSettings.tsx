import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

type getSettingsProps = {
  config: string
  value: any
}

export async function getSettings(): Promise<getSettingsProps[]> {
  const snapshot = await getDocs(collection(db, 'Settings'))
  return snapshot.docs.map( (doc) => ({
    config: doc.id,
    value: doc.data() 
  }))
}