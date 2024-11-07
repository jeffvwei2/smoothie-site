'use client'
import { createContext, useState, useEffect, useMemo } from 'react';
import api from '../api'

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [smoothies, setSmoothies] = useState([]);
  const [available, setAvailable] = useState([])

  useEffect(() => {
    async function fetchSmoothies() {
      try {
        const {data} =  await api.get('/smoothies')
        const mapped =  data.map((s) => JSON.parse(s))
        setSmoothies(mapped)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSmoothies()
  }, [])

  useEffect(() => {
    async function fetchAvailable() {
        try {
            const { data } = await api.get('/ingredients')
            setAvailable(data)
        } catch (err) {
            console.log(err)
        }
    }
    fetchAvailable()
}, [])


  const values = useMemo(() => ({
    smoothies,
    setSmoothies,
    // handleDeleteSmoothie,
    available,
    setAvailable
  }),[smoothies, available])

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
}
