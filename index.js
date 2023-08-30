import express from "express"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import cors from "cors"


const app = express()
app.use(express.json({ limit: "50mb" }))
app.use(cors())

dotenv.config()

connectDB()

app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

const port = process.env.PORT || 5000

const server = app.listen(port, () => {
  console.log("Server on port " + port)
})

import { Server } from "socket.io"

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*"   
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  //events
  socket.on("OpenProject", (project) => {
    socket.join(project)
  })

  socket.on("new task", (task) => {
    
    const project = task.project

    socket.to(project).emit("added task", task)
  })

  socket.on("delete task", task => {
    const project = task.project
    socket.to(project).emit("task deleted", task)
  })

  socket.on("update task", task => {
    const project = task.project._id
    socket.to(project).emit("task updated", task)
  })

  socket.on("change state", task => {
    const project = task.project._id
    socket.to(project).emit("new state", task)
  })
})