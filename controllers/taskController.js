import Task from "../models/Task.js"
import Project from "../models/Project.js"

export const addTask = async (req, res) => {
  const { project } = req.body

  const thereIsProject = await Project.findById(project) 

  //console.log(thereIsProject)

  if(!thereIsProject) {
    const error = new Error("Project not found")
    res.status(404).json({msg: error.message})
  }

  if(thereIsProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Unauthorized: Access is denied due to invalid credentials.")
    res.status(403).json({msg: error.message})
  }

  try {
    const storedTask = await Task.create(req.body)

    thereIsProject.tasks.push(storedTask._id)
    
    await thereIsProject.save()
    return res.json(storedTask) 
  } catch (error) {
    console.log(error)
  }

}
export const getTask = async(req, res) => {
  const { id } = req.params
  const task = await Task.findById(id).populate("project")

  if(!task) {
    const error = new Error("Task not found")
    return res.status(404).json({msg: error.message})
  }

  if(task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Unauthorized: Access is denied due to invalid credentials.")
    return res.status(403).json({msg: error.message})
  }

  res.json(task)

}
export const updateTask = async (req, res) => {
  const { id } = req.params

  const task = await Task.findById(id).populate("project")

  console.log(task)

  if(!task) {
    const error = new Error("Task not found")
    return res.status(404).json({msg: error.message})
  }

  if(task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Unauthorized: Access is denied due to invalid credentials.")
    return res.status(403).json({msg: error.message})
  }


  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.deadline = req.body.deadline || task.deadline

  try {
    
    const storedTask = await task.save()
    res.json(storedTask)

  } catch (error) {
    console.log(error)
  } 

}
export const deleteTask = async (req, res) => {
  const { id } = req.params

  const task = await Task.findById(id).populate("project")

  if(!task) {
    const error = new Error("Task not found")
    return res.status(404).json({msg: error.message})
  }

  if(task.project.creator.toString() !== req.user._id.toString()){
    const error = new Error("Unauthorized: Access is denied due to invalid credentials.")
    return res.status(403).json({msg: error.message})
  }

  try {
    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)

    await Promise.allSettled([
      await project.save(),
      await task.deleteOne()
    ])


    res.json({msg: "Task deleted"})
  } catch (error) {
    console.log(error)
  }

}
export const changeState = async (req, res) => {
  
  const { id } = req.params

  const task = await Task.findById(id).populate("project")

  if(!task) {
    const error = new Error("Task not found")
    return res.status(404).json({msg: error.message})
  }

  if (task.project.creator.toString() !== req.user._id.toString() && !task.project.members.some(member => member._id.toString() === req.user._id.toString())) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }
  task.completed = !task.completed
  task.managed = req.user._id

  await task.save()

  const taskStored = await Task.findById(id).populate("project").populate("managed")

  res.json(taskStored)
}