'use client'
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../components/AppContext'
import { useParams, useRouter } from "next/navigation";
import api from "../../api";
import SmoothieCard from '../../components/SmoothieCard'
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

export default function ShowSmoothie() {
  const router = useRouter()
  const id = parseInt(useParams().id)
  const { smoothies } = useContext(AppContext)
  const [smoothie, setSmoothie] = useState({ name: '', ingredients: [], id: '' })

  const fetchSmoothie = async () => {
    try {
      const { data } = await api.get(`/${id}`)
      setSmoothie(JSON.parse(data))
    } catch (err) {
      console.log(err)
      router.push('/')
    }
  }

  const handleNavigate = () => {
    router.push('/')
  }

  useEffect(() => {
    let [thisSmoothie] = smoothies.filter((s) => s.id == id)
    // get from API if not found
    if (!thisSmoothie) {
      fetchSmoothie()
    } else {
      setSmoothie(thisSmoothie)
    }
  }, [])

  return (
    <div className="m-2">
      <Row>
        <Col sm={6}>
          <Button variant="primary" onClick={handleNavigate}>Back</Button>
        </Col>
      </Row>
      <SmoothieCard smoothie={smoothie} list={false} />
    </div>
  )
}