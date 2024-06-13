import axios from "axios"
const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
  return axios.get(baseURL)
}

const create = (newPerson) => {
  return axios.post(baseURL, newPerson)
}

const remove = (id) => {
  return axios.delete(baseURL + "/" +id)
}
export default {getAll, create, remove}