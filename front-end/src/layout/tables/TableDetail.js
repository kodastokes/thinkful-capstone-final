import React from "react";

function TableDetail({
  table: { table_id, table_name, capacity, status, reservation_id },
}) {
  return (
    <>
      <tr>
        <th scope="row"> {table_id} </th>
        <td> {table_name} </td>
        <td> {capacity} </td>
        <td> {reservation_id} </td>
        <td data-table-id-status={`${table_id}`}> {status} </td>
      </tr>
    </>
  );
}

export default TableDetail;
