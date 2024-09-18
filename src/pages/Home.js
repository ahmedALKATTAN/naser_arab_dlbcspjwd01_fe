import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Home Page</h2>
      <ul>
        {data.map(record => (
          <li key={record.id}>{record.fields.Name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
