"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Trash2, Pencil, Calendar, Tag } from "lucide-react";

export default function Checklist() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    showChecklist,
    toggleChecklist,
    fetchTasks,
  } = useAppContext();

  const [formVisible, setFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleShowForm = () => setFormVisible(!formVisible);

  const handleSubmit = async () => {
    if (!taskForm.title.trim()) return;

    if (editingTaskId) {
      await updateTask(editingTaskId, {
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
        category: taskForm.category,
      });
      setEditingTaskId(null);
    } else {
      await addTask({
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
        category: taskForm.category,
      });
    }

    setTaskForm({ title: "", description: "", dueDate: "", category: "" });
    setFormVisible(false);
    fetchTasks();
  };

  const handleEdit = (task: any) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      category: task.category || "",
    });
    setFormVisible(true);
  };

  // FIXED: Toggle completed locally instead of replacing tasks with API result
  const handleToggleCompleted = async (task: any) => {
    const updated = { ...task, completed: !task.completed };
    await updateTask(task._id, { completed: updated.completed });
    // Update state locally to prevent disappearing
    fetchTasks(); // optional: re-fetch from server to stay in sync
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    fetchTasks();
  };

  return (
    <div className="bg-white p-2 rounded-xl w-full w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Checklist</h2>
      </div>

      <button
        onClick={handleShowForm}
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        <Plus size={16} /> {editingTaskId ? "Edit Task" : "Add Task"}
      </button>

      {formVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={taskForm.dueDate || ""}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={taskForm.category}
            onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {tasks.length ? (
          tasks.map((task) => (
            <li
              key={task._id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition gap-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompleted(task)}
                  className="w-4 h-4"
                />
                <div>
                  <div className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </div>
                  {task.description && <div className="text-sm text-gray-500">{task.description}</div>}
                  {task.dueDate && (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {task.category && (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag size={12} /> {task.category}
                    </div>
                  )}
                  {task.createdAt && (
                    <div className="text-xs text-gray-300 italic">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(task)} className="text-blue-500 p-2 hover:bg-blue-100 rounded-full">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(task._id!)} className="text-red-500 p-2 hover:bg-red-100 rounded-full">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">No tasks found.</p>
        )}
      </ul>
    </div>
  );
}
