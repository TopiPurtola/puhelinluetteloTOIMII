import axios from 'axios'

const promise = axios.get('http://localhost:5173/api/persons')
console.log(promise)

const promise2 = axios.get('http://localhost:5173/api/persons')
console.log(promise2)