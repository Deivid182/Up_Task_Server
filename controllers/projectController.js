import Project from "../models/Project.js";
import User from "../models/User.js";

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const storedProject = await project.save();
    res.json(storedProject);
  } catch (error) {
    console.log(error);
  }
};

const getProjects = async (req, res) => {
  const projects = await Project.find({
    "$or" : [
      {"members": {$in : req.user}},
      {"creator": {$in : req.user}}
    ]
  })
    .select("-tasks");

  return res.json(projects);
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate({path: "tasks", populate: { path: "managed", select: "name" }})
    .populate("members", "name email");

  if (!project) {
    const error = new Error("Project not founded");
    return res.status(404).json({ msg: error.message });
  }


  if (project.creator.toString() !== req.user._id.toString() && !project.members.some(member => member._id.toString() === req.user._id.toString())) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }

  //getting project's tasks

  //const tasks = await Task.find().where("proyecto").equals(project._id)

  res.json(project);
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Project not founded");
    return res.status(404).json({ msg: error.message });
  }

  console.log(project.creator.toString() === req.user._id.toString());

  if (project.creator.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }

  //console.log(req.body)

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deadline = req.body.deadline || project.deadline;
  project.customer = req.body.customer || project.customer;

  try {
    const storedProject = await project.save();
    res.json(storedProject);
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Project not founded");
    return res.status(404).json({ msg: error.message });
  }

  console.log(project.creator.toString() === req.user._id.toString());

  if (project.creator.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }

  try {
    await Project.deleteOne();
    res.json({ msg: "Project Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getMember = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v "
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};

const addMember = async (req, res) => {
  const { email } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }

  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v "
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error(
      "You cannot add yourself as a member for this project"
    );
    return res.status(400).json({ msg: error.message });
  }

  if (project.members.includes(user._id)) {
    const error = new Error("This member has been added before");
    return res.status(400).json({ msg: error.message });
  }

  project.members.push(user._id);
  await project.save();

  res.json({ msg: "Member added successfully" });
};

const deleteMember = async (req, res) => {
  const { email } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({
        msg: "Unauthorized: Access is denied due to invalid credentials",
      });
  }

  project.members.pull(req.body.id);
  await project.save();

  res.json({ msg: "Member removed successfully" });
};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
  getMember,
};
