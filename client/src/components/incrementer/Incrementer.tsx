import { useState } from 'react';
import './Incrementer.scss';

function Incrementer({ label, unit = "" }){
    const [count, setCount] = useState(0)

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if(count > 0){
            setCount(count - 1);
        }
    };
    return(
        <div className="incrementer-container">
            <div className="incrementer-label">
                {label}
            </div>
            <div className="incrementer-counter">
                <div className="incrementer-decrement">
                    <svg onClick={handleDecrement} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M0 10C0 15.51 4.49 20 10 20C15.51 20 20 15.51 20 10C20 4.49 15.51 0 10 0C4.49 0 0 4.49 0 10ZM11.79 5.94C11.94 6.09 12.01 6.28 12.01 6.47C12.01 6.66 11.94 6.85 11.79 7L8.79 10L11.79 13C12.08 13.29 12.08 13.77 11.79 14.06C11.6489 14.1995 11.4584 14.2777 11.26 14.2777C11.0616 14.2777 10.8711 14.1995 10.73 14.06L7.2 10.53C6.91 10.24 6.91 9.76 7.2 9.47L10.73 5.94C11.03 5.65 11.5 5.65 11.79 5.94Z" fill="black"/>
                    </svg>
                </div>
                <div className="incrementer-count">
                    <a> {count}{unit}</a>
                </div>
                <div className="incrementer-increment">
                <svg onClick={handleIncrement} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 10C20 4.49 15.51 0 10 0C4.49 0 0 4.49 0 10C0 15.51 4.49 20 10 20C15.51 20 20 15.51 20 10ZM8.21 14.06C8.06 13.91 7.99 13.72 7.99 13.53C7.99 13.34 8.06 13.15 8.21 13L11.21 10L8.21 7C7.92 6.71 7.92 6.23 8.21 5.94C8.35114 5.80052 8.54157 5.7223 8.74 5.7223C8.93843 5.7223 9.12886 5.80052 9.27 5.94L12.8 9.47C13.09 9.76 13.09 10.24 12.8 10.53L9.27 14.06C8.97 14.35 8.5 14.35 8.21 14.06Z" fill="black"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Incrementer