import React, { useEffect, useReducer, useState } from "react";
import styles from "./App.module.css";
import Header from "./components/Layout/Header";
import CreateNewNote from "./components/CreateNewNote/CreateNewNote";
import NotesList from "./components/NotesList/NotesList";
import SortNotes from "./components/SortNotes/SortNotes";
import EditNotesModal from "./components/EditNotesModal/EditNotesModal";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      return {
        notes: [...state.notes, action.payload],
        sortType: state.sortType,
      };

    case "SORT":
      return { notes: state.notes, sortType: action.payload };

    case "TOGGLE_A_STAR":
      const toggledNotes = state.notes.map((note) => {
        const newNote = { ...note };
        if (newNote.id === action.payload)
          newNote.isStarred = newNote.isStarred ? false : true;
        return newNote;
      });
      return { notes: [...toggledNotes], sortType: state.sortType };

    case "CHANGE_A_NOTE":
      const changedNotes = state.notes.map((note) => {
        let newNote = { ...note };
        if (newNote.id === action.payload.id) newNote = { ...action.payload };
        return newNote;
      });
      return { notes: [...changedNotes], sortType: state.sortType };

    case "DELETE_A_NOTE":
      const savedNotes = [];
      state.notes.forEach((note) => {
        if (note.id !== action.payload) savedNotes.push(note);
      });
      return { notes: [...savedNotes], sortType: state.sortType };

    case "REARRAGE_NOTES":
      const { taken, current } = action.payload;
      const newOrder = state.notes.map((note) => {
        if (note.order === taken) return { ...note, order: current };
        if (note.order === current) return { ...note, order: taken };
        return { ...note };
      });
      newOrder.sort((a, b) => a.order - b.order);
      return { notes: [...newOrder], sortType: state.sortType };
  }
};

function App() {
  //Defining initial states
  const [state, dispatch] = useReducer(reducer, {
    notes: [
      {
        date: 1667475879588,
        id: "0.26560",
        isStarred: false,
        noteColor: "#da4e4e75",
        noteText: "Test sticky note app by Artem Babak",
        order: 2,
      },
    ],
    sortedNotes: [
      {
        date: 1667475879588,
        id: "0.26560",
        isStarred: false,
        noteColor: "#da4e4e75",
        noteText: "Test sticky note app by Artem Babak",
        order: 2,
      },
    ],
    sortType: "all",
  });
  /////////////////////////////////////////////

  //Adding new note (adding prop "order" for "drag and drop" purposes)
  const newNoteHandler = (note) => {
    if (state.notes.length > 0) {
      const lastCurrentNote = state.notes.at(-1);
      note.order = lastCurrentNote.order + 1;
    } else note.order = 1;
    dispatch({ type: "ADD_NOTE", payload: note });
  };
  /////////////////////////////////////////////

  //Implementing notes sort
  const [sortedNotes, setSortedNotes] = useState([...state.notes]);
  useEffect(() => {
    switch (state.sortType) {
      case "all":
        setSortedNotes([...state.notes]);
        break;
      case "starred":
        setSortedNotes(state.notes.filter((note) => note.isStarred === true));
        break;
    }
  }, [state.notes, state.sortType]);

  const sortHandler = (sortType) =>
    dispatch({ type: "SORT", payload: sortType });
  /////////////////////////////////////////////

  //Implementing note's changes
  const [noteOnChange, setNoteOnChange] = useState([]);

  const openEditor = (id) => {
    const note = sortedNotes.find((note) => note.id === id);
    setNoteOnChange([{ ...note }]);
  };

  const closeEditor = (note) => {
    setNoteOnChange([]);
    dispatch({ type: "CHANGE_A_NOTE", payload: note });
  };

  const deleteNote = (id) => {
    setNoteOnChange([]);
    dispatch({ type: "DELETE_A_NOTE", payload: id });
  };
  /////////////////////////////////////////////

  //Toggle a star on a note
  const toggleStarOnNote = (id) =>
    dispatch({ type: "TOGGLE_A_STAR", payload: id });
  /////////////////////////////////////////////

  //Implementing rearranging notes
  const changeOrderHandler = (orders) =>
    dispatch({ type: "REARRAGE_NOTES", payload: orders });
  /////////////////////////////////////////////
  return (
    <React.Fragment>
      <Header />
      <main className={styles.main}>
        <CreateNewNote onNewNote={newNoteHandler} />
        <SortNotes onSort={sortHandler} />
        <NotesList
          onChangeOrder={changeOrderHandler}
          onStartEditing={openEditor}
          onStar={toggleStarOnNote}
          notes={sortedNotes}
        />
      </main>
      {noteOnChange.length ? (
        <EditNotesModal
          onDelete={deleteNote}
          onFinishEditing={closeEditor}
          note={noteOnChange[0]}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default App;
