import React, {useEffect, useState} from "react";

type TimerProps = { seconds : number }

function Timer({seconds}: TimerProps) {
  const [time, setTime] = useState(seconds)

  useEffect(() => {
    const iid = setInterval(() => {
      if (time <= 0) {
        clearInterval(iid)
        return
      }
      setTime(prev => prev - 1)
    }, 1000)
    return () => clearInterval(iid)
  }, [time])

  useEffect(() => setTime(seconds), [seconds])

  return (
    <div>
      {time}
    </div>
  )
}

export default Timer;