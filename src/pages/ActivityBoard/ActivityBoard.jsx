import {
  Box, Container, Grid
} from "@mui/material";
import AddTask from "./AddTask";
import KanbanCard from "./KanbanCard";

import React, { useState } from "react";
import { taskData } from "./taskdata";
//Icons



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

const kanbanCardTypes = ["To Do", "In-Progress", "Done"];

function ActivityBoard() {
  const [tasks, setTasks] = useState(taskData);

  return (
    <Box sx={{ backgroundColor: "#3f51b5", height: "100vh", p: 1 }}>
      <Container>
        <AddTask tasks={tasks} setTasks={setTasks} />
        <Box display={"flex"} p={1}>
          <Grid container spacing={2}>
            {kanbanCardTypes.map((v, i) => (
              <Grid item xs={4} key={i}>
                <Box
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, tasks, setTasks, v)}
                >
                  <KanbanCard type={v} tasks={tasks} setTasks={setTasks} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default ActivityBoard;


