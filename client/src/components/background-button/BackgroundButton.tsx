function BackgroundButton({image = "", label = "", onclick,  } : {image?: string, label?: string, onclick: () => void}) {
    return (
        <button className="background-button" onClick={onclick}>
            <img src={image} alt={label}/>
            <span>{label}</span>
        </button>
    )
}


export default BackgroundButton