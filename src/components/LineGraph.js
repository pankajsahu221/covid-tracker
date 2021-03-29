import React, {useState} from 'react'
import { Line } from 'react-chartjs-2';
import Card from './Card';
import axios from './../axios'

function LineGraph({ report, total_confirmed, total_recovered, total_deaths }) {

  const [totalConfirmed, setTotalConfirmed] = useState(total_confirmed) 
  const [totalRecovered, setTotalRecovered] = useState(total_recovered)
  const [totalDeaths, setTotalDeaths] = useState(total_deaths)

   const [days, setDays] = useState(7);
   const [countryName, setCountryName] = useState('');
   const [casesCountArr, setCasesCountArr] = useState([]);
   const [label, setLabel] = useState([]);

   const data = {
    labels: label.map(l => l.substr(0, 10)),
    datasets: [
      {
        label: 'Corona virus across the Country',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: casesCountArr
      }
    ]
  }

   const formatDate = (date)=>{
      const d = new Date(date);
      //2021-02-12   expected modification
      const year = d.getFullYear();
      const day = d.getDate();
      const month = `0${d.getMonth() + 1}`.slice(-2);   //=>12 -> 012 -> 12

      return `${year}-${month}-${day}`;
   }

   const countryHandle = (e)=>{
      setCountryName(e.target.value);

      const d = new Date();
      const to = formatDate(d);
      const from = formatDate(d.setDate(d.getDate() - days));

      console.log(from , to);
      getReportByData(e.target.value , from , to);
   }

   const dayHandle = (e)=>{
      setDays(e.target.value);
      
      const d = new Date();
      const to = formatDate(d);
      const from = formatDate(d.setDate(d.getDate() - e.target.value));

      console.log(from , to);
      getReportByData(countryName , from , to);
   }

   const getReportByData = ( countrySlug , from , to )=>{
     async function fetchData() {
       let response = await axios.get(
         `/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
       );
       console.log(response);

       const yAxis = response.data.map( desh => desh.Cases );
       const xAxisLabel = response.data.map( desh => desh.Date );
       const covidDetails = report.Countries.find( cont => cont.Slug === countrySlug);
       
        console.log(covidDetails.Slug, covidDetails);

       setTotalConfirmed(covidDetails.TotalConfirmed);
       setTotalRecovered(covidDetails.TotalRecovered);
       setTotalDeaths(covidDetails.TotalDeaths);
       setCasesCountArr(yAxis);
       setLabel(xAxisLabel);
      //  setReport(response.data);
       return response;
     }
     fetchData();
   }

    return (
      <div>
        <h1 style={{textTransform: "capitalize"}}>COVID TRACKER {countryName ? countryName : "World Wide" }</h1>
        <div className="linegraph">      
          <div>
            <div className="flex-row">
                <Card title={"Total Confirmed"} num={totalConfirmed}/>
                <Card title={"Total Recovered"} num={totalRecovered}/>
                <Card title={"Total Deaths"} num={totalDeaths}/>
            </div>

          </div>

          <div>
             <select value={countryName} onChange={ countryHandle }>
               <option value="">Select Country</option>
                {report?.Countries && report?.Countries.map( country => {
                  return <option key={country.ID} value={country.Slug}>{country.Country}</option>
                })}
             </select>
             <select value={days} onChange={ dayHandle }>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
             </select>
          </div>

          <Line data={data}/> 
        </div>
       </div>
    )
}

export default LineGraph
