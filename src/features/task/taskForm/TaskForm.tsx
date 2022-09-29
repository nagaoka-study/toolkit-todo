import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import {
  fetchTasks,
  createTask,
  editTask,
  handleModalOpen,
  selectSelectedTask,
} from "../taskSlice";
import { AppDispatch } from "../../../app/store";
import styles from "./TaskForm.module.scss";

type Inputs = {
  taskTitle: string;
};

type PropTypes = {
  edit?: boolean;
};

const TaskForm: React.FC<PropTypes> = ({ edit }) => {
  const dispatch: AppDispatch = useDispatch();
  const selectedTask = useSelector(selectSelectedTask);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const handleCreate = async (data: Inputs) => {
    await createTask(data.taskTitle);
    reset();
    dispatch(fetchTasks());
  };
  const handleEdit = async (data: Inputs) => {
    const sendData = { ...selectedTask, title: data.taskTitle };
    await editTask(sendData);
    dispatch(handleModalOpen(false));
  };
  return (
    <div className={styles.root}>
      <form
        onSubmit={edit ? handleSubmit(handleEdit) : handleSubmit(handleCreate)}
        className={styles.form}
      >
        <TextField
          id="outlined-basic"
          label={edit ? "Edit Task" : "New Task"}
          defaultValue={edit ? selectedTask.title : ""}
          variant="outlined"
          {...register("taskTitle")}
          name="taskTitle"
          className={styles.text_field}
        />
        {edit ? (
          <div className={styles.button_wrapper}>
            <button type="submit" className={styles.submit_button}>
              Submit
            </button>
            <button
              type="button"
              onClick={() => dispatch(handleModalOpen(false))}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default TaskForm;
