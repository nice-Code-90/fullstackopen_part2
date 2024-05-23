import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [fetchedCountries, setFetchedCountries] = useState([]); //fetched all countries

  const [countryFilter, setCountryFilter] = useState(""); //field value of form
  const [filteredResults, setFilteredResults] = useState([]); //filtered results

  const [searchField, setSearchField] = useState(null); // value of submitted field
  const [weatherOfCapital, setWeatherOfCapital] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setFetchedCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    setFilteredResults(
      fetchedCountries.filter((country) =>
        country.name.common.toLowerCase().includes(searchField.toLowerCase())
      )
    );
  }, [searchField]);

  useEffect(() => {
    if (filteredResults.length === 1) {
      axios
        .get(
          `http://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_APP_APIKEY
          }&q=${filteredResults[0].capital[0]}&aqi=no`
        )
        .then((response) => {
          setWeatherOfCapital(response.data);
        });
    }
  }, [filteredResults]);

  const onSearch = (e) => {
    e.preventDefault();
    setSearchField(countryFilter);
  };

  return (
    <>
      <form onSubmit={onSearch}>
        find countries
        <input
          value={countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
          }}
        ></input>
      </form>
      <div>
        {filteredResults.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredResults.length > 1 && filteredResults.length < 11 ? (
          filteredResults.map((country) => (
            <div key={country.name.common}>
              <p>
                {country.name.common}{" "}
                <button>
                  <a href={country.maps.googleMaps} target="_blank">
                    show
                  </a>
                </button>
              </p>
              <div></div>
            </div>
          ))
        ) : filteredResults.length === 1 ? (
          <>
            <h1>{filteredResults[0].name.common}</h1>

            <p>capital {filteredResults[0].capital[0]}</p>
            <p>area {filteredResults[0].area}</p>
            <div>
              <h2>languages</h2>
              <ul>
                {Object.values(filteredResults[0].languages).map(
                  (lang, index) => (
                    <li key={index}>{lang}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <picture>
                <img src={filteredResults[0].flags.png} alt="flag"></img>
              </picture>
              <h2>Weather in {filteredResults[0].capital[0]}</h2>
              <p>temperature {weatherOfCapital?.current?.temp_c} Celsius</p>
              <picture>
                <img
                  src={weatherOfCapital?.current?.condition?.icon}
                  alt="weather_icon"
                />
              </picture>
            </div>
          </>
        ) : (
          <p>No matches found</p>
        )}
      </div>
    </>
  );
}

export default App;
