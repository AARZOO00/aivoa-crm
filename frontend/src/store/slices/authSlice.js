import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const DEMO_USERS = {
  'admin@aivoa.com':   { id: 1, name: 'Admin User',    role: 'Admin',   avatar: 'AU', territory: 'Global',    email: 'admin@aivoa.com' },
  'manager@aivoa.com': { id: 2, name: 'Sarah Manager', role: 'Manager', avatar: 'SM', territory: 'Northeast', email: 'manager@aivoa.com' },
  'rep@aivoa.com':     { id: 3, name: 'Alex Rep',      role: 'Rep',     avatar: 'AR', territory: 'Midwest',   email: 'rep@aivoa.com' },
  'msl@aivoa.com':     { id: 4, name: 'Dr. MSL User',  role: 'MSL',     avatar: 'MU', territory: 'West Coast', email: 'msl@aivoa.com' },
}

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('aivoa_token')
      const userEmail = localStorage.getItem('aivoa_user_email')
      if (!token) return null
      return DEMO_USERS[userEmail] || { id: 1, name: 'Sales Rep', role: 'Rep', avatar: 'SR', territory: 'Northeast', email: userEmail }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (!email || !password) throw new Error('Email and password are required')
      await new Promise(r => setTimeout(r, 800)) // simulate network
      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem('aivoa_token', token)
      localStorage.setItem('aivoa_user_email', email)
      const user = DEMO_USERS[email] || { id: 99, name: email.split('@')[0], role: 'Rep', avatar: email[0].toUpperCase(), territory: 'Territory', email }
      return user
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate Google OAuth flow (replace with real Google OAuth in production)
      await new Promise(r => setTimeout(r, 1000))
      const googleUser = { id: 10, name: 'Google User', role: 'Rep', avatar: 'GU', territory: 'Northeast', email: 'google@gmail.com', photo: null }
      localStorage.setItem('aivoa_token', btoa(`google:${Date.now()}`))
      localStorage.setItem('aivoa_user_email', googleUser.email)
      return googleUser
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loginAsDemo = createAsyncThunk(
  'auth/loginAsDemo',
  async (role, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 400))
      const emailMap = { Admin: 'admin@aivoa.com', Manager: 'manager@aivoa.com', Rep: 'rep@aivoa.com', MSL: 'msl@aivoa.com' }
      const email = emailMap[role] || 'rep@aivoa.com'
      localStorage.setItem('aivoa_token', btoa(`${email}:${Date.now()}`))
      localStorage.setItem('aivoa_user_email', email)
      return DEMO_USERS[email]
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('aivoa_token'),
    isLoading: false,
    googleLoading: false,
    demoLoading: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null; state.isAuthenticated = false; state.error = null
      localStorage.removeItem('aivoa_token'); localStorage.removeItem('aivoa_user_email')
    },
    setUser: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    clearAuthError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,    (s) => { s.isLoading = true;  s.error = null })
      .addCase(loginUser.fulfilled,  (s, a) => { s.isLoading = false; s.user = a.payload; s.isAuthenticated = true })
      .addCase(loginUser.rejected,   (s, a) => { s.isLoading = false; s.error = a.payload })
      .addCase(loginWithGoogle.pending,    (s) => { s.googleLoading = true; s.error = null })
      .addCase(loginWithGoogle.fulfilled,  (s, a) => { s.googleLoading = false; s.user = a.payload; s.isAuthenticated = true })
      .addCase(loginWithGoogle.rejected,   (s, a) => { s.googleLoading = false; s.error = a.payload })
      .addCase(loginAsDemo.pending,    (s, a) => { s.demoLoading = a.meta.arg })
      .addCase(loginAsDemo.fulfilled,  (s, a) => { s.demoLoading = null; s.user = a.payload; s.isAuthenticated = true })
      .addCase(loginAsDemo.rejected,   (s, a) => { s.demoLoading = null; s.error = a.payload })
      .addCase(fetchCurrentUser.fulfilled, (s, a) => { if (a.payload) { s.user = a.payload; s.isAuthenticated = true } })
      .addCase(fetchCurrentUser.rejected,  (s) => { s.isAuthenticated = false; localStorage.removeItem('aivoa_token') })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer