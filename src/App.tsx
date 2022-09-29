import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/header/Header";
import TaskForm from "./features/task/taskForm/TaskForm";
import TaskList from "./features/task/taskList/TaskList";
import { fetchTasks } from "./features/task/taskSlice";
import { AppDispatch } from "./app/store";
import styles from "./App.module.scss";

import { auth } from "./firebase";

const App: React.FC = () => {
  console.log(auth);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const getData = () => {
      dispatch(fetchTasks());
    };
    getData();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Header />
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
