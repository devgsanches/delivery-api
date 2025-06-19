import { app } from '@/express/app'

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`)
})