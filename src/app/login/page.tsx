'use client'

import { useState } from 'react'
import { Barlow } from 'next/font/google'
import styles from './login.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import {jwtDecode} from 'jwt-decode'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface DecodedToken {
  id: string;
  email: string;
  fullname: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://65.2.9.76:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token
        localStorage.setItem('token', token)
        
        const decodedToken = jwtDecode<DecodedToken>(token)
        localStorage.setItem('fullname', decodedToken.fullname)
        
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <div className={`${styles.container} ${barlow.className}`}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome to <span className={styles.highlight}>Workflow</span>!</h1>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
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
                placeholder="Password"
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
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account? <a href="/register">Create new account</a>
        </p>
      </div>
    </div>
  )
}
