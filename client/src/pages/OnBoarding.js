import Nav from '../components/Nav'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const OnBoarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "31",
        dob_month: "12",
        dob_year: new Date().getFullYear().toString(),
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url: "",
        about: "",
        matches: [],
        location: "",
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
            const response = await axios.put('http://localhost:8000/user', {formData})
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
      
        if (name === 'dob_day' || name === 'dob_month') {
          // Parse the field value to an integer
          const intValue = parseInt(fieldValue, 10);
      
          // Check if it's a valid number (not NaN) and greater than 0
          if (!isNaN(intValue) && intValue > 0) {
            // Restrict date values for day and month
            if (name === 'dob_day' && (intValue < 1 || intValue > 31)) {
              return;
            }
            if (name === 'dob_month' && (intValue < 1 || intValue > 12)) {
              return;
            }
      
            // Update the state with the parsed integer value
            setFormData((prevState) => ({
              ...prevState,
              [name]: intValue.toString(),
            }));
          } else {
            // Handle invalid input (non-numeric characters and 0)
            setFormData((prevState) => ({
              ...prevState,
              [name]: '',
            }));
          }
        } else if (name === 'dob_year') {
          // Parse the field value to an integer
          const intValue = parseInt(fieldValue, 10);
      
          // Check if it's a valid number (not NaN) and within the desired range
          if (!isNaN(intValue) && intValue >= 1900 && intValue <= new Date().getFullYear()) {
            // Update the state with the parsed integer value
            setFormData((prevState) => ({
              ...prevState,
              [name]: intValue.toString(),
            }));
          } else {
            // Handle invalid input (non-numeric characters, 0, or values outside the range)
            setFormData((prevState) => ({
              ...prevState,
              [name]: '',
            }));
          }
        } else if (name === 'first_name') {
            // Allow an empty first name
            if (fieldValue === '') {
              setFormData((prevState) => ({
                ...prevState,
                [name]: fieldValue,
              }));
            } else if (!/^[A-Za-z]+$/.test(fieldValue)) {
              // Restrict first name to alphabets only
              return;
            } else {
              // Update the state with the alphabetic value
              setFormData((prevState) => ({
                ...prevState,
                [name]: fieldValue,
              }));
            }
          } else {
            // For other inputs (not date of birth or first name), update the state normally
            setFormData((prevState) => ({
              ...prevState,
              [name]: fieldValue,
            }));
          }
        };
      
      
      
      
      

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

                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>
                        <label>Age</label>
                        <input
                                id="age"
                                type="number"
                                name="age"
                                placeholder='28'
                                required={true}
                                value={formData.age}
                                onChange={handleChange}
                            />

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

                            <label htmlFor="url">Profile Photo</label>
                            <input
                                type="url"
                                name="url"
                                id="url"        
                                placeholder='image link'
                                onChange={handleChange}
                                required={true}
                            />
                            <div className="photo-container">
                                {formData.url && <img src={formData.url} alt="profile pic preview"/>}
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