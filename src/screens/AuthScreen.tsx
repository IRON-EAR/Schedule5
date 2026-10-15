import logo from '../assets/Schedule5.svg'
import '../App.css'
import { useAuth } from '../hooks/Firebase/AuthContext'

type AuthScreenProps = {
    
}

export default function AuthScreen({  }: AuthScreenProps) {

    const {login} = useAuth()

    const handlerOnClick = () => {
        login()
    }

    return (
        <div className='screenDiv'>
            <img src={logo} width={'80%'} />
            <h1>Schedule 5</h1>
            <button className='button' onClick={() => handlerOnClick()}>Sign In with Google</button>
        </div>
    )
}