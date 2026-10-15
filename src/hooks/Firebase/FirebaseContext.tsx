import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getBookings } from "./getBookings";
import { getAdminList } from "./getAdminList";
import { getSettings } from "./getSettings";

type bookingType = { date: string; username: string | null };

type FirebaseContextType = {
    bookings: bookingType[];
    adminList: string[];
    settings: any;
    refresh: () => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
    const [adminList, setAdminList] = useState<string[]>([]);
    const [settings, setSettings] = useState<any>();
    const [bookings, setBookings] = useState<bookingType[]>([]);

    const refresh = useCallback(async () => {
        const [b, a, s] = await Promise.all([getBookings(), getAdminList(), getSettings()]);
        setBookings(b);
        setAdminList(a);
        setSettings(s);
    }, []);

    useEffect(() => {
        refresh().catch(console.error);
    }, [refresh]);

    // const isBooked = useCallback(
    //     (date: string) =>
    //         bookings.some(
    //             (item) => item.date === date && item.username !== user?.displayName
    //         ),
    //     [bookings, user?.displayName]
    // );

    return (
        <FirebaseContext.Provider
            value={{ bookings, adminList, settings, refresh }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}

export function useFirebase() {
    const ctx = useContext(FirebaseContext);
    if (!ctx) throw new Error("useFirebase must be used inside FirebaseProvider");
    return ctx;
}