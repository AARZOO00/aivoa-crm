import { configureStore } from '@reduxjs/toolkit'
import interactionReducer from './slices/interactionSlice'
import hcpReducer from './slices/hcpSlice'
import agentReducer from './slices/agentSlice'
import authReducer from './slices/authSlice'
import analyticsReducer from './slices/analyticsSlice'

const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    hcp: hcpReducer,
    agent: agentReducer,
    auth: authReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['interaction/create/fulfilled'],
      },
    }),
})

export default store
