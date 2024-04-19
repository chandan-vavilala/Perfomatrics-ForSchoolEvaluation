import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../fbconfig';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import './Index.css'; // Import CSS file


const Index = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true); // Show loading spinner

    const formattedEmail = email.includes('@') ? email : email + '@nwmissouri.edu';

    signInWithEmailAndPassword(auth, formattedEmail, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const docSnap = await getDoc(doc(firestore, 'users', user.uid));
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.disabled) {
          setError('Your account is disabled.');
          return; // Exit early if the account is disabled
        }
  
        switch (userData.role) {
          case 'admin':
            navigate('/schools');
            break;
          case 'faculty':
            navigate('/schools');
            break;
          case 'super-admin':
            navigate('/superadmin');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        setError('Incorrect email or password.');
      }
    })
    .catch((error) => {
      console.error('Error signing in:', error);
      setError('Incorrect email or password.');
    })
    .finally(() => {
      setLoading(false); // Hide loading spinner
    });
  
  };

  return (
    <div className="login-container">

    

    <video className="background-video" autoPlay muted loop>
    <source src="https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnwmsuvideo.mp4?alt=media&token=deaeaa14-a1c3-4b9a-bd45-c6d91776f1f2" type="video/mp4"/>
    </video>

   

      <div className="login-form">
         <img className="logo" src="https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnwmsufulltrans.png?alt=media&token=595227a2-0dd6-4c8d-910a-a9e423124a88" alt="Northwest University" />
        <h1 className="title">Perfomatrics for School Evaluation</h1>
        <h2 className="subtitle">Northwest Missouri State University</h2>
        <h3 className="signin-label">Sign in</h3>
        
            <p className="instruction">Sign in using your organizational credentials</p>
            {error && <p className="error-message">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="signin-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            {loading && <div className="spinner"></div>}
    </div>
    </div>
  );
};

export default Index;
