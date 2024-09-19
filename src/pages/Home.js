import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import { API_URL, BEARER_TOKEN } from '../config';  // Import the config values

ReactModal.setAppElement('#root');

function Home() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({ Name: '', Color: '' });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: BEARER_TOKEN,  // Use the constant instead of hardcoding
          },
        });
        setData(response.data.records);
      } catch (error) {
        console.error("Error fetching data from Airtable", error);
      }
    };
    fetchData();
  }, []);

  const openModal = (record = { fields: { Name: '', Color: '' } }) => {
    setSelectedRecord(record);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRecord(null);
    setNewRecord({ Name: '', Color: '' });
  };

  const handleCreateRecord = async () => {
    try {
      const response = await axios.post(
        API_URL,  // Use the constant for the URL
        {
          records: [
            {
              fields: newRecord,
            },
          ],
        },
        {
          headers: {
            Authorization: BEARER_TOKEN,  // Use the constant for the Bearer token
          },
        }
      );
      setData([...data, response.data.records[0]]);
      closeModal();
    } catch (error) {
      console.error("Error creating new record", error);
    }
  };

  const handleDeleteRecords = async () => {
    if (selectedRecords.length === 0) {
      setErrorMessage('Please select at least one record'); // Set the error message
      return;
    } 
    else{
     setErrorMessage(''); // Clear the error message
    }   

    const recordIds = selectedRecords.map((id) => `records[]=${id}`).join('&');

    try {
      await axios.delete(`${API_URL}?${recordIds}`, {
        headers: {
          Authorization: BEARER_TOKEN,  // Use the constant for the Bearer token
        },
      });
      setData(data.filter((record) => !selectedRecords.includes(record.id)));
      setSelectedRecords([]);
    } catch (error) {
      console.error("Error deleting records", error);
    }
  };

  const toggleRecordSelection = (id) => {
    setErrorMessage(''); // Clear the error message on selection change
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };
  

  return (
    <div className="home-container">
      <h2>Car List</h2>

      <div className="actions-box">
        <button onClick={() => openModal()}>Create New Car</button>
        <button
          onClick={handleDeleteRecords}
          
        >
          Delete Selected
        </button>
      </div>

      {/* Error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox column */}
            <th>Name</th>
            <th>Color</th>
            <th>Created Time</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          ) : (
            data.map((record) => (
              <tr
                key={record.id}
                onDoubleClick={() => openModal(record)}
                style={{ cursor: "pointer" }}
              >
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record.id)}
                    onChange={() => toggleRecordSelection(record.id)}
                  />
                </td>
                <td>{record.fields.Name}</td>
                <td>{record.fields.Color}</td>
                <td>{new Date(record.createdTime).toLocaleString()}</td>
                <td className="icon-cell">
                  <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => openModal(record)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedRecord && (
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Record Details"
          className="Modal"
          overlayClassName="Overlay"
        >
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
          <h2>
            {selectedRecord.id
              ? `Details for ${selectedRecord.fields.Name}`
              : "Create New Car"}
          </h2>

          <label>
            Name:
            <input
              type="text"
              value={
                selectedRecord.id ? selectedRecord.fields.Name : newRecord.Name
              }
              onChange={(e) =>
                selectedRecord.id
                  ? setSelectedRecord({
                      ...selectedRecord,
                      fields: {
                        ...selectedRecord.fields,
                        Name: e.target.value,
                      },
                    })
                  : setNewRecord({ ...newRecord, Name: e.target.value })
              }
            />
          </label>

          <label>
            Color:
            <input
              type="text"
              value={
                selectedRecord.id
                  ? selectedRecord.fields.Color
                  : newRecord.Color
              }
              onChange={(e) =>
                selectedRecord.id
                  ? setSelectedRecord({
                      ...selectedRecord,
                      fields: {
                        ...selectedRecord.fields,
                        Color: e.target.value,
                      },
                    })
                  : setNewRecord({ ...newRecord, Color: e.target.value })
              }
            />
          </label>

          <button onClick={selectedRecord.id ? closeModal : handleCreateRecord}>
            {selectedRecord.id ? "Close" : "Create"}
          </button>
        </ReactModal>
      )}
    </div>
  );
}

export default Home;
