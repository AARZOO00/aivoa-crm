import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { agentAPI } from '../../services/api'
import { v4 as uuidv4 } from 'uuid'
import { autoFillFromAI, setAISuggestions, setSentimentFromAI } from './interactionSlice'

export const sendAgentMessage = createAsyncThunk(
  'agent/sendMessage',
  async ({ message, interactionId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { sessionId } = getState().agent
      const response = await agentAPI.chat(message, sessionId, interactionId)
      const data = response.data

      // Auto-fill form if log_interaction tool was used
      if (data.tool_used === 'log_interaction' && data.data && Object.keys(data.data).length > 0) {
        dispatch(autoFillFromAI(data.data))
      }

      // Set AI suggestions if suggest_followup was used
      if (data.tool_used === 'suggest_followup' && data.data?.suggestions) {
        dispatch(setAISuggestions(data.data.suggestions))
      }

      // Update sentiment if analyze_sentiment was used
      if (data.tool_used === 'analyze_sentiment' && data.data?.sentiment) {
        dispatch(setSentimentFromAI({ sentiment: data.data.sentiment }))
      }

      return data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Failed to reach AI agent')
    }
  }
)

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    messages: [],
    sessionId: uuidv4(),
    isLoading: false,
    error: null,
    lastToolUsed: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = []
      state.sessionId = uuidv4()
      state.error = null
      state.lastToolUsed = null
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      })
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAgentMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendAgentMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastToolUsed = action.payload.tool_used
        state.messages.push({
          id: uuidv4(),
          role: 'assistant',
          content: action.payload.response,
          tool_used: action.payload.tool_used,
          data: action.payload.data,
          timestamp: new Date().toISOString(),
        })
      })
      .addCase(sendAgentMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.messages.push({
          id: uuidv4(),
          role: 'assistant',
          content: `⚠️ ${action.payload || 'Something went wrong. Please try again.'}`,
          tool_used: 'error',
          timestamp: new Date().toISOString(),
        })
      })
  },
})

export const { clearChat, addUserMessage, setError } = agentSlice.actions
export default agentSlice.reducer
export const clearAgentSession = clearChat;