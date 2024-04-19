// import React, { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '../../fbconfig';
// import { useNavigate } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';

// import './Index.css'; // Import CSS file

// const Index = () => {
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (!email) {
//       setError('Please enter your email.');
//       return;
//     }
//     if (!password) {
//       setError('Please enter your password.');
//       return;
//     }

//     setLoading(true); // Show loading spinner

//     const formattedEmail = email.includes('@') ? email : email + '@nwmissouri.edu';

//     signInWithEmailAndPassword(auth, formattedEmail, password)
//     .then(async (userCredential) => {
//       const user = userCredential.user;
//       const docSnap = await getDoc(doc(firestore, 'users', user.uid));
  
//       if (docSnap.exists()) {
//         const userData = docSnap.data();
//         if (userData.disabled) {
//           setError('Your account is disabled.');
//           return; // Exit early if the account is disabled
//         }
  
//         switch (userData.role) {
//           case 'admin':
//             navigate('/schools');
//             break;
//           case 'faculty':
//             navigate('/schools');
//             break;
//           case 'super-admin':
//             navigate('/superadmin');
//             break;
//           default:
//             navigate('/');
//             break;
//         }
//       } else {
//         setError('Incorrect email or password.');
//       }
//     })
//     .catch((error) => {
//       console.error('Error signing in:', error);
//       setError('Incorrect email or password.');
//     })
//     .finally(() => {
//       setLoading(false); // Hide loading spinner
//     });
  
//   };

//   return (
    
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           margin: '-8px',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnwmsutower.jpeg?alt=media&token=e78db4b9-b3b1-4042-8acb-01957dded691")',
//           backgroundSize: '100% 100%',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: '#ffffff',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           <div style={{ textAlign: 'center' }}>
//           <img 
//             src="https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnw.jpg?alt=media&token=ec52af42-4938-4fba-ae36-88939fb1fef6"
//             alt="Northwest University" 
//             style={{
//              maxWidth: '400px',
//              maxHeight: '400px',
//              borderRadius: '50%',
//           }} 
//             />
//             <h1>Perfomatrics for School Evaluation</h1>
//             <h2 style={{ color: 'black' }}>Northwest Missouri State University</h2>
//             <h3>Sign in</h3>
//           </div>

//           <p>Sign in using your organizational credentials</p>
//           {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

//           <input
//             type="email"
//             placeholder="Email"
//             className="form-control mb-3"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{
//               width: '100%',
//               padding: '10px',
//               marginBottom: '15px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               boxSizing: 'border-box',
//               gap: '10px',
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="form-control mb-3"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={{
//               width: '100%',
//               padding: '10px',
//               marginBottom: '15px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               boxSizing: 'border-box',
//             }}
//           />
//           <button
//             type="submit"
//             className="btn btn-primary"
//             style={{
//               width: '100%',
//               padding: '10px',
//               backgroundColor: '#4caf50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               position: 'relative', // Added for positioning the spinner
//             }}
//             onClick={handleLogin}
//             disabled={loading} // Disable button when loading
//           >
//             Sign in
//           </button>
//           <div className="spinner-container" style={{ display: loading ? 'flex' : 'none' }}>
//           <div className="spinner" />
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;


// import React, { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '../../fbconfig';
// import { useNavigate } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';

// import './Index.css'; // Import CSS file

// const Index = () => {
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (!email) {
//       setError('Please enter your email.');
//       return;
//     }
//     if (!password) {
//       setError('Please enter your password.');
//       return;
//     }

//     setLoading(true); // Show loading state

//     const formattedEmail = email.includes('@') ? email : email + '@nwmissouri.edu';


//     signInWithEmailAndPassword(auth, formattedEmail, password)
//     .then(async (userCredential) => {
//       const user = userCredential.user;
//       const docSnap = await getDoc(doc(firestore, 'users', user.uid));
  
//       if (docSnap.exists()) {
//         const userData = docSnap.data();
//         if (userData.disabled) {
//           console.log('User account is disabled.'); // Print message indicating user account is disabled
//           // You may choose to redirect or display an error message to the user
//           setError('User account is disabled.'); 
          
//         } else {
//           switch (userData.role) {
//             case 'admin':
//               navigate('/admin');
//               break;
//             case 'faculty':
//               navigate('/faculty');
//               break;
//             case 'super-admin':
//               navigate('/superadmin');
//               break;
//             default:
//               navigate('/');
//               break;
//           }
//         }
//       } else {
//         setError('Incorrect email or password.');
//       }
//     })
//     .catch((error) => {
//       console.error('Error signing in:', error);
//       setError('Incorrect email or password.');
//     })
//     .finally(() => {
//       setLoading(false); // Hide loading state
//     });
//   };

//   return (
//     <div style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnwmsutower.jpeg?alt=media&token=e78db4b9-b3b1-4042-8acb-01957dded691")',backgroundSize:'cover'}}>
//     <div className="container-fluid d-flex vh-100">
//       <div className="row flex-grow-1 justify-content-center align-items-center" >
//         <div className="col-md-6"  style={{ width: '600px', height: '600px', alignItems:'right' }}>
//           <div className="card" style={{ width: '600px', height: '600px', alignItems:'right',boxShadow:'5px 5px 20px 20px ' }}>
//             <div className="card-body">
//               <div className="text-center">
//                 <img
//                   src="https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnw.jpg?alt=media&token=ec52af42-4938-4fba-ae36-88939fb1fef6"
//                   alt="Northwest University"
//                   className="mb-3 rounded-circle"
//                   style={{ maxWidth: '200px', maxHeight: '200px' }}
//                 />
//                 <h1>Perfomatrics for School Evaluation</h1>
//                 <h2 className="mb-3">Northwest Missouri State University</h2>
//                 <h3 className="mb-4">Sign in</h3>
//               </div>

//               {error && <p className="error-message text-danger">{error}</p>}

//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="form-control mb-3"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="form-control mb-3"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="btn btn-primary btn-block"
//                 onClick={handleLogin}
//                 disabled={loading} // Disable button when loading
//               >
//                 {loading ? 'Loading...' : 'Sign in'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Index;



import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../fbconfig';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import './Index.css'; // Import CSS file

import BackgroundVideo from './nwmsuvideo.mp4';


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

    {/* <div className='vignette-overlay'></div> */}

    <video className="background-video" autoPlay muted loop>
        <source src={BackgroundVideo} type="video/mp4" />
    </video>

      {/* <div className="background"></div> */}

      <div className="login-form">
        {/* <img className="logo" src="https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Backgrounds%2Fnw.jpg?alt=media&token=ec52af42-4938-4fba-ae36-88939fb1fef6" alt="Northwest University" /> */}
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
