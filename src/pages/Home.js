import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'; // Import the eye icon
import './Home.css';

ReactModal.setAppElement('#root'); // Set the app element for accessibility

function Home() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appHGQwsSUkzdrYtW/tbltU6V97VK3tlWBN', {
          headers: {
            Authorization: `Bearer patqE8BweWlIFLpQy.8ba6c1ba450fb78f97882aaa9f5969987a4936ad02398a8af7bc6d2ee75aabfa`,
          },
        });
        setData(response.data.records);
      } catch (error) {
        console.error("Error fetching data from Airtable, please check errors!", error);
      }
    };
    fetchData();
  }, []);

  const openModal = (record) => {
    setSelectedRecord(record);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className="home-container">
      <h2>Car List</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Color</th>
            <th>Created Time</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          ) : (
            data.map(record => (
              <tr 
                key={record.id} 
                onDoubleClick={() => openModal(record)} // Open modal on double click
                style={{ cursor: 'pointer' }}
              >
                <td>{record.fields.Name}</td>
                <td>{record.fields.Color}</td>
                <td>{new Date(record.createdTime).toLocaleString()}</td>
                <td className="icon-cell">
                  {/* Centered eye icon */}
                  <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => openModal(record)} // Open modal on single click of the icon
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for displaying record details */}
      {selectedRecord && (
        <ReactModal 
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Record Details"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Details for {selectedRecord.fields.Name}</h2>
          <p><strong>Color:</strong> {selectedRecord.fields.Color}</p>
          <p><strong>Created Time:</strong> {new Date(selectedRecord.createdTime).toLocaleString()}</p>
          <button onClick={closeModal}>Close</button>
        </ReactModal>
      )}
    </div>
  );
}

export default Home;
