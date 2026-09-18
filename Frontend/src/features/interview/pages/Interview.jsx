import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen.jsx'

const NAV_ITEMS = [
    { 
        id: 'technical', 
        label: 'Technical Questions', 
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) 
    },
    { 
        id: 'behavioral', 
        label: 'Behavioral Questions', 
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) 
    },
    { 
        id: 'roadmap', 
        label: 'Road Map', 
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) 
    },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer's Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Structured Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getResumePdf, downloadingPdf, fetchError } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    if (loading) {
        return (
            <LoadingScreen 
                title="Loading Interview Blueprint"
                subtitle="Organizing technical questions, behavioral insights, and day-by-day roadmap..."
                steps={[
                    "Retrieving evaluation benchmarks...",
                    "Loading structured question bank...",
                    "Assembling interview readiness metrics..."
                ]}
            />
        )
    }

    if (!report) {
        return (
            <div className='interview-page'>
                <div className='not-found-card'>
                    <h2>Interview Plan Not Found</h2>
                    <p>{fetchError || "The requested strategy report could not be located or may have been deleted."}</p>
                    <button onClick={() => navigate('/')} className='button primary-button'>
                        &larr; Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            {/* Top Back Nav */}
            <div className='interview-topbar'>
                <button onClick={() => navigate('/')} className='back-btn'>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Back to Dashboard</span>
                </button>
                <div className='topbar-title'>
                    <h1>{report.title || 'Role Interview Strategy'}</h1>
                </div>
            </div>

            <div className='interview-layout'>
                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        disabled={downloadingPdf}
                        className='button primary-button resume-download-btn' 
                    >
                        {downloadingPdf ? (
                            <>
                                <span className='btn-spinner'></span>
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                <svg height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm9 4H3v-2h18v2z" />
                                </svg>
                                <span>Download Resume</span>
                            </>
                        )}
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <div>
                                    <h2>Technical Questions</h2>
                                    <p className='content-header__desc'>Targeted questions testing foundational and role-specific competencies</p>
                                </div>
                                <span className='content-header__count'>
                                    {report.technicalQuestions ? report.technicalQuestions.length : 0} questions
                                </span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions && report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <div>
                                    <h2>Behavioral Questions</h2>
                                    <p className='content-header__desc'>Situational and leadership questions with STAR-framework responses</p>
                                </div>
                                <span className='content-header__count'>
                                    {report.behavioralQuestions ? report.behavioralQuestions.length : 0} questions
                                </span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions && report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <div>
                                    <h2>Preparation Road Map</h2>
                                    <p className='content-header__desc'>Structured day-by-day study and mock interview plan</p>
                                </div>
                                <span className='content-header__count'>
                                    {report.preparationPlan ? report.preparationPlan.length : 0}-day plan
                                </span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan && report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>
                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Profile Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className={`match-score__sub ${scoreColor}`}>
                            {report.matchScore >= 80 ? 'Strong match for this role' :
                             report.matchScore >= 60 ? 'Moderate match - review gaps' :
                             'Growth opportunity - study plan essential'}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Identified Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                report.skillGaps.map((gap, i) => (
                                    <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                        {gap.skill}
                                        <span className='severity-dot'></span>
                                    </span>
                                ))
                            ) : (
                                <span className='no-gaps-text'>No critical skill gaps identified!</span>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview