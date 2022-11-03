import React from "react";
import styles from "./SortNotes.module.css";

function SortNotes(props) {
  const selectHandler = (e) => props.onSort(e.target.value);

  return (
    <select className={styles.select} onChange={selectHandler}>
      <option value="all">View All</option>
      <option value="starred">Only starred</option>
    </select>
  );
}

export default SortNotes;
