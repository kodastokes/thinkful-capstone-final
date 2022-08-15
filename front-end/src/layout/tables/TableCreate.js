import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);

  const initialData = {
    table_name: "",
    capacity: "",
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
      capacity: parseInt(formData.capacity),
    };
    createTable(submissionData)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <main>
      <h1> Create A Table </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="table_name">
              {" "}
              Table Name{" "}
            </label>
            <input
              className="form-control"
              name="table_name"
              id="table_name"
              required={true}
              type="text"
              minLength="2"
              onChange={handleChange}
              value={formData.table_name}
            />
            <small className="form-text text-muted"> Enter Table Name </small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="capacity">
              {" "}
              Table Capacity{" "}
            </label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              required={true}
              type="number"
              min="1"
              onChange={handleChange}
              value={formData.capacity}
            />
            <small className="form-text text-muted">Enter Table Capacity</small>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-3"
          onClick={goBack}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default TableCreate;
