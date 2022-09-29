import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
import { RootState, AppThunk } from "../../app/store";
import { db } from "../../firebase";

interface TaskState {
  //taskが何個あるのかを管理する
  idCount: number;
  //storeに保存するtaskの一覧
  tasks: { id: string; title: string; completed: boolean }[];
  //taskのtitleを編集する際にどのタスクが選択されているか
  selectedTask: { id: string; title: string; completed: boolean };
  //Modalを開くか閉じるかのフラグ
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: "", title: "", completed: false },
  isModalOpen: false,
};

//Taskの全件取得 ============================
export const fetchTasks = createAsyncThunk("task/getAllTasks", async () => {
  //日付の降順（新しいデータが上にくる）にデータをソートしてtaskのデータを全件取得
  const res = await db.collection("tasks").orderBy("dateTime", "desc").get();
  //レスポンスの整形
  const allTasks = res.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));

  const taskNumber = allTasks.length;
  const passData = { allTasks, taskNumber };
  return passData;
});

//Taskの新規作成 ============================
export const createTask = async (title: string): Promise<void> => {
  try {
    //現在時刻の取得
    const dateTime = firebase.firestore.Timestamp.fromDate(new Date());
    //fireStoreのtaskコレクションにデータを追加（idは自動で振られます）

    await db
      .collection("tasks")
      .add({ title: title, completed: false, dateTime: dateTime });
  } catch (err) {
    console.log("Error writing document:", err);
  }
};
//Taskの編集 ============================
export const editTask = async (submitData: {
  id: string;
  title: string;
  completed: boolean;
}): Promise<void> => {
  const { id, title, completed } = submitData;
  const dateTime = firebase.firestore.Timestamp.fromDate(new Date());
  try {
    await db
      .collection("tasks")
      .doc(id)
      .set({ title, completed, dateTime }, { merge: true });
  } catch (err) {
    console.log("Error updating document:", err);
  }
};

//Taskの削除 ============================
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await db.collection("tasks").doc(id).delete();
  } catch (err) {
    console.log("Error removeing document:", err);
  }
};
export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    //どのtaskを選択しているか管理
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    //Modelを開くか閉じるかのフラグ管理
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    //stateとactionの型が正しく推論されるためにbuilder関数を用いる
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      //action.payload===return passData
      state.tasks = action.payload.allTasks;
      state.idCount = action.payload.taskNumber;
    });
  },
});

export const { selectTask, handleModalOpen } = taskSlice.actions;

export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export const selectSelectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export default taskSlice.reducer;
