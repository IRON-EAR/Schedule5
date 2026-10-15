import { useEffect, useState } from "react";
import { useFirebase } from "../hooks/Firebase/FirebaseContext";
import { saveSettings } from "../hooks/Firebase/saveSettings";
import './AdminBlock.css'

export default function AdminBlock() {
    const { bookings, settings, refresh } = useFirebase();
    const activeDate: string | undefined = settings?.find(
        (item: any) => item.config === 'activeDate'
    )?.value?.value;

    const [month, setMonth] = useState(activeDate?.slice(0, 7) ?? "1970-01");

    const groupedByUser = Array.from(
        bookings
            .filter(({ date }) => date.startsWith(month))
            .reduce((acc, { username, date }) => {
                const key = username ?? '';
                acc.set(key, [...(acc.get(key) ?? []), date]);
                return acc;
            }, new Map<string, string[]>()),
        ([username, arrDates]) => ({ username, arrDates })
    );


    useEffect(() => {
        if (activeDate) setMonth(activeDate.slice(0, 7));
    }, [activeDate]);

    const handlerOnClick = () => {
        saveSettings(`${month}-01`)
        refresh()
    }

    const bookingCard = (username: string, arrDates: string[]) => (
        <>
        <div className="groupedDates">
            <span>{username}</span>
            {arrDates.map((item) => <section>{item}</section>)}
        </div>
        <br/>
        </>
    )


    return (
        <div className="d">

            <div className="adminBlock">
                <input
                    className="datePicker"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
                <button className="button" onClick={() => handlerOnClick()}>SET MONTH</button>
            </div>
            <br/>
            <div>
                {
                    groupedByUser.map(item => bookingCard(item.username, item.arrDates))
                }
            </div>
            
        </div>
    );
}