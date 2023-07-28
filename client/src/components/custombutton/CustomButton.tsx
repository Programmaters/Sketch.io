import './CustomButton.scss'

function CustomButton({ action, label }: { action: () => void; label: string }) {
    return (
        <button className="custom-button" onClick={action}>
            <span>{label}</span>
        </button>
    )
}

export default CustomButton