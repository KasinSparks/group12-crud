import React, { useEffect, useState } from 'react';

export default function NumberOfTuples() {
    const base_url_str = "http://localhost:8080/queries/numoftuples";
    const prepend_table_str = "KASINSPARKS.";
    
    const [business, setBusiness] = useState(0);
    const [crimetype, setCrimetype] = useState(0);
    const [incidenthascrimetype, setIncidenthascrimetype] = useState(0);
    const [location, setLocation] = useState(0);
    const [policeincidents, setPoliceIncidents] = useState(0);
    const [pollution, setPollution] = useState(0);
    const [realestatesale, setRealestatesale] = useState(0);
    const [realestatesalesdate, setRealestatesalesdate] = useState(0);
    const [residential, setResidential] = useState(0);
    const [traffic, setTraffic] = useState(0);
    const [weather, setWeather] = useState(0);

    const tables = {
        "CISBusiness" : (val) => { setBusiness(val) },
        "CISCrimeTypes" : (val) => { setCrimetype(val) },
        "CISIncidentHasCrimeTypes" : (val) => { setIncidenthascrimetype(val) },
        "CISLocation" : (val) => { setLocation(val) },
        "CISPoliceIncidents" : (val) => { setPoliceIncidents(val) },
        "CISPollution" : (val) => { setPollution(val) },
        "CISRealEstateSale" : (val) => { setRealestatesale(val) },
        "CISRealEstateSalesDate" : (val) => { setRealestatesalesdate(val) },
        "CISResidential" : (val) => { setResidential(val) },
        "CISTraffic" : (val) => { setTraffic(val) },
        "CISWeatherSample" : (val) => { setWeather(val) },
    };
    
    useEffect(() => {
        for (const key in tables) {
            console.log(key);
            const url_str = base_url_str + "?tablename=" + prepend_table_str + key;
            fetch(url_str)
                .then(res => res.json())
                .then(json => (tables[key])(json[0]["COUNT(*)"]))
                .catch(err => err);
        }

        return () => {}
    }, []);

    return (
      <>
        <div>
          <TupleCount 
            tablename={"CISBusiness"}
            count={ business }
          />
          <TupleCount 
            tablename={"CISCrimeTypes"}
            count={ crimetype }
          />
          <TupleCount 
            tablename={"CISIncidentHasCrimeTypes"}
            count={ incidenthascrimetype }
          />
          <TupleCount 
            tablename={"CISLocation"}
            count={ location }
          />
          <TupleCount 
            tablename={"CISPoliceIncidents"}
            count={ policeincidents }
          />
          <TupleCount 
            tablename={"CISPollution"}
            count={ pollution }
          />
          <TupleCount 
            tablename={"CISRealEstateSale"}
            count={ realestatesale }
          />
          <TupleCount 
            tablename={"CISRealEstateSalesDate"}
            count={ realestatesalesdate }
          />
          <TupleCount 
            tablename={"CISResidential"}
            count={ residential }
          />
          <TupleCount 
            tablename={"CISTraffic"}
            count={ traffic }
          />
          <TupleCount 
            tablename={"CISWeatherSample"}
            count={ weather }
          />
          <div>
            <div><h3>Total: </h3></div>
            <div><p>{ business + crimetype + incidenthascrimetype + location 
              + policeincidents + pollution + realestatesale + realestatesalesdate
              + residential + traffic + weather }</p></div>
          </div>
        </div>
      </>
    );
}

function TupleCount({tablename, count}) {
    return (
      <>
        <div>
          <div><h3>{ tablename }</h3></div>
          <div><p>{ count }</p></div>
        </div>
      </>
    );
}
