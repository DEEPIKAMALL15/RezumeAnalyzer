import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim() || !password) {
            setError("Please fill in both email and password")
            return
        }

        const res = await handleLogin({ email, password })
        if (res?.success) {
            navigate('/')
        } else {
            setError(res?.error || "Invalid credentials. Please try again.")
        }
    }

    if (loading) {
        return (
            <LoadingScreen 
                title="Signing In" 
                subtitle="Verifying credentials and preparing your dashboard..." 
                steps={["Authenticating credentials...", "Connecting to your profile..."]} 
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your interview strategy dashboard</p>
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
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button type="submit" className="button primary-button auth-submit-btn">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </main>
    )
}

export default Login