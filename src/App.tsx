import './App.css'
import BookingScreen from './screens/BookingScreen'
import AuthScreen from './screens/AuthScreen'
import { useAuth } from './hooks/Firebase/AuthContext'

function App() {
  const {user} = useAuth()

  return (
    <div className='main'>
      {user ? <BookingScreen/> : <AuthScreen/>}
    </div>
  )
}

export default App
