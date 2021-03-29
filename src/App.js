import React, { useEffect, useState } from 'react';
import './App.css';
import LineGraph from './components/LineGraph';
import axios from './axios';

function App(){
  const [report, setReport] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(
        `/summary`
      );
      console.log(response);
      setReport(response.data);
      return response;
    }
    fetchData();
  }, []);

    return (
      <div className="App">
         <LineGraph report={report} total_confirmed={report?.Global?.TotalConfirmed} total_recovered={report?.Global?.TotalRecovered} total_deaths={report?.Global?.TotalDeaths}/>
      </div>
    );
}

export default App;