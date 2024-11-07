const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Redis
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost', 
    port: process.env.REDIS_PORT || 6379,        
});
client.connect()

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
}));
app.use(express.json());

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

app.get('/smoothies', async (req, res) => {
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

app.post('/smoothies', async (req, res) => {
  const {smoothie} = req.body
  console.log('POST smoothies')
  console.log(smoothie)
  try {
    await client.RPUSH('smoothies',JSON.stringify(smoothie))
    return res.status(200).send('OK')
  } catch (err) {
    return res.status(500).send(err)
  }
})

app.patch('/smoothies', async (req, res) => {
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

app.get('/ingredients', async (req,res) => {
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

app.post('/ingredients', async (req,res) => {
  const {ingredient} = req.body
  console.log('POST ingredients')
  try {
    await client.RPUSH('ingredients', ingredient)
    return res.status(200).send('OK')
  } catch(err) {
    return res.status(500).send(err)
  }
})

app.delete('/clearall', async (req,res) => {
  console.log('GET clearall')
  try {
    await client.del('smoothies')
    await client.del('ingredients')
    return res.status(200).send('OK')
  }  catch (err) {
    return res.status(500).send(err)
  }
})

app.delete('/:id', async (req,res) => {
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

app.get('/:id', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
