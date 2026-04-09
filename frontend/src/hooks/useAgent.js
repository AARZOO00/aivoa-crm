import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendAgentMessage, addUserMessage, clearChat } from '@/store/slices/agentSlice'

export function useAgent() {
  const dispatch = useDispatch()
  const { messages, isLoading, error, sessionId, lastToolUsed } = useSelector((s) => s.agent)

  const sendMessage = useCallback(
    async (text, interactionId = null) => {
      if (!text?.trim()) return
      dispatch(addUserMessage(text.trim()))
      await dispatch(sendAgentMessage({ message: text.trim(), interactionId }))
    },
    [dispatch]
  )

  const resetChat = useCallback(() => dispatch(clearChat()), [dispatch])

  return { messages, isLoading, error, sessionId, lastToolUsed, sendMessage, resetChat }
}