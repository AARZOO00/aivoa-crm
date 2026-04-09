import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { interactionAPI } from '../../services/api'

const initialFormData = {
  hcp_id: null,
  hcp_name: '',
  interaction_type: 'Meeting',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  attendees: [],
  topics_discussed: '',
  materials_shared: [],
  samples_distributed: [],
  sentiment: 'Neutral',
  outcomes: '',
  follow_up_actions: '',
  ai_summary: '',
}

export const createInteraction = createAsyncThunk(
  'interaction/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.create(data)
      return response.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Failed to create interaction')
    }
  }
)

export const fetchInteractions = createAsyncThunk(
  'interaction/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.list()
      return response.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Failed to fetch interactions')
    }
  }
)

const interactionSlice = createSlice({
  name: 'interaction',
  initialState: {
    formData: { ...initialFormData },
    interactions: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
    aiSuggestions: [],
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload
      state.formData[field] = value
    },
    autoFillFromAI: (state, action) => {
      const data = action.payload
      if (!data) return
      if (data.hcp_name) state.formData.hcp_name = data.hcp_name
      if (data.hcp_id) state.formData.hcp_id = data.hcp_id
      if (data.interaction_type) state.formData.interaction_type = data.interaction_type
      if (data.date) state.formData.date = data.date
      if (data.time) state.formData.time = data.time
      if (data.attendees?.length) state.formData.attendees = data.attendees
      if (data.topics_discussed) state.formData.topics_discussed = data.topics_discussed
      if (data.materials_shared?.length) state.formData.materials_shared = data.materials_shared
      if (data.samples_distributed?.length) state.formData.samples_distributed = data.samples_distributed
      if (data.sentiment) state.formData.sentiment = data.sentiment
      if (data.outcomes) state.formData.outcomes = data.outcomes
      if (data.follow_up_actions) state.formData.follow_up_actions = data.follow_up_actions
      if (data.ai_summary) state.formData.ai_summary = data.ai_summary
    },
    setAISuggestions: (state, action) => {
      state.aiSuggestions = action.payload || []
    },
    setSentimentFromAI: (state, action) => {
      const { sentiment } = action.payload
      if (['Positive', 'Neutral', 'Negative'].includes(sentiment)) {
        state.formData.sentiment = sentiment
      }
    },
    addAttendee: (state, action) => {
      if (action.payload && !state.formData.attendees.includes(action.payload)) {
        state.formData.attendees.push(action.payload)
      }
    },
    removeAttendee: (state, action) => {
      state.formData.attendees = state.formData.attendees.filter(a => a !== action.payload)
    },
    addMaterial: (state, action) => {
      state.formData.materials_shared.push(action.payload)
    },
    removeMaterial: (state, action) => {
      state.formData.materials_shared = state.formData.materials_shared.filter((_, i) => i !== action.payload)
    },
    addSample: (state, action) => {
      state.formData.samples_distributed.push(action.payload)
    },
    removeSample: (state, action) => {
      state.formData.samples_distributed = state.formData.samples_distributed.filter((_, i) => i !== action.payload)
    },
    resetForm: (state) => {
      state.formData = { ...initialFormData, date: new Date().toISOString().split('T')[0] }
      state.aiSuggestions = []
      state.error = null
      state.successMessage = null
    },
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    applySuggestion: (state, action) => {
      const suggestion = action.payload
      if (suggestion) {
        state.formData.follow_up_actions += (state.formData.follow_up_actions ? '\n' : '') + suggestion
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInteraction.pending, (state) => {
        state.isSaving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.isSaving = false
        state.successMessage = `Interaction #${action.payload.id} logged successfully!`
        state.interactions.unshift(action.payload)
        state.formData = { ...initialFormData, date: new Date().toISOString().split('T')[0] }
        state.aiSuggestions = []
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.payload
      })
      .addCase(fetchInteractions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.isLoading = false
        state.interactions = action.payload
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  updateFormField,
  autoFillFromAI,
  setAISuggestions,
  setSentimentFromAI,
  addAttendee,
  removeAttendee,
  addMaterial,
  removeMaterial,
  addSample,
  removeSample,
  resetForm,
  clearMessages,
  applySuggestion,
  clearError,
} = interactionSlice.actions

export default interactionSlice.reducer
