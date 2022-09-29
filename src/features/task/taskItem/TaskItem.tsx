import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "@material-ui/core/Modal";
import EventNoteIcon from "@material-ui/icons/EventNote";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  fetchTasks,
  deleteTask,
  selectTask,
  handleModalOpen,
  selectIsModalOpen,
  editTask,
} from "../taskSlice";
import { AppDispatch } from "../../../app/store";
import TaskForm from "../taskForm/TaskForm";
import styles from "./TaskItem.module.scss";

interface PropTypes {
  task: { id: string; title: string; completed: boolean };
}
const TaskItem: React.FC<PropTypes> = ({ task }) => {
  const isModalOpen = useSelector(selectIsModalOpen);
  const dispatch: AppDispatch = useDispatch();
  const handleOpen = () => {
    dispatch(selectTask(task));
    dispatch(handleModalOpen(true));
  };
  const handleClose = () => {
    dispatch(handleModalOpen(false));
  };
  const handleEdit = async (id: string, title: string, completed: boolean) => {
    const sendData = { id, title, completed: !completed };
    await editTask(sendData);
    dispatch(fetchTasks());
  };
  const handleDelete = async (id: string) => {
    await deleteTask(id);
    dispatch(fetchTasks());
  };
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <EventNoteIcon />
        <div className={styles.title_text}>{task.title}</div>
      </div>
      <div className={styles.right_item}>
        <Checkbox
          checked={task.completed}
          onClick={() => handleEdit(task.id, task.title, task.completed)}
          className={styles.checkbox}
        />
        <button onClick={handleOpen} className={styles.edit_button}>
          <EditIcon className={styles.icon} />
        </button>
        <button
          onClick={() => handleDelete(task.id)}
          className={styles.delete_button}
        >
          <DeleteIcon className={styles.icon} />
        </button>
      </div>
      <Modal open={isModalOpen} onClose={handleClose} className={styles.modal}>
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>Edit</div>
          <TaskForm edit />
        </div>
      </Modal>
    </div>
  );
};

export default TaskItem;
