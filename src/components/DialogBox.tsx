import './DialogBox.css'

type DialogBoxProps = {
    title: string
    message: string  
    onClick: () => void 
}

export default function DialogBox({title, message, onClick}: DialogBoxProps) {
    return (
        <dialog open>
            <h1>{title}</h1>
            <p>{message}</p>
            <button onClick={() => onClick()}>CLOSE</button>
        </dialog>        
    )
}