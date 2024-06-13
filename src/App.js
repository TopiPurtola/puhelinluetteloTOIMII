import { useState , useEffect} from 'react'
import Communication from './communications'


const Phonebook = ({filter, handleFiltering}) => {
  return (
    <div>
    <h1>Phonebook</h1>
      filter with name <input value ={filter} 
        onChange={handleFiltering}></input>
    </div>
  )
}

const New = ({newName,handleChange,newNumber,handleNumber,klikklik}) => {
  return (
    <div>
      <h2>Add a new</h2>
      <form>
        <div>
          name: <input value={newName}
          onChange={handleChange}/>
        </div>
        <div>
          number: <input value = {newNumber}
          onChange={handleNumber}/></div>
        <div>
          <button onClick={klikklik}type="submit">add</button>
        </div>
        </form>
      </div>

  )
}

const Numbers = ({filteredPersons, removePerson}) => {
  return(
  <div>
    <h2>Numbers</h2>
      <div>      
        {filteredPersons.map((person)=> (<p key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person.id, person.name)}>Delete</button></p>))}
      </div>
    </div>
  )
}

const Notification = ({message,staili}) => {
  if (message === null) {
    return null
  }
  return(
    <div style = {staili}>
      {message}
    </div>
  )
}

const App = () => {
  useEffect(() => {
    Communication
    .getAll()
    .then(response =>{
      setPersons(response.data)
    })
  })

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [styles, setStyles] = useState({})

  const klikklik = (event) => {
    event.preventDefault()
    const sameName = persons.some(person => person.name === newName)
    if(sameName){
      setStyles(
        {
          color: 'red',
          background: 'lightgrey',
          fontSize: 20,
          borderStyle: 'solid',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10
    })
      setErrorMessage(newName+ ' is already added!')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  else{
    const newPerson = {name: newName, number: newNumber}
    Communication.
    create(newPerson)
    .then((response) => {
      setPersons(persons.concat(response.data))
      setStyles(
        {
          color: 'green',
          background: 'lightgrey',
          fontSize: 20,
          borderStyle: 'solid',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10
    })
      setErrorMessage(newPerson.name + " was added succesfully!")
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    })
  }
}

const filteredPersons = persons.filter(person => {
  return person.name && person.name.toLowerCase().includes(filterName.toLowerCase());
});


const handleFiltering = (event) =>{
  setFilterName(event.target.value)
}

const handleChange = (event) => {
  setNewName(event.target.value)
}

const handleNumber = (event) => {
  setNewNumber(event.target.value)}

const removePerson = (id, name) => {
  console.log("poista")
  if(window.confirm("Are you sure you want to delete "+ name)){
    Communication
    .remove(id)
    .then(() =>{
      setPersons(persons.filter(person => person.id != id))
      setStyles(
        {
          color: 'green',
          background: 'lightgrey',
          fontSize: 20,
          borderStyle: 'solid',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10
    })
      setErrorMessage(name + " was deleted successfully!")
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    })
  }
}

return (
    <div>
      <Phonebook filter = {filterName}
      handleFiltering = {handleFiltering}/>
      <Notification message={errorMessage} staili={styles}/>
      <New newName = {newName}
      handleChange = {handleChange}
      newNumber = {newNumber}
      handleNumber = {handleNumber}
      klikklik = {klikklik}
      />
      <Numbers filteredPersons = {filteredPersons} removePerson={removePerson}/>
    </div>  
  )
}

export default App
