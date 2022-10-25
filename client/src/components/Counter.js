import React from 'react'

const Counter = ({ counter, setCounter, limit=15, start=1 }) => {

  const increase = () => {
    if (counter < limit) {
      setCounter((count) => count + 1)
    }
  }
  const decrease = () => {
    if (counter > start) {
      setCounter((count) => count - 1)
    }
  }

  return (
    <div className='counter'>
      <button onClick={decrease}>-</button>
      <p>{counter}</p>
      <button onClick={increase}>+</button>
    </div>
  )
}

export default Counter
