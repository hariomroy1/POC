import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Todos from './components/ToDo'
import AddToDo from './components/AddToDo'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <h1>Learn about redux tool kit</h1>
   <AddToDo/>
   <Todos/>
   </>
  )
}

export default App
