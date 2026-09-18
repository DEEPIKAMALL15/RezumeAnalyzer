import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [downloadingPdf, setDownloadingPdf] = useState(false)
    const [fetchError, setFetchError] = useState(null)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setFetchError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response?.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }
            throw new Error("Invalid report response")
        } catch (error) {
            console.error("Generate report error:", error)
            setFetchError(error.response?.data?.message || error.message || "Failed to generate interview report")
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        setLoading(true)
        setFetchError(null)
        try {
            const response = await getInterviewReportById(id)
            if (response?.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }
            throw new Error("Report not found")
        } catch (error) {
            console.error("Get report error:", error)
            setFetchError(error.response?.data?.message || "Failed to fetch interview report")
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setFetchError(null)
        try {
            const response = await getAllInterviewReports()
            if (response?.interviewReports) {
                setReports(response.interviewReports)
                return response.interviewReports
            }
            return []
        } catch (error) {
            console.error("Get reports error:", error)
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setDownloadingPdf(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `Tailored_Resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            return true
        } catch (error) {
            console.error("Resume download error:", error)
            alert("Could not generate resume PDF at this time. Please try again.")
            return false
        } finally {
            setDownloadingPdf(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { 
        loading, 
        report, 
        reports, 
        generateReport, 
        getReportById, 
        getReports, 
        getResumePdf,
        downloadingPdf,
        fetchError 
    }
}