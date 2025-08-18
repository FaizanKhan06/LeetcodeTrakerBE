import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./db"
import problemRoutes from "./routes/problems"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/problems", problemRoutes)

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})
