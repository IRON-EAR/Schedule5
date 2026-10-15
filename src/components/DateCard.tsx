import Holidays from 'date-holidays'
import './DateCard.css'

type ButtonDateProps = {
    date: string
    isActive: boolean
    isBlocked: boolean
    onChange?: () => void
}

export default function DateCard({ date, isActive, isBlocked, onChange }: ButtonDateProps) {

    const activeDate = new Date(date)
    const holidays = new Holidays('za')
    const isHoliday = [0, 6].includes(activeDate.getDay()) || !!holidays.isHoliday(activeDate)

    const handlerClick = () => {
        if (!isBlocked) {
            onChange?.()
        }
    }

    return (
        <div className={`dateCard ${isBlocked ? 'dateCardBlocked' : isActive && 'dateCardActive'} `}onClick={() => handlerClick()}>
            <section className={isHoliday ? 'dateTextHoliday' : isBlocked ? 'dateTextBlocked' : ''}>{activeDate.getDate()}</section>
        </div>
    )
}
