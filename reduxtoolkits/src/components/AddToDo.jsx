import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../features/todo/todoSlice'

function AddTodo() {
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const addTodoHandler = (e) => {
    e.preventDefault()
    if (input.trim()) {
      dispatch(addTodo(input))
      setInput('')
    }
  }

  return (
    <form onSubmit={addTodoHandler} className="flex flex-col items-center space-y-4 mt-12 mx-auto max-w-md">
      <input
        type="text"
        className="w-full bg-gray-800 rounded-md border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 text-base outline-none text-gray-100 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="Enter a new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="w-full text-white bg-indigo-500 border-0 py-2 px-6 rounded-md text-lg focus:outline-none hover:bg-indigo-600 transition-colors duration-200 ease-in-out"
      >
        Add Task
      </button>
    </form>
  )
}

export default AddTodo
