'use client'
import SmoothieList from '../components/SmoothieList';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import api from '../api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  const handleNavigate = () => {
    router.push('/add')
  }

  const clearData = () => {
    try {
      api.delete('/clearall')
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <header>
        <h1>
          <Row>
            <Col>
              Smoothie Maker
            </Col>
            <Col sm={1}>
              <Button variant="light" onClick={() => clearData()} className='text-white' size='sm'>Clear Data</Button>
            </Col>
          </Row>
        </h1>
      </header>
      <Row>
        <Col sm={8}>
          <Button variant='primary' onClick={handleNavigate}>Create New Smoothie</Button>
        </Col>
      </Row>
      <div>
        <SmoothieList />
      </div>
    </div>
  );
}