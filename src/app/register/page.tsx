'use client'

import { useState } from 'react'
import { Barlow } from 'next/font/google'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from './register.module.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RegisterPage() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://65.2.9.76:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data.message);
        // Redirect to login page
        window.location.href = '/login';
      } else {
        const errorData = await response.text();
        console.error('Registration failed:', errorData);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle network errors or other exceptions
    }
  };
  

  return (
    <div className={`${styles.container} ${barlow.className}`}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>
          Join <span className={styles.highlight}>Workflow</span>!
        </h1>
       
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
           
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            
            <div className={styles.passwordInput}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              <span 
                className={styles.eyeIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>
          <button type="submit" className={styles.signupButton}>Sign Up</button>
        </form>
        <p className={styles.loginPrompt}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}
