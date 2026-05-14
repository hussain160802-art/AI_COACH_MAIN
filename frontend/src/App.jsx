import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Assessment from './Assessment'
import Home from './Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Assessment/>
      {/* <Home/> */}
    </>
  )
}

export default App
