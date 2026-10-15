import AdminBlock from "../components/AdminBlock"
import Calendar from "../components/Calendar"
import { useAuth } from "../hooks/Firebase/AuthContext"
import { useFirebase } from "../hooks/Firebase/FirebaseContext"

type BookingScreenProps = {
}

export default function BookingScreen({ }: BookingScreenProps) {
    const { user, logout } = useAuth()
    const { settings, adminList } = useFirebase()

    const activeDate = settings?.find((item: any) => item.config === 'activeDate')?.value?.value

    const handlerOnClick = () => {
        logout()
    }

    const isAdmin = user?.email ? adminList.includes(user.email) : false

    return (
        <div>
            <div className="header">
                <span className="userText">
                    {user?.displayName}
                    {isAdmin && <span className="admin-badge">Admin</span>}
                </span>
                <button className="buttonSignout" onClick={() => handlerOnClick()} >Sign Out</button>
            </div>

            <Calendar
                activeDate={activeDate}
                isEnabled={!isAdmin}
            />
            {isAdmin && <AdminBlock />}
        </div>
    )
}