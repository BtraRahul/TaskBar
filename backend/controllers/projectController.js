import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const projects = await Project.find({ email });
    res.status(200).send(projects);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createProject = async (req, res) => {
  const { name, description, deadline, email, tasks } = req.body;
  try {
    const project = new Project({ name, description, deadline, email, tasks });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTaskToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.tasks.push(req.body);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Tasks
export const updateTaskStatus = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { newStatus } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    task.status = newStatus;
    await project.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.tasks.id(taskId).remove();
    await project.save();

    res.json({ message: "Task deleted", taskId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/*

export default function ProjectController() {
  const [color, setCOlor] = useState("white")

  const getColor = (color) =>{
    setColor(color)
  }

  return(
  <ChildComp getColor={getColor} />
  )
}

  export default function ChildComp({getColor}) {
  return (
    <input type="color" onChange={(e) => getColor(e.target.value)} />
  )
  }
*/
