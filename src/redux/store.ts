import { configureStore } from '@reduxjs/toolkit';
import consentSlice from './slices/consentSlice';

export const store = configureStore({
  reducer: {
    consentStore: consentSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
