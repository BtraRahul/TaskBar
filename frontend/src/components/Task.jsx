
const Task = ({ task, toggleTaskCompletion, deleteTask }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
      <p>
        Completed: {task.completed ? 'Yes' : 'No'}
        <button onClick={() => toggleTaskCompletion(task._id, !task.completed)}>
          {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
      </p>
      <button onClick={() => deleteTask(task._id)}>Delete Task</button>
    </li>
  );
};

export default Task;
