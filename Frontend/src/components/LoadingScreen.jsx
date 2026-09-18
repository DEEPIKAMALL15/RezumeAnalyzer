import React, { useState, useEffect } from 'react'
import './LoadingScreen.scss'

const DEFAULT_STEPS = [
    "Analyzing target job requirements & role specifications...",
    "Scanning profile skills, experience, and key competencies...",
    "Synthesizing high-impact technical & behavioral questions...",
    "Drafting tailored model answers & evaluation criteria...",
    "Constructing your day-by-day interview preparation roadmap..."
]

const LoadingScreen = ({ 
    title = "Generating Your Interview Strategy", 
    subtitle = "Our AI is crafting a tailored preparation blueprint for your dream role",
    steps = DEFAULT_STEPS,
    fullScreen = true
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    useEffect(() => {
        if (!steps || steps.length <= 1) return

        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => (prev + 1) % steps.length)
        }, 3200)

        return () => clearInterval(interval)
    }, [steps])

    return (
        <div className={`loading-container ${fullScreen ? 'loading-container--fullscreen' : ''}`}>
            <div className="loading-card">
                {/* Glowing AI Orbital Orb */}
                <div className="ai-orb">
                    <div className="ai-orb__core">
                        <svg className="ai-orb__sparkle" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <div className="ai-orb__ring ai-orb__ring--1"></div>
                    <div className="ai-orb__ring ai-orb__ring--2"></div>
                </div>

                <div className="loading-content">
                    <h2 className="loading-title">{title}</h2>
                    <p className="loading-subtitle">{subtitle}</p>

                    {/* Animated Step Indicator */}
                    <div className="loading-step-box">
                        <div className="loading-spinner-mini"></div>
                        <span className="loading-step-text" key={currentStepIndex}>
                            {steps[currentStepIndex]}
                        </span>
                    </div>

                    {/* Progress Track */}
                    <div className="loading-progress-track">
                        <div className="loading-progress-bar"></div>
                    </div>

                    <span className="loading-hint">This usually takes about 15-25 seconds</span>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen
