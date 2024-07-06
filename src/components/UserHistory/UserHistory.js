import React, { useEffect, useState } from 'react';
import './UserHistory.css';

function UserHistory({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8001/health_histories/${userId}/`)
      .then(response => response.json())
      .then(data => setHistory(data));
  }, [userId]);

  return (
    <div className="userhistory-container">
      <h2>User History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item.condition} - {item.treatment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserHistory;
