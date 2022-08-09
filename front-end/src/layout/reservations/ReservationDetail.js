import React from "react";
// import ErrorAlert from "../ErrorAlert";

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
}) {
//   const [error, setError] = useState("");

  return (
    <>
      {/* <ErrorAlert error={error} /> */}
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
      </tr>
    </>
  );
}

export default ReservationDetail;
