import {
  Box, Divider, Paper, Typography
} from "@mui/material";

import React from "react";
import Task from "./Task";

//Styles
const todoStyles = { backgroundColor: "#673ab769" };
const inProgressStyles = { backgroundColor: "#ffa50073" };
const doneStyles = { backgroundColor: "#8bc34a80" };

const KanbanCard = ({ type, tasks, setTasks }) => {
  const cardStyles =
    type === "To Do"
      ? todoStyles
      : type === "In-Progress"
      ? inProgressStyles
      : doneStyles;

  const handleDrop = (event, tasks, setTasks, targetType) => {
    event.preventDefault();
    const droppedTask = event.dataTransfer.getData("task");
    const droppedTaskId = event.dataTransfer.getData("id");
    const droppedStatus = event.dataTransfer.getData("status");

    // Find the dropped task
    const updatedTasks = tasks.map((task) => {
      if (task?.id === droppedTaskId) {
        return { ...task, status: targetType };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  return (
    <Paper
      sx={{ border: "1px dashed #FFF", minHeight: 500, overflow: "auto" }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, tasks, setTasks, type)}
    >
      <Typography
        align="center"
        sx={{
          color: "#3c3c3c",
          fontWeight: 800,
          p: 1,
          ...cardStyles,
        }}
      >
        {type}
      </Typography>
      <Divider />
      <Box mt={1}>
        {tasks.filter((task) => task.status === type).length > 0 ? (
          tasks
            .filter((task) => task.status === type)
            .map((task, index) => (
              <Task
                key={index}
                name={task.name}
                type={type}
                t={task}
                tasks={tasks}
                setTasks={setTasks}
              />
            ))
        ) : (
          <Typography align="center">No Task Found</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default KanbanCard;
