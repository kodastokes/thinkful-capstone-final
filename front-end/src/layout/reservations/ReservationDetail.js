import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../ErrorAlert";
import { updateResStatus, listTables } from "../../utils/api";

function ReservationDetail({
  reservation: {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  },
  loadDashboard,
}) {
  const history = useHistory();

  const [error, setError] = useState(null);

  const handleCancelRes = (event) => {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateResStatus({ status: "cancelled" }, reservation_id)
        .then(() => {
          listTables({});
          loadDashboard();
          history.push("/dashboard");
        })
        .catch(setError);
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {reservation_id} </th>
        <td> {first_name} </td>
        <td> {last_name} </td>
        <td> {people} </td>
        <td> {mobile_number} </td>
        <td> {reservation_date} </td>
        <td> {reservation_time} </td>
        <td data-reservation-id-status={reservation_id}> {status} </td>
        <td>
          {status === "booked" ? (
            <a href={`/reservations/${reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </a>
          ) : (
            <div></div>
          )}
        </td>
        <td>
          {status === "booked" ? (
            <a href={`/reservations/${reservation_id}/edit`}>
              <button className="btn btn-primary "> Edit </button>
            </a>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation_id}>
          {status === "booked" ? (
            <button className="btn btn-danger ml-2" onClick={handleCancelRes}>
              {" "}
              Cancel{" "}
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationDetail;
