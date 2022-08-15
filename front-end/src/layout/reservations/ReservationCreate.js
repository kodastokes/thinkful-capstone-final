import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationCreate() {
  const history = useHistory();

  const [reservationsError, setReservationsError] = useState(null);

  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
  };

  const [formData, setFormData] = useState({ ...initialData });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    const submissionData = {
      ...formData,
      people: parseInt(formData.people),
    };
    createReservation(submissionData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <form name="reservations" onSubmit={handleSubmit}>
        <fieldset>
          <h2>Create Reservation</h2>
          <ErrorAlert error={reservationsError} />
          <ReservationForm formData={formData} handleChange={handleChange} />
          <div>
            <button onClick={goBack} className="btn btn-secondary mr-2">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export default ReservationCreate;
