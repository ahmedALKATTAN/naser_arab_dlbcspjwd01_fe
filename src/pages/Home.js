import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Create a CSS file for styling

function Home() {
  const [data, setData] = useState([]);

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

  return (
    <div className="home-container">
      <h2>Car List</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Color</th>
            <th>Created Time</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          ) : (
            data.map(record => (
              <tr key={record.id}>
                <td>{record.fields.Name}</td>
                <td>{record.fields.Color}</td>
                <td>{new Date(record.createdTime).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
