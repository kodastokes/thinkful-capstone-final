import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  updateResStatus,
  deleteTableReservation,
  listTables,
} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableDetail({
  table: { table_id, table_name, capacity, status, reservation_id },
  loadDashboard,
}) {
  const history = useHistory();

  const [error, setError] = useState(null);

  async function handleFinish(event) {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    let confirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirm) {
      await updateResStatus(
        { status: "finished" },
        reservation_id,
        abortController.signal
      );
      await loadTables();
      loadDashboard();
      history.push("/dashboard");
    }

    async function loadTables() {
      const abortController = new AbortController();
      try {
        const response = await deleteTableReservation(
          table_id,
          abortController.signal
        );
        const selectedTable = response.find(
          (tables) => tables.table_id === table_id
        );
        // setCurrentTable({ ...selectedTable });
        listTables({});
        return selectedTable;
      } catch (error) {
        setError(error);
      }
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {table_id} </th>
        <td> {table_name} </td>
        <td> {capacity} </td>
        <td> {reservation_id} </td>
        <td data-table-id-status={`${table_id}`}> {status} </td>
        <td>
          {reservation_id ? (
            <button
              className="btn btn-danger"
              onClick={handleFinish}
              data-table-id-finish={`${table_id}`}
            >
              Finish
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default TableDetail;
