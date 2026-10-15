import { useEffect, useState } from "react"
import '../App.css'
import DateCard from "./DateCard"
import './Calendar.css'
import { isRegistrarSlot } from "../hooks/isRegistrarSlot"
import { useFirebase } from "../hooks/Firebase/FirebaseContext"
import { useAuth } from "../hooks/Firebase/AuthContext"
import DialogBox from "./DialogBox"
import { saveBookings } from "../hooks/Firebase/saveBookings"

type CalendarProps = {
    activeDate: string
    isEnabled: boolean
}

const daysOfTheWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function Calendar({ activeDate, isEnabled }: CalendarProps) {
    const date = new Date(activeDate)
    const { user } = useAuth()
    const { bookings, refresh } = useFirebase()

    const [newDates, setNewDates] = useState<string[]>([])
    const [oldDates, setOldDates] = useState<string[]>([])
    const [modal, setModal] = useState('NONE')

    const username = user?.displayName ? user?.displayName : 'error'
    const emailAddress = user?.email ? user?.email : 'error'

    const activeMonth = activeDate?.slice(0, 7) ?? '1970-01'
    const getBookingsByUsername = (username: string) =>
        bookings
            .filter((item) => item.username === username && item.date.startsWith(activeMonth))
            .map((item) => item.date);

    useEffect(() => {
        setNewDates(user?.displayName ? getBookingsByUsername(user?.displayName) : [])
        setOldDates(user?.displayName ? getBookingsByUsername(user?.displayName) : [])
    }, [bookings])

    const year = date.getFullYear()
    const month = date.getMonth()
    const offset = date.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const toISO = (day: number) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const isBooked = (checkDate: string) => (
        bookings.some((item) => item.date === checkDate && item.username !== user?.displayName)
    )

    const handlerOnChange = (iso: string) => {
        if (!newDates.includes(iso) && newDates.length < 5) {
            setNewDates(prev => [...prev, iso])
        } else {
            setNewDates(prev => prev.filter(item => item !== iso));
        }
    }

    async function handlerOnSubmit() {
        const newBatch = [...newDates].sort()
        if (newBatch.length < 5) {
            setModal('INSUF')
            return
        }

        const result = await saveBookings(newBatch, oldDates, username, emailAddress, refresh)
        setModal(
            result === 'success' ? 'SUCCESS'
                : result === 'overlap' ? 'OVERLAP'
                    : 'FAILED'
        )
    }

    return (
        <div>
            {modal === 'SUCCESS' && (
                <DialogBox
                    title="Request Submitted"
                    message="Your requested dates have been submitted successfully."
                    onClick={() => setModal('NONE')}
                />
            )}
            {modal === 'OVERLAP' && (
                <DialogBox
                    title="Dates Unavailable"
                    message="One or more of your selected dates have already been booked. Your request was not submitted. Please reload the page and try again."
                    onClick={() => setModal('NONE')}
                />
            )}
            {modal === 'INSUF' && (
                <DialogBox
                    title="Selection Incomplete"
                    message="Five shifts are required to submit your request. Please select additional shifts and try again."
                    onClick={() => setModal('NONE')}
                />
            )}

            <h1 className="calendarTitle">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
            <div className="calendar">
                {daysOfTheWeek.map((value) => (
                    <div key={value} className="calendarSubtitle">{value}</div>
                ))}

                {Array.from({ length: offset }, (_, i) => (
                    <div key={`blank-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                    const iso = toISO(i + 1)
                    return (
                        <DateCard
                            key={iso}
                            date={iso}
                            isBlocked={isRegistrarSlot(iso) || isBooked(iso)}
                            isActive={!!newDates.includes(iso)}
                            onChange={() => isEnabled && handlerOnChange(iso)}
                        />
                    )
                })}
            </div>
            {isEnabled && (
                <section className="shiftCount">*shifts {newDates.length}/5</section>
            )}
            <br />
            {isEnabled &&
                (
                    <div className="buttonBlock">
                        <button className='button' onClick={() => setNewDates([])}>CLEAR SELECTION</button>
                        <button className='button' onClick={() => handlerOnSubmit()}>SUBMIT REQUEST</button>
                    </div>
                )
            }
        </div >
    )
}