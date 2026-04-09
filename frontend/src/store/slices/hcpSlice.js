import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { hcpAPI } from '../../services/api'

export const searchHCPs = createAsyncThunk(
  'hcp/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await hcpAPI.search(query)
      return response.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Search failed')
    }
  }
)

export const fetchAllHCPs = createAsyncThunk(
  'hcp/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await hcpAPI.list()
      return response.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Failed to fetch HCPs')
    }
  }
)

const hcpSlice = createSlice({
  name: 'hcp',
  initialState: {
    allHCPs: [],
    searchResults: [],
    selectedHCP: null,
    isSearching: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    selectHCP: (state, action) => {
      state.selectedHCP = action.payload
      state.searchResults = []
    },
    clearSelectedHCP: (state) => {
      state.selectedHCP = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchHCPs.pending, (state) => {
        state.isSearching = true
        state.error = null
      })
      .addCase(searchHCPs.fulfilled, (state, action) => {
        state.isSearching = false
        state.searchResults = action.payload
      })
      .addCase(searchHCPs.rejected, (state, action) => {
        state.isSearching = false
        state.error = action.payload
        state.searchResults = []
      })
      .addCase(fetchAllHCPs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllHCPs.fulfilled, (state, action) => {
        state.isLoading = false
        state.allHCPs = action.payload
      })
      .addCase(fetchAllHCPs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { selectHCP, clearSelectedHCP, clearSearchResults, clearError } = hcpSlice.actions
export default hcpSlice.reducer
