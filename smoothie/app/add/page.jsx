'use client'
import { useContext } from "react";
import { AppContext } from '../../components/AppContext'
import SmoothieForm from '../../components/SmoothieForm'
import api from "../../api";

export default function AddSmoothie() {
  console.log('add smoothie')
  const {smoothies, setSmoothies} = useContext(AppContext)

  const handleAddSmoothie = async (smoothie) => {
    setSmoothies([...smoothies, smoothie])
    try {
      await api.post('/smoothies', {smoothie})
    } catch (err) {
      console.log(err)
    }
  }
  return(
    <SmoothieForm onSubmit={handleAddSmoothie} smoothie={null} />
  )
}