import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IConsent {
  id: string;
  name: string;
  language: string;
  agree: boolean;
  record: string;
}

const initialState = {
  consent: {
    id: '',
    name: '',
    language: '',
    agree: false,
    record: '',
  },
};

export const consentSlice = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    setConsentProp: (state, actions: PayloadAction<IConsent>) => {
      state.consent = actions.payload;
    },
  },
});

export const { setConsentProp } = consentSlice.actions;

export default consentSlice.reducer;
