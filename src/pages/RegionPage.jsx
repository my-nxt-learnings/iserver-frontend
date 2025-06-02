import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchByRegion } from '../api';
import '../styles/regionPage.css';

const RegionPage = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await fetchByRegion(region);
        setServers(data);
      } catch (err) {
        setError('Failed to load servers.');
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [region]);

  return (
    <div className="region-container">
      <div className="region-header">
        <h1>Region: {region}</h1>
        <button className="back-button" onClick={() => navigate('/home')}>⬅ Back to Home</button>
      </div>

      {loading ? (
        
        <div className="dots-loader">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : servers.length === 0 ? (
        <p className="no-servers">No servers found for this region.</p>
      ) : (
        <div className="server-list">
          {servers.map((server, index) => (
            <div key={index} className="server-card">
              <h3>{server.server_name}</h3>
              <p><strong>IP :</strong> <span>{server.ip_address}</span></p>
<p><strong>Site Code :</strong> <span>{server.site_code}</span></p>
<p><strong>Location :</strong> <span>{server.location}</span></p>
<p><strong>Support Group :</strong> <span>{server.support_group}</span></p>
<p><strong>Status :</strong> <span>{server.server_status}</span></p>
<p><strong>Class :</strong> <span>{server.server_class}</span></p>
<p><strong>Priority :</strong> <span>{server.priority}</span></p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionPage;
