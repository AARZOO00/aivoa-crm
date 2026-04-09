import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { analyticsAPI } from '@/services/api'

export const fetchDashboard = createAsyncThunk('analytics/dashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await analyticsAPI.dashboard()
    return res.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.detail || 'Failed to load analytics')
  }
})

export const fetchHCPTimeline = createAsyncThunk('analytics/hcpTimeline', async (hcpId, { rejectWithValue }) => {
  try {
    const res = await analyticsAPI.hcpTimeline(hcpId)
    return res.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.detail || 'Failed to load timeline')
  }
})

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboard: null,
    hcpTimeline: null,
    isLoading: false,
    isTimelineLoading: false,
    error: null,
  },
  reducers: {
    clearTimeline: (state) => { state.hcpTimeline = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.isLoading = false; s.dashboard = a.payload })
      .addCase(fetchDashboard.rejected, (s, a) => { s.isLoading = false; s.error = a.payload })
      .addCase(fetchHCPTimeline.pending, (s) => { s.isTimelineLoading = true; s.error = null })
      .addCase(fetchHCPTimeline.fulfilled, (s, a) => { s.isTimelineLoading = false; s.hcpTimeline = a.payload })
      .addCase(fetchHCPTimeline.rejected, (s, a) => { s.isTimelineLoading = false; s.error = a.payload })
  },
})

export const { clearTimeline } = analyticsSlice.actions
export default analyticsSlice.reducer