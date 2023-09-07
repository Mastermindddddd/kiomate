import Nav from '../components/Nav'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const OnBoarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "31",
        dob_month: "12",
        dob_year: new Date().getFullYear().toString(),
        age: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        image: "",
        about: "",
        matches: [],
        location: "",
        show_users: false,
        hobbies: "",
        interests: "",
        idealdate: "",
        qualities: "",
        dealbreaker: ""

    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        try {
            const response = await axios.put('https://dark-ruby-mackerel-gown.cyclic.app/user', {formData})
            console.log(response)
            const success = response.status === 200
            if (success) navigate('/Dashboard')
        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
      const { type, name, value, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;
    
      if (fieldValue === '') {
        setError(null); // Clear the error when the input is empty
      }
    
      if (name === 'dob_day' || name === 'dob_month') {
        // Parse the field value to an integer
        const intValue = parseInt(fieldValue, 10);
    
        // Check if it's a valid number (not NaN) and greater than 0 and less than 32 for day, 13 for month
        if (!isNaN(intValue) && intValue > 0 && intValue < 32) {
          // Update the state with the parsed integer value
          setFormData((prevState) => ({
            ...prevState,
            [name]: intValue.toString(),
          }));
        } else {
          // Handle invalid input (non-numeric characters, 0, or values outside the range)
          setError('Enter a valid day or month');
        }
      } else if (name === 'dob_year' || name === 'age') {
        // Parse the field value to an integer
        const intValue = parseInt(fieldValue, 10);
    
        // Check if it's a valid number (not NaN) and within the desired range
        if (!isNaN(intValue) && intValue.toString().length <= 4) {
          // Update the state with the parsed integer value
          setFormData((prevState) => ({
            ...prevState,
            [name]: intValue.toString(),
          }));
        } else {
          // Handle invalid input (non-numeric characters, or values with more than 4 digits)
          setError('Enter a valid ' + (name === 'dob_year' ? 'year' : 'age'));
        }
      } else if (name === 'first_name') {
        // Allow an empty first name
        setFormData((prevState) => ({
          ...prevState,
          [name]: fieldValue,
        }));
      } else {
        // For other inputs (not date of birth or first name), update the state normally
        setFormData((prevState) => ({
          ...prevState,
          [name]: fieldValue,
        }));
      }
    };
    
      
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate years dropdown options from the current year to 100 years ago
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [image, setImage] = useState();
  const onInputChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  }
      
      
      

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

<label htmlFor="dob_day">Birthday</label>
        <div className="multiple-input-container">
          <select
            id="dob_day"
            name="dob_day"
            required={true}
            value={formData.dob_day}
            onChange={handleChange}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            id="dob_month"
            name="dob_month"
            required={true}
            value={formData.dob_month}
            onChange={handleChange}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            id="dob_year"
            name="dob_year"
            required={true}
            value={formData.dob_year}
            onChange={handleChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <label>Age</label>
        <select
          id="age"
          name="age"
          required={true}
          value={formData.age}
          onChange={handleChange}
        >
          {years.map((year) => (
            <option key={year} value={currentYear - year}>
              {currentYear - year}
            </option>
          ))}
        </select>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <label htmlFor="show-gender">Show Gender on my Profile</label>

                        <input
                            id="show-gender"
                            type="checkbox"
                            name="show_gender"
                            onChange={handleChange}
                            checked={formData.show_gender}
                        />

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>
                        <label htmlFor="hobbies">Hobbies</label>
                        <input
                            id="hobbies"
                            type="text"
                            name="hobbies"
                            required={true}
                            placeholder="Traveling, Cooking, Reading, Hiking..."
                            value={formData.hobbies}
                            onChange={handleChange}
                        />

                        <label htmlFor="interests">Interests</label>
                        <input
                            id="interests"
                            type="text"
                            name="interests"
                            required={true}
                            placeholder="Sports, Arts and Culture, Outdoors..."
                            value={formData.interests}
                            onChange={handleChange}
                        />

                        <label htmlFor='location'>Location</label>
                        <input
                            id="location"
                            type='text'
                            name='location'
                            required={true}
                            placeholder='Country, Province, City'
                            value={formData.location}
                            onChange={handleChange}
                            />
<div className='show-users'>
<label htmlFor="show-users">Show Me people from near my location</label>

<input
    id="show-users"
    type="checkbox"
    name="show_users"
    onChange={handleChange}
    checked={formData.show_users}
/>
</div>


                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I'm a passionate adventurer who loves exploring..."
                            value={formData.about}
                            onChange={handleChange}
                        />

                        <label htmlFor="date">What is your ideal Date?</label>
                        <input
                            id="idealdate"
                            type="text"
                            name="idealdate"
                            required={true}
                            placeholder="A sunset stroll on the beach, hand in hand..."
                            value={formData.idealdate}
                            onChange={handleChange}
                        />

                        <label htmlFor="qualities">What are the qualities you are looking for in a partner?</label>
                        <input
                            id="qualities"
                            type="text"
                            name="qualities"
                            required={true}
                            placeholder="I value honesty, trustworthiness..."
                            value={formData.qualities}
                            onChange={handleChange}
                        />

                            <label htmlFor="dealbreaker">What are your deal breakers in a relationship?</label>
                        <input
                            id="dealbreaker"
                            type="text"
                            name="dealbreaker"
                            required={true}
                            placeholder="controlling or manipulative behavior..."
                            value={formData.dealbreaker}
                            onChange={handleChange}
                        />
                         
                        <section>
                        <label htmlFor="image">Profile Photo</label>
                            <input
                                accept='image/*'
                                type="file"
                                name="image"
                                id="image"        
                                onChange={onInputChange}
                                required={true}
                            />
                            <div className="photo-container">
                                {formData.img && <img src={formData.img} alt="profile pic preview"/>}
                            </div>


                        </section>
                        
                        <input type="submit"/>
                    </section>

                   

                </form>
            </div>
        </>
    )
}
export default OnBoarding