import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import ReservationDetail from "../layout/reservations/ReservationDetail";
import TableDetail from "../layout/tables/TableDetail";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    listTables({}, abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  const previousHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const todayHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
  };

  const nextHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(date)}`);
  };

  function clearTables(tables) {
    let result = [];
    tables.forEach((table) => {
      if (table.reservation_id) {
        result.push(table);
      }
    });
    return result;
  }
  let clearTableToggler = clearTables(tables);

  if (reservations) {
    return (
      <main>
        <div className="mb-3">
          <h1>Dashboard</h1>
        </div>
        <div className="d-md-flex mb-3">
          <div className="row mb-3">
            <h4 className="ml-3">Reservations for date: {date} </h4>
            <div className="">
              <button
                className="btn btn-primary ml-3"
                onClick={previousHandler}
              >
                Previous Day
              </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={todayHandler}>
                Today
              </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={nextHandler}>
                Next Day
              </button>
            </div>
          </div>
        </div>
        <ErrorAlert error={error} />
        <div>
          <h4> Reservation List </h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"> ID </th>
                <th scope="col"> First Name </th>
                <th scope="col"> Last Name </th>
                <th scope="col"> Party Size </th>
                <th scope="col"> Phone Number </th>
                <th scope="col"> Date </th>
                <th scope="col"> Time </th>
                <th scope="col"> Status </th>
                <th scope="col"> Seat </th>
                <th scope="col"> Edit </th>
                <th scope="col"> Cancel </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <ReservationDetail
                  reservation={reservation}
                  key={reservation.reservation_id}
                  loadDashboard={loadDashboard}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4> Tables List </h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"> ID </th>
                <th scope="col"> Table Name </th>
                <th scope="col"> Capacity </th>
                <th scope="col"> Reservation ID </th>
                <th scope="col"> Table Status </th>
                {clearTableToggler.length ? (
                  <th scope="col"> Clear Tables </th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <TableDetail
                  table={table}
                  key={table.table_id}
                  loadDashboard={loadDashboard}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h4> Dashboard Loading... </h4>
      </div>
    );
  }
}

export default Dashboard;
