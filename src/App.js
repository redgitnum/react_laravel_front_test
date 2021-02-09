import React, {useState, useEffect} from 'react'
import Pusher from 'pusher-js'
import axios from 'axios'


function App() {

  const initialState = {
    name: '',
    surname: '',
    age: ''
  }

  const [person, setPerson] = useState(initialState)

  const [people, setPeople] = useState(0)

  useEffect(() => {
    subscribe();
    initialize();
  }, [])
  
  const subscribe = () => {
    let pusher = new Pusher('ca2cb0ed6157c97ed49b', { cluster: 'eu' })
    let channel = pusher.subscribe('new-data')
    channel.bind('new-data-event', data => {
        setPeople(data.people)
    });
  }

  const resetForm = () => {
    setPerson(initialState)
  }

  const initialize = async () => {
    setPeople(
      await axios
        .get('http://127.0.0.1:8000/api')
        .then(response => response.data)            
    )
  }

  const handleChange = e => {
    const {name, value} = e.target;

    setPerson(prev => ({
      ...prev,
      [name]: value
    })
  )}

  const addPerson = (e) => {
    e.preventDefault();
    axios
      .post('http://127.0.0.1:8000/api/add', person)
      .then(response => response.data)
      .then(console.log)
      .finally(() => {
          resetForm();
          document.getElementById('name').focus();
      })
  }
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen justify-center items-center">
      <h1 className="text-2xl text-indigo-700 font-bold pb-4">
      Add random people app
      </h1>          
      <button >CLICK ME</button>
      <div className="p-4 m-2 bg-blue-300 rounded shadow-lg">
        <form onSubmit={addPerson}>
            <div className="flex flex-col justify-center">
              <label htmlFor="name" className="p-2 flex justify-between items-center">Name: 
                  <input type="text" name="name" className="ml-2 p-2" onChange={handleChange} required id='name' value={person.name} />
              </label>
              <label htmlFor="surname" className="p-2 flex justify-between items-center">Surname: 
                  <input type="text" name="surname" className="ml-2 p-2" onChange={handleChange} required value={person.surname} />
              </label>
              <label htmlFor="age" className="p-2 flex justify-between items-center">Age: 
                  <input type="number" name="age" className="ml-2 p-2" onChange={handleChange} required value={person.age} />
              </label>
              <button className="p-2 bg-green-300 shadow rounded">Add Person</button>
            </div>
        </form>
      </div>
      <div className="flex flex-col bg-white p-3 shadow-lg rounded">
        <div className="grid grid-cols-4 gap-3 bg-gray-500 text-white p-2 place-items-center">
            <div>Name</div>
            <div>Surname</div>
            <div>Age</div>
            <div>Action</div>
        </div>
        <div className="max-h-72 overflow-auto">
            <div className="grid grid-cols-4 gap-3 p-2 place-items-center">
                <div>age</div>
                <div>name</div>
                <div>surname</div>
                <div className="flex justify-center items-center">
                    <button 
                    className="p-2 ml-6 rounded bg-red-500 hover:bg-red-300 hover:text-black active:bg-red-400 transition text-white whitespace-nowrap">
                        DELETE ME
                    </button>
                    <div className="loader invisible inline-block p-1"></div>
                </div>
            </div>
        </div>
      </div>
  </div>
  )
}

export default App;
