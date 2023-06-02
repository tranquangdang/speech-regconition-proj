import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IConsent {
  id: string;
  name: string;
  language: string;
  agree: boolean;
  record: string;
}

export const initialState = {
  consent: {
    id: '',
    name: '',
    language: '',
    agree: false,
    record: '',
  },
  consentList: [] as IConsent[],
  transcript: '',
};

export const consentSlice = createSlice({
  name: 'consent',
  initialState,
  reducers: {
    setConsentProp: (state, actions: PayloadAction<IConsent>) => {
      state.consent = actions.payload;
    },
    setConsentList: (state, actions: PayloadAction<IConsent>) => {
      state.consentList = [...state.consentList, actions.payload];
    },
    setTranscript: (state, actions: PayloadAction<string>) => {
      state.transcript = actions.payload;
    },
  },
});

export const { setConsentProp, setConsentList, setTranscript } =
  consentSlice.actions;

export default consentSlice.reducer;
