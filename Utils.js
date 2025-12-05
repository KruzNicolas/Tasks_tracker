const Utils = {
  CleanTask(task) {
    return {
      id: task.id,
      title: task.content,
      description: task.description,
      link: task.url || "https://todoist.com/showTask?id=" + task.id,
      date: task.created_at || task.added_at,
      priority: task.priority,
    };
  },

  ClearAnswer(rawJson) {
    let toDoList = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;

    if (!Array.isArray(toDoList)) return [];
    return toDoList.map((task) => this.CleanTask(task));
  },
};
