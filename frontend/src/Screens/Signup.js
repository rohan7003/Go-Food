import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';

export default function Signup() {

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: ""   // ✅ changed from geolocation
  });

  let navigate = useNavigate();

  // 🔹 OPTIONAL: Get current location (auto-fill)
  const handleClick = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (res) => {

        let lat = res.coords.latitude;
        let long = res.coords.longitude;

        const response = await fetch("https://go-food-2-9v3n.onrender.com/api/auth/getlocation", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ latlong: { lat, long } })
        });

        const data = await response.json();

        setCredentials((prev) => ({
          ...prev,
          location: data.location   // ✅ fill input automatically
        }));

      });
    } catch (error) {
      alert("Location access denied. Please enter manually.");
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ NEW VALIDATION
    if (!credentials.location) {
      alert("Please enter your location");
      return;
    }

    try {
      console.log("SENDING:", credentials);
      const response = await fetch("https://go-food-2-9v3n.onrender.com/api/auth/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.location   // ✅ fixed
        })
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        localStorage.setItem('token', json.authToken);
        navigate("/login");
      } else {
        alert(json.error || "Signup failed");
      }

    } catch (error) {
      console.error(error);
      alert("Server error, please try again later");
    }
  };

  // 🔹 Input change
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg")',
      backgroundSize: 'cover',
      height: '100vh'
    }}>

      <Navbar />

      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>

          <div className="m-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name='name'
              value={credentials.name} onChange={onChange} />
          </div>

          <div className="m-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name='email'
              value={credentials.email} onChange={onChange} />
          </div>

          {/* ✅ MANUAL LOCATION INPUT */}
          <div className="m-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              placeholder="Enter your location manually"
              value={credentials.location}
              onChange={onChange}
            />
          </div>

          {/* ✅ OPTIONAL AUTO-FILL BUTTON */}
          <div className="m-3">
            <button type="button"
              onClick={handleClick}
              className="btn btn-success">
              Auto Detect Location (Optional)
            </button>
          </div>

          <div className="m-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control"
              name='password'
              value={credentials.password}
              onChange={onChange} />
          </div>

          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>

          <Link to="/login" className="m-3 btn btn-danger">
            Already a user
          </Link>

        </form>
      </div>
    </div>
  );
}