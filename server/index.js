const express = require('express');
const redis = require('redis');
const cors = require('cors');
const next = require('next')
const path = require('path')

const PORT = process.env.PORT || 4000;

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev , dir: path.join(__dirname, "../smoothie") });
const handle = nextApp.getRequestHandler();

const redis_url= process.env.REDIS_URL || "redis://localhost:6379"    
const client = redis.createClient({
  url: redis_url,
  socket: {
    tls: (redis_url.match(/rediss:/) != null),
    rejectUnauthorized: false,
  }
});
client.on('connect', () => {
  console.log('Connected to Redis');
});
client.on('error', (err) => {
    console.error('Redis error: ', err);
});
client.connect()

nextApp.prepare().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json())

  const initialList = ['Blueberries', 'Soy Milk', 'Strawberry', 'Ginger', 'Carrot', 'Nut Cheese']
  // default setter
  async function setIngredientDefaults() {
    console.log('setIngredientDefaults')
    try {
      await client.RPUSH('ingredients', initialList)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  app.get('/api/smoothies', async (req, res) => {
    console.log('GET smoothies')
    try {
      const result = await client.LRANGE('smoothies',0,-1) || []
      console.log(result)
      return res.status(200).json(result)
    } catch (err) {
      console.log('get error', err)
      return res.status(500).send(err)
    }
  });

  app.post('/api/smoothies', async (req, res) => {
    console.log('POST smoothies')
    console.log(req.body)
    const {smoothie} = req.body
    console.log(smoothie)
    try {
      await client.RPUSH('smoothies',JSON.stringify(smoothie))
      return res.status(200).send('OK')
    } catch (err) {
      return res.status(500).send(err)
    }
  })

  app.patch('/api/smoothies', async (req, res) => {
    const {smoothie } = req.body
    console.log('PATCH smoothies')
    try {
      const list = await client.LRANGE('smoothies',0,-1)
      list.map(async (s,index) => {
        if (s.id === smoothie.id) {
          await client.LSET('smoothies',index, JSON.stringify(smoothie))
          return res.status(200).send('OK')
        }
      })
    } catch (err) {
      return res.status(500).send(err)
    }
  })

  app.get('/api/ingredients', async (req,res) => {
    console.log('GET ingredients')
    try {
      const ingredients = await client.LRANGE('ingredients',0,-1)
      console.log('got ingredients', ingredients)
      if (!ingredients.length) {
        setIngredientDefaults()
        return res.status(200).json(initialList)
      } else {
        return res.status(200).json(ingredients)
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  })

  app.post('/api/ingredients', async (req,res) => {
    const {ingredient} = req.body
    console.log('POST ingredients')
    try {
      await client.RPUSH('ingredients', ingredient)
      return res.status(200).send('OK')
    } catch(err) {
      return res.status(500).send(err)
    }
  })

  app.delete('/api/clearall', async (req,res) => {
    console.log('GET clearall')
    try {
      await client.del('smoothies')
      await client.del('ingredients')
      return res.status(200).send('OK')
    }  catch (err) {
      return res.status(500).send(err)
    }
  })

  app.delete('/api/:id', async (req,res) => {
    const {id} = req.params
    console.log('DELETE id',id)
    try {
      const list = await client.LRANGE('smoothies',0,-1)
      list.map(async (s,index) => {
        const smoothie = JSON.parse(s)
        if (smoothie.id === parseInt(id)) {
          await client.LSET('smoothies',index,'DELETE')
          await client.LREM('smoothies',1,'DELETE')
          console.log('finished deleting')
          return res.status(200).send('OK')
        }
      })
    } catch(err) {
      return res.status(500).send(err)
    }
  })

  app.get('/api/:id', async (req, res) => {
    const {id} = req.params
    console.log('GET id',id)
    try {
      const smoothies = await client.LRANGE('smoothies',0,-1)
      const [result] = smoothies.filter((smoothie) => JSON.parse(smoothie).id === parseInt(id) )
      res.status(200).json(result)
    } catch(err) {
      // throw err
      res.status(500).send(err)
    }
  })

  app.all("*", (req, res) => handle(req, res));

  app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
  });
});