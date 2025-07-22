import React, { useState } from "react";

const API_KEY = "21a9e3a52c32034666680c7601cbc6b7";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [units, setUnits] = useState("metric");

  const fetchWeather = async (targetCity) => {
    setLoading(true);
    setMsg("");
    setWeather(null);
    try {
      const r = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          targetCity
        )}&units=${units}&appid=${API_KEY}`
      );
      if (!r.ok) throw new Error("City not found");
      setWeather(await r.json());
    } catch {
      setMsg("City not found or fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByLocation = () => {
    setMsg("");
    if (!navigator.geolocation) {
      setMsg("Geolocation not available.");
      return;
    }
    setLoading(true);
    setWeather(null);
    navigator.geolocation.getCurrentPosition(
      async (loc) => {
        try {
          const r = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&units=${units}&appid=${API_KEY}`
          );
          if (!r.ok) throw new Error("Location error");
          setWeather(await r.json());
        } catch {
          setMsg("Weather fetch failed.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMsg("Location permission denied.");
        setLoading(false);
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  return (
    <div className="w-screen min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-500 via-sky-300 to-white">
      {/* Main weather section (left/above on mobile) */}
      <section className="flex-1 min-w-0 flex items-center justify-center p-2">
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/90 backdrop-blur-2xl border border-blue-100 shadow-2xl px-5 py-8 sm:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 w-full">
            <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
              <span>🌦️</span>
              <span className="text-gray-800">Weather Now</span>
            </h1>
            <button
              className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-sky-600 focus-visible:ring-2 focus-visible:ring-sky-600 transition"
              onClick={fetchByLocation}
            >
              Use My Location
            </button>
          </div>
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-8 w-full"
          >
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-lg font-medium text-gray-900 transition"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city (e.g., Mumbai)"
              autoFocus
              disabled={loading}
            />
            <button
              className="px-6 py-3 bg-sky-400 text-white rounded-lg font-semibold hover:bg-sky-500 focus-visible:ring-2 focus-visible:ring-sky-600 transition disabled:opacity-70"
              type="submit"
              disabled={loading}
              aria-label="Fetch weather"
            >
              Search
            </button>
            <select
              className="px-2 py-2 border rounded text-lg text-gray-900 bg-white"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              disabled={loading}
              aria-label="Select temperature unit"
            >
              <option value="metric">°C</option>
              <option value="imperial">°F</option>
            </select>
          </form>
          {/* Messages/Spinner */}
          {loading && (
            <div className="flex justify-center py-8 animate-pulse">
              <svg
                className="animate-spin w-10 h-10 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          )}
          {msg && (
            <div className="text-red-600 text-lg text-center my-4 animate-pulse">
              {msg}
            </div>
          )}
          {/* Weather Display */}
          {weather && (
            <div className="animate-fade-in mt-1 space-y-5 transition-all w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-900">
                    {weather.name}
                    {weather.sys?.country && (
                      <span className="text-lg font-semibold text-gray-500 ml-2">
                        ({weather.sys.country})
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-4 items-center mt-2">
                    <span className="text-7xl sm:text-8xl font-black text-gray-900 drop-shadow">
                      {Math.round(weather.main.temp)}°
                      {units === "metric" ? "C" : "F"}
                    </span>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                      alt={weather.weather[0].main}
                      className="h-20 w-20 drop-shadow"
                    />
                  </div>
                </div>
                <div className="md:pl-5 mt-6 md:mt-0 md:text-right">
                  <span className="inline-block px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-bold text-base uppercase shadow mb-1 tracking-wide">
                    {weather.weather[0].main}
                  </span>
                  <div className="text-lg text-slate-500 capitalize">
                    {weather.weather[0].description}
                  </div>
                </div>
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full">
                <WeatherStat
                  label="Feels Like"
                  value={`${Math.round(weather.main.feels_like)}°`}
                />
                <WeatherStat
                  label="Min"
                  value={`${Math.round(weather.main.temp_min)}°`}
                />
                <WeatherStat
                  label="Max"
                  value={`${Math.round(weather.main.temp_max)}°`}
                />
                <WeatherStat
                  label="Humidity"
                  value={`${weather.main.humidity}%`}
                />
                <WeatherStat
                  label="Wind"
                  value={`${weather.wind.speed} ${
                    units === "metric" ? "m/s" : "mph"
                  }`}
                />
                <WeatherStat
                  label="Pressure"
                  value={`${weather.main.pressure} hPa`}
                />
                <WeatherStat
                  label="Timezone"
                  value={`GMT${weather.timezone > 0 ? "+" : ""}${
                    weather.timezone / 3600
                  }`}
                  colSpan={2}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Right panel: always fills available width, responsive, visible on all breakpoints */}
      <aside className="flex-1 min-w-0 flex items-center justify-center p-2">
        <div className="w-full h-full min-h-[280px] rounded-3xl bg-gradient-to-br from-sky-300/70 to-blue-100/80 shadow-xl border border-sky-200 backdrop-blur-xl flex flex-col items-center justify-center p-8">
          <div className="flex items-center justify-center mb-6">
            <span className="text-[4rem] md:text-[7rem] animate-bounce">
              ☀️
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 text-center">
            Plan Your Day
          </h2>
          <ul className="text-blue-800 text-lg font-medium space-y-1 text-center">
            <li>• Accurate, up-to-date weather</li>
            <li>• Search any city worldwide</li>
            <li>• Use your real location</li>
            <li>• Works on every device size</li>
          </ul>
          <div className="mt-7 text-center text-blue-600 italic">
            "Good weather inspires good moods!"
          </div>
        </div>
      </aside>
    </div>
  );
}

// Stats sub-component
function WeatherStat({ label, value, colSpan }) {
  return (
    <div
      className={`bg-sky-50 rounded-lg p-4 flex flex-col items-center shadow-sm w-full
      ${colSpan === 2 ? "col-span-2" : ""}`}
    >
      <span className="text-sky-600 text-base font-medium">{label}</span>
      <span className="font-extrabold text-xl text-gray-900 mt-1">{value}</span>
    </div>
  );
}

export default App;
