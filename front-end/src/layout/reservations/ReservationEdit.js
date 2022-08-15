import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";

function ReservationEdit({ date }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [currentReservation, setCurrentReservation] = useState({
    reservation_id,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    getReservation(reservation_id)
      .then((response) => {
        setCurrentReservation({
          ...response,
          people: Number(response.people),
        });
      })
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    setCurrentReservation({
      ...currentReservation,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    updateReservation({
      ...currentReservation,
      people: Number(currentReservation.people),
    })
      .then((response) => {
        setCurrentReservation({ ...response });
        history.push(`/dashboard?date=${currentReservation.reservation_date}`);
      })

      .catch(setError);
    return () => abortController.abort();
  };

  return (
    <>
      <h1> Edit Reservation: {reservation_id} </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        <ReservationForm
          formData={currentReservation}
          handleChange={handleChange}
        />
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Edit
        </button>
      </form>
    </>
  );
}

export default ReservationEdit;
