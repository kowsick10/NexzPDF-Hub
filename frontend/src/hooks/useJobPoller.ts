import { useState, useCallback } from 'react'
import { pollJob } from '../services/api'
import type { JobResult } from '../types'

interface UseJobPollerReturn {
  job: JobResult | null
  polling: boolean
  pollError: string | null
  startPolling: (jobId: string) => Promise<JobResult>
  reset: () => void
}

export function useJobPoller(): UseJobPollerReturn {
  const [job, setJob] = useState<JobResult | null>(null)
  const [polling, setPolling] = useState(false)
  const [pollError, setPollError] = useState<string | null>(null)

  const startPolling = useCallback(async (jobId: string): Promise<JobResult> => {
    setPolling(true)
    setPollError(null)
    try {
      const result = await pollJob(jobId, (j) => setJob(j))
      setJob(result)
      if (result.status === 'failed') {
        setPollError(result.errorMessage || 'Processing failed.')
      }
      return result
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Processing failed.'
      setPollError(msg)
      throw e
    } finally {
      setPolling(false)
    }
  }, [])

  const reset = useCallback(() => {
    setJob(null)
    setPollError(null)
  }, [])

  return { job, polling, pollError, startPolling, reset }
}
