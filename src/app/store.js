import { configureStore } from '@reduxjs/toolkit';
import dataSlice from '../features/data/dataSlice';

// configurazione dello store di redux toolkit, libreria che permette di lavorare con redux in modo specifico
export const store = configureStore({
  // in questo caso verrà usato solamente uno slice, chiamato in modo generico data
  reducer: {
    data: dataSlice,
  },
});
