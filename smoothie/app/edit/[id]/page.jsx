'use client'
import { useContext, useEffect, useState } from "react";
import SmoothieForm from '../../../components/SmoothieForm'
import { AppContext } from '../../../components/AppContext'
import { useParams, useRouter } from "next/navigation";
import api from "../../../api";

export default function EditSmoothie() {
  console.log('edit smoothie')
  const router = useRouter()
  const id = parseInt(useParams().id)
  const { smoothies, setSmoothies } = useContext(AppContext)
  const [smoothie, setSmoothie] = useState({name:'', ingredients:[], id:''})

  const fetchSmoothie= async () => {
    try {
      const {data} =  await api.get(`/${id}`)
      setSmoothie(JSON.parse(data))
    } catch (err) {
      console.log(err)
      router.push('/')
    }
  } 
  useEffect(() => {
    let [editing] = smoothies.filter((s) => s.id == id)
    // get from API if not found
    if (!editing) {
      fetchSmoothie()
    } else {
      setSmoothie(editing)
    }
  }, [])

  const handleEditSmoothie = async (updatedSmoothie) => {
    const updatedSmoothies = smoothies.map((s) => {
      return smoothie.id == s.id ? updatedSmoothie : s
    })
    setSmoothies(updatedSmoothies)
    try {
      await api.patch('/smoothies',{
        smoothie: updatedSmoothie
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <SmoothieForm onSubmit={handleEditSmoothie} smoothie={smoothie} />
  )
}