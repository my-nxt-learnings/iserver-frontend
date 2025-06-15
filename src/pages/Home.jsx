import React, { useEffect, useState } from 'react';
import { fetchAllServers ,addServer, uploadCSV} from '../api';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';


const initialForm = {
    region: '',
    priority: '',
    server_name: '',
    ip_address: '',
    site_code: '',
    location: '',
    support_group: '',
    server_status: '',
    server_class: '',
  };

const colors = ["#4A90E2", "#d65184", "#F5A623", "#04492f"];  

const Home = () => {
  const [servers, setServers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [uploadMessage, setUploadMessage] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    const loadServers = async () => {
      const all = await fetchAllServers();
      setServers(all);

      const regionMap = {};
      all.forEach((server) => {
        regionMap[server.region] = (regionMap[server.region] || 0) + 1;
      });
      const regionData = Object.entries(regionMap).map(([region, count]) => ({
        region,
        count,
      }));
      setRegions(regionData);
      setLoadingRegions(false);
    };

    loadServers();
  }, []);

 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    const results = servers.filter((s) =>
      s.server_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    setShowSearchResults(true);
  
    if (results.length) {
      setSearchResults(results);
      setSearchError('');
    } else {
      setSearchResults([]);
      setSearchError('No servers found matching your query.');
    }
    
  };
  

  const handleRegionClick = (region) => {
    navigate(`/region/${region}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addServer(formData);
      setSubmitMessage('Server added successfully!');
      setFormData(initialForm);
      const all = await fetchAllServers();
      setServers(all);

      const regionMap = {};
    all.forEach((server) => {
      regionMap[server.region] = (regionMap[server.region] || 0) + 1;
    });
    const updatedRegionData = Object.entries(regionMap).map(([region, count]) => ({
        region,
        count,
      }));
      setRegions(updatedRegionData);
    } catch (err) {
      console.error('Add server error:', err);
      setSubmitMessage('❌ Error adding server. Please check input.');
    }
  };
  

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>I-Server Directory</h1>
      </header>

      <main className="home-main">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search server by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {showSearchResults && (
             <div className="search-result-container">
                <div className="search-header">
                <h2>Search Results</h2>
                <button 
                className="close-btn" 
                onClick={() => {setShowSearchResults(false)
                    setSearchQuery("")
                }}
                >
                ✖
                </button>
                </div>

                {searchError ? (
                <p className="search-error">{searchError}</p>
                ) : (
                <div className="search-cards">
                    {searchResults.map((server) => (
                    <div key={server.server_name} className="server-card">
                        <h4>{server.server_name}</h4>
                        <p><strong>IP</strong> : {server.ip_address}</p>
                        <p><strong>Owner</strong> : {server.owner}</p>
                        <p><strong>Application</strong> : {server.application_group}</p>
                    </div>
                    ))}
                </div>
                )}
            </div>
        )}


        {searchError && <p className="error">{searchError}</p>}

       

        {loadingRegions ? (
            <div className="dots-loader">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
            ) : (  
            <>
            <div className="region-cards">
                {regions.map(({region, count},index) => (
                <div
                    key={region}
                    className="region-card"
                    onClick={() => handleRegionClick(region)}
                    style={{color:`${colors[index]}`,border:`2px solid ${colors[index]}`}}
                >
                    <h3>{region}</h3>
                    <p className='servercount'>{count} servers</p>
                </div>
                ))}
            </div>

            <div>
                <h2 className="chart-heading">Servers by Region</h2>
                <div className="bar-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regions} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#5A90E2" radius={[10, 10, 0, 0]} barSize={80} label={{position:"top"}}>
                        {
                            regions.map((each,index)=>(
                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                            ))
                        }
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                </div>
                </div>

            </>

            )}

        

        <div className="add-server-section">
          <h2 style={{color:"#2C3E50"}}>Add New Server</h2>
          
          <div className="add-server-form-section">

            <form className="add-server-form" onSubmit={handleSubmit}>
                <div className="form-row">
                <input
                    type="text"
                    name="server_name"
                    placeholder="Server Name"
                    value={formData.server_name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="ip_address"
                    placeholder="IP Address"
                    value={formData.ip_address}
                    onChange={handleInputChange}
                    required
                />
                </div>

                <div className="form-row">
                <input
                    type="text"
                    name="site_code"
                    placeholder="Site Code"
                    value={formData.site_code}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                />
                </div>

                <div className="form-row">
                <select name="region" value={formData.region} onChange={handleInputChange} required>
                    <option value="">Select Region</option>
                    <option value="Greater Asia">Greater Asia</option>
                    <option value="EMEA">EMEA</option>
                    <option value="Latin America">Latin America</option>
                    <option value="North America">North America</option>
                </select>
                <select name="priority" value={formData.priority} onChange={handleInputChange} required>
                    <option value="">Priority</option>
                    <option value="Critical">Critical`</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                </div>

                <div className="form-row">
                <input
                    type="text"
                    name="support_group"
                    placeholder="Support Group"
                    value={formData.support_group}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="server_status"
                    placeholder="Server Status"
                    value={formData.server_status}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="server_class"
                    placeholder="Server Class"
                    value={formData.server_class}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="owner"
                    placeholder="Owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    />

                    <input
                    type="text"
                    name="application_group"
                    placeholder="Application Group"
                    value={formData.application_group}
                    onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="submit-btn">Add Server</button>
                {submitMessage && <p className="submit-message">{submitMessage}</p>}
                <p className='or'>or</p>
                <div className="csv-upload">
                    <p  style={{fontWeight:800, fontSize:15}}>Upload CSV file</p>
            <input
                type="file"
                accept=".csv"
                className='csv-input'
                onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                try {
                    await uploadCSV(file);
                    setUploadMessage("✅ CSV uploaded successfully!");
                    // refresh servers
                    const all = await fetchAllServers();
                    setServers(all);
                    // update region counts too
                    const regionMap = {};
                    all.forEach((server) => {
                    regionMap[server.region] = (regionMap[server.region] || 0) + 1;
                    });
                    setRegions(Object.entries(regionMap).map(([region, count]) => ({ region, count })));
                } catch (err) {
                    console.error(err);
                    setUploadMessage("❌ Failed to upload CSV.");
                }
                }}
            />
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
            </div>
            </form>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
