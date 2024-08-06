import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// importazione da util di generazione dati casuali. Le funzioni simulano un estrazione di dati, vengon oinvece generati dati casualmente
import {
    generateMines,
    generateOperations,
    generateMarketPrices,
    generateResourceManagement,
    generateWeatherData
  } from './../../utils/dataGenerator';

const initialState = {
    // data è un oggetto che a sua volta conterrà gli array. 
    // E' stata scelta questa modalità visto che i dati sono generati insieme e verranno sempre estratti insieme
    data: null,
    // variabile che gestisce lo stato dell'applicazione per la getione di schermate di caricamento e errore
    status:'idle',
    user:null,
    // gestione pagina dell'applicazione. al cambiare di page cambia la view, definita in HomePage.jsx
    page:1,
};

// estrazione dati asincrona. Genera casualmente dei dati. Simula un API
export const initData = createAsyncThunk(
  'data/initData',
  async () => {
    
    // attesa i n secondi - Simula il tempo necessario per il fetch di un API
    await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    
    // numero di miniere da generare. Da  questo dipendono anche i dati successivi
    const data = {}
    data.mines = generateMines();
    data.operations = generateOperations( data.mines);
    data.marketPrices = generateMarketPrices();
    data.resourceManagement = generateResourceManagement(data.mines);
    data.weatherData = generateWeatherData(data.mines);

    return data;

  }
); // fine funzione di estrazione dati initData

// simulazione login
export const login = createAsyncThunk(
  'data/login',
  async () => {
    
    // attesa i n secondi - Simula il tempo necessario per il fetch di un API
    await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    // assegnazione fittizia
    const data = { id:1,username:'Test'}
    return data;

  }
); // fine funzione di login

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
      // settaggio data non asincrono, usato se è presente già il data nel local storage
      setData: (state, action) => {
        state.data = action.payload;
      },

      // settaggio login non asincrono, usato se è presente già l'utente nel local storage
      setUser: (state, action) => {
        state.user = action.payload;
      },

      // settaggio pagina
      setPage: (state, action) => {
        state.page = action.payload;
      },
  
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    // gestione dei dati output della funzione di generazione dati
    builder
      .addCase(initData.pending, (state) => {
        // quando è in esecuzione status passa in loading
        state.status = 'loading';
      })
      .addCase(initData.fulfilled, (state, action) => {
        // quando la generazione è finita viene messo status in "idle"
        state.status = 'idle';
        // e viene assegnato il valore a data (conterrà tutti gli array con i dati)
        state.data = action.payload;
        // salvataggio dati in local storage
        localStorage.setItem("data",JSON.stringify(action.payload));
      }); // fine gestione initData

       // gestione dei dati output della funzione di generazione dati
    builder
      .addCase(login.pending, (state) => {
        // quando è in esecuzione status passa in loading
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        // quando la generazione è finita viene messo status in "idle"
        state.status = 'idle';
        // e viene assegnato il valore a user 
        state.user = action.payload;
        // salvataggio dati in local storage
        localStorage.setItem("user",JSON.stringify(action.payload));
      }); // fine gestione initData
  }, 

});

// esportazione azioni (setter)
export const { setData, setUser , setPage }  = dataSlice.actions;
// selettori delle variabili si stato
export const selectData = (state) => state.data.data;
export const selectStatus = (state) => state.data.status;
export const selectUser = (state) => state.data.user;
export const selectPage = (state) => state.data.page;

export default dataSlice.reducer;
