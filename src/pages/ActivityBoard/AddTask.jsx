import {
  Box,
  Button,
  Checkbox, IconButton, MenuItem, Select,
  TextField,
  Typography
} from "@mui/material";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AddTask = ({ tasks, setTasks }) => {
  const LabelList = [
    {color:"red",name:"red",id:1},
    {color:"yellow",name:"yellow",id:2},
    {color:"pink",name:"pink",id:3},
    {color:"cyan",name:"cyan",id:4},
  ]
  const [taskDetails, setTaskDetails] = useState({ name: "", desc: "" });
  const [selectedLable, setSelectedLablel] = useState(1);
  const [priorityDetails, setPriorityDetails] = useState("p1");
  const [isHot, setHot] = useState(false);
  


  const handelAddTask = () => {
    if (!taskDetails?.name || !taskDetails?.desc) {
      alert("Enter Task Details");
    } else {

      let ff = [
        ...tasks,
        {
          id: uuidv4(),
          name: taskDetails?.name,
          desc: taskDetails?.desc,
          status: "To Do",
        },
      ];
      console.log(ff, isHot, selectedLable, priorityDetails);
      setTasks([
        ...tasks,
        {
          id: uuidv4(),
          name: taskDetails?.name,
          desc: taskDetails?.desc,
          status: "To Do",
          hot: isHot,
          priority: priorityDetails,
          label_color: LabelList?.find((e) => e.id === selectedLable)?.color,
        },
      ]);
    }
  };

  const ColorLabelsStyle = ({
    color,
    selectedLable,
    setSelectedLablel,
    index,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: selectedLable === index && "#e7e7e7",
          height: 30,
          width: 30,
          p: 1,
          m: 1,
          borderRadius: selectedLable === index && "50%",
        }}
      >
        <IconButton onClick={(e) => setSelectedLablel(index)}>
          <Box
            sx={{
              backgroundColor: color,
              height: 20,
              width: 20,
              borderRadius: "50%",
            }}
          ></Box>
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#FFF", p: 2, borderRadius: 5 }}>
      <Box display="flex" justifyContent={"space-around"} alignItems={"center"}>
        <Typography align="center">Add Task</Typography>
        <TextField
          size="small"
          sx={{ ml: 5 }}
          placeholder="Task"
          value={taskDetails?.name}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, name: e.target.value });
          }}
        />
        <TextField
          size="small"
          sx={{ ml: 5 }}
          placeholder="Description"
          value={taskDetails?.desc}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, desc: e.target.value });
          }}
        />
        <Button
          variant="contained"
          onClick={handelAddTask}
          sx={{ ml: 5, width: 150 }}
        >
          Add
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent={"space-evenly"}
        alignItems={"center"}
        m={1}
      >
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography>Hot</Typography>
          <Checkbox
            checked={isHot}
            onChange={(e) => {
              setHot(e?.target?.checked);
            }}
          />
        </Box>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography mr={2}>Priority</Typography>
          <Select
            size="small"
            value={priorityDetails}
            onChange={(e) => setPriorityDetails(e.target.value)}
          >
            <MenuItem value="p1">P1</MenuItem>
            <MenuItem value="p2">P2</MenuItem>
            <MenuItem value="p3">P3</MenuItem>
          </Select>
        </Box>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography mr={2}>Label</Typography>
          <Box
            display="flex"
            justifyContent={"space-evenly"}
            alignItems="center"
          >
            {LabelList?.map((c, i) => (
              <ColorLabelsStyle
                index={c?.id}
                color={c?.color}
                selectedLable={selectedLable}
                setSelectedLablel={setSelectedLablel}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTask;
