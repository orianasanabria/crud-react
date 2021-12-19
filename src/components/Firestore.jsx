import React from "react"
import moment from "moment"
import { db } from "../config/firebase"
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore"

const Firestore = (props) => {
  const [tasks, setTasks] = React.useState([])
  const [task, setTask] = React.useState("")
  const [editMode, setEditMode] = React.useState(false)
  const [id, setId] = React.useState("")
  const [last, setLast] = React.useState(null)
  const [deactivate, setDeactivate] = React.useState(false)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const collectionRef = collection(db, props.user.email)
        const q = query(collectionRef, orderBy("date"), limit(2))
        const data = await getDocs(q)
        const docs = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setLast(data.docs[data.docs.length - 1])
        setTasks(docs)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [props.user.email])

  const nextPage = async () => {
    console.log("next page")
    try {
      const collectionRef = collection(db, props.user.email)
      const q = query(
        collectionRef,
        orderBy("date"),
        limit(2),
        startAfter(last)
      )
      const data = await getDocs(q)
      const docs = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setTasks([...tasks, ...docs])
      setLast(data.docs[data.docs.length - 1])
      const lastQ = query(
        collectionRef,
        orderBy("date"),
        limit(2),
        startAfter(data.docs[data.docs.length - 1])
      )
      const lastData = await getDocs(lastQ)
      if(lastData.empty){
        console.log('no hay mas docs');
        setDeactivate(true)
      } else {
        setDeactivate(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!task.trim()) {
      console.log("Esta vacio")
      return
    }
    try {
      const newTask = {
        name: task,
        date: Date.now(),
      }

      const data = await addDoc(collection(db, props.user.email), newTask)
      setTasks([...tasks, { ...newTask, id: data.id }])
      setTask("")
    } catch (error) {
      console.log(error)
    }
    console.log(task)
  }

  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, props.user.email, id)
      await deleteDoc(taskDoc)
      const filteredArray = tasks.filter((el) => el.id !== id)
      setTasks(filteredArray)
    } catch (error) {
      console.log(error)
    }
  }

  const editOn = (item) => {
    setEditMode(true)
    setTask(item.name)
    setId(item.id)
  }

  const editTask = async (e) => {
    e.preventDefault()
    if (!task.trim()) {
      console.log("It's empty")
      return
    }

    try {
      const taskDoc = doc(db, props.user.email, id)
      await updateDoc(taskDoc, {
        name: task,
      })
      const editedArray = tasks.filter((el) =>
        el.id === id ? { id: el.id, date: el.date, name: task } : el
      )

      setTasks(editedArray)
      setEditMode(false)
      setTask("")
      setId("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {tasks.map((item) => {
              return (
                <li className="list-group-item" key={item.id}>
                  {item.name} | {moment(item.date).format("lll")}
                  <button
                    className="btn btn-outline-danger btn-sm float-right"
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-outline-warning btn-sm float-right mr-2"
                    onClick={() => editOn(item)}
                  >
                    Edit
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            onClick={() => nextPage()}
            className="btn btn-outline-info btn-block mt-2 btn-sm"
            disabled={deactivate}
          >
            Next Page
          </button>
        </div>
        <div className="col-md-6">
          <h3>{editMode ? "Edit Task" : "Add Task"}</h3>
          <form onSubmit={editMode ? editTask : addTask}>
            <input
              type="text"
              placeholder="Enter Task"
              className="form-control mb-2"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <button
              className={
                editMode
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {editMode ? "Edit Task" : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Firestore
