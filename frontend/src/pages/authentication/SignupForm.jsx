import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './SignupForm.css';

function SignupForm() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  };

    //Incase form has errors
  const validateForm = () => {
    const newErrors = [];
    
    if (formData.password !== formData.passwordConfirm) {
      newErrors.push("Passwords don't match");
    }
    
    if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Only pass email and password to signup, not the confirmation
      const { passwordConfirm, ...signupData } = formData;
      
      const result = await signup(signupData);
      if (result.success) {
        // Redirect to dashboard upon successful signup
        navigate('/');
      } else {
        setErrors(result.errors || ['Signup failed']);
      }
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              {errors.map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          <div className="form-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;