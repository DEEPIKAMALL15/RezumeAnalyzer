import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username.trim() || !email.trim() || !password) {
            setError("Please fill in all fields")
            return
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long")
            return
        }

        const res = await handleRegister({ username, email, password })
        if (res?.success) {
            navigate("/")
        } else {
            setError(res?.error || "Registration failed. Please try again.")
        }
    }

    if (loading) {
        return (
            <LoadingScreen 
                title="Creating Account" 
                subtitle="Setting up your interview intelligence profile..." 
                steps={["Creating your secure profile...", "Preparing your personal workspace..."]} 
            />
        )
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <div className="auth-brand">
                    <div className="brand-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <h1>Create Account</h1>
                    <p>Start your AI-powered interview preparation journey</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value); setError("") }}
                            value={username}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value); setError("") }}
                            value={email}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value); setError("") }}
                            value={password}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit" className="button primary-button auth-submit-btn">
                        Create Account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register