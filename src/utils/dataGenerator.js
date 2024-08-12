// generazione casuali dei valori

// Minerali possibili da estrarre
const mineralTypes = [
    {name:"Iridio",price:20000},
    {name:"Rame",price:3},
    {name:"Platino",price:3000},
    {name:"Oro",price:8000},
    {name:"Argento",price:70},
];

// data inizio e fine della quale generare i dati
const startDate = new Date(2000, 0, 2); 
const endDate = new Date(2023, 0, 2);

// settaggi modificabili per cambiare la base dalla quale vengono estratti i valori casuali
const settings = [
  {dimension:1,quantity:100,cost:1200,water:200,energy:100,waste:50},
  {dimension:2,quantity:500,cost:3000,water:1000,energy:1000,waste:500},
  {dimension:3,quantity:2000,cost:8000,water:5000,energy:3000,waste:1000},
] // fine settings

// data casuale presa tra due dati inserite come parametro
const randomDate = ( start , end ) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
} // fine randomDate

// la funzione servirà poi per calcolare i valori casuali. Prende un valore di base e restituisce un valore a partire dalla metà e al doppio. Un valore di 100 restituisce da 50 a 200
const randomValue = ( baseValue ) => {
    const start = baseValue / 2
    const end = baseValue + start
    // numero compreso tra start e end
    const value = Math.floor( Math.random() * ( end - start ) )  + start
    return value
} // fine randomValue

// calcolo autoamatico della temperatura - in base alla zona verranno impostate regole specifiche
const randomWeather = ( date , zone ) => {
    // temperatura e prcipitazioni
    let temperature
    let precipitation
    // zona 1 - zona arida
    if( zone === 1 ){
        temperature = Math.floor(Math.random() * 15 ) + 30
        const isRaining = Math.floor(Math.random() * 10 ) < 4 ? true : false
        precipitation = isRaining ? Math.floor(Math.random() * 30 ) + 5 : 0
    }else if( zone === 2 ){ //zona 2 temperata
        temperature = Math.floor(Math.random() * 30 ) 
        const isRaining = Math.floor(Math.random() * 10 ) < 7 ? true : false
        precipitation = isRaining ? Math.floor(Math.random() * 100 ) + 5 : 0
    }else{ //zona 3 fredda
        temperature = Math.floor(Math.random() * 15 ) - 10
        const isRaining = Math.floor(Math.random() * 10 ) < 7 ? true : false
        precipitation = isRaining ? Math.floor(Math.random() * 150 ) + 5 : 0
    }

    const tempDate = new Date( date )
    const month = tempDate.getMonth() + 1

    if( month >= 10 && month <= 1 ){
         temperature = temperature - Math.floor(Math.random() * 10 ) + 5
    }else if( month >= 6 && month <= 9  ){
        temperature = temperature + Math.floor(Math.random() * 10 ) + 5
    }

    return {temperature, precipitation}

}

// data casuale presa tra due dati inserite come parametro
const getMyIsoDate = (date) => {
  const tempDate = new Date(date);
  return tempDate.toISOString().split('T')[0];
} // fine randomDate

// generazione casuale n miniere
const generateMines = ( ) => {
    const n = 10
    const mines = [];
    // fa in modo le miniere abbiano date corrette progressive
    let prevDate = new Date('2000-01-02')
    // creazione di ogni singola miniera
    for (let i = 0; i < n; i++) {
      const tempYear = prevDate.getFullYear() + 2  
      const mine = {
        // id progressivo
        id: i + 1, 
        // Nome miniera, nome progressivo
        name: `Miniera_${i + 1}`,
        // location casuale
        location: `Location_${i + 1}`,
        // zona della location - da 1 a 3 casuale. Ogni zona ha i suoi clima 
        zone: Math.floor(Math.random() * 3 ) + 1,
        // Tipo di minerale scelto da mineralTypes , array iniziale
        type_of_mineral: mineralTypes[Math.floor(Math.random() * mineralTypes.length)].name,
        // data di inizio, compreso casualmente tra la data di inizio della miniera precedente (+ 1 anno) e i due anni successivi
        start_date: randomDate( prevDate, new Date(tempYear, 0, 1)),
        // status casuale presi da array statuses - solo le prime 6 (su 10) possono essere non attive
        dimension: Math.floor(Math.random() * 3 ) + 1
      } // fine creazione oggetto
      // data usata nella prossima miniera per calcolare la start_date. E' la start_date della miniera attuale + 1 anno
      const tempDate = new Date( mine.start_date )
      prevDate = new Date(tempDate.getFullYear() + 1,tempDate.getMonth(), tempDate.getDate())
      // inserimneto miniera in array
      mines.push(mine);
    } // fine for inserimento i-esima miniera

    return mines;
} // fine generateMines

// anagrafica con le operazioni di estrazione
const generateOperations = ( mines ) => {
    const n = 150
    const operations = [];
    // finchè l'array nonn raggiunge la lunghezza desiderta - tenta di aggiungere operation
    while ( operations.length < n ) {
      // viene creata l'operazione di estrazione, i dati verranno inseriti successivamente
      const operation = {
        id:0,
        date: randomDate(new Date(mines[0].start_date), new Date(2023, 0, 1)),
      }
      // statuses[Math.floor(Math.random() * statuses.length)]
      // miniere possibili, presenti in quel periodo
      const tempMines = mines.filter( row => new Date(row.start_date) < new Date(operation.date))
      // variabile di controllo, è un numero casuale che scarte l'operation in base alla quantità di miniere. Serve per fare in modo che vengano fatte pià operazioni se sono presenti più miniere
      const control = Math.floor(Math.random() * 10 ) + 1
      // scarto dell'n-esima operazione - casuale
      if( control > tempMines.length ) continue
      // miniera temporanea da assengnare
      const tempMine = tempMines[ Math.floor(Math.random() * tempMines.length) ]
      // assegnazione miniera tra quelle possibili
      operation.mine_id = tempMine.id
      // settings da prendere in base alla grandezza della miniera, sarà la base per il calcolo randomico
      const tempSetting = settings.find( row => row.dimension === tempMine.dimension )
      operation.extracted_quantity = randomValue( tempSetting.quantity )
      operation.operation_cost =  randomValue( tempSetting.cost )
      // aggiunta all'array operations
      operations.push(operation);
    } // fine for inserimento operations
    // ordinamento in base alla data di estrazione
    operations.sort((a,b)=>(new Date(a.date) - new Date(b.date)))
    // assegna l'id in base alla data, simula che l'ordine di inserimento sia stato raelmente progressivo
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      operation.id = i + 1
    } // fine for

    return operations;
  } // fine generateOperations

  // generazione andamento prezzi metalli
  const generateMarketPrices = () => {

      const prices = [];
      let i = 1
      // copia di miner per tenere i prezzi aggiornati
      const tempMineral = JSON.parse( JSON.stringify( mineralTypes ) )
      // ogni 1 mesi partendo dalla data di inizio a quella di fine
      for ( let date = new Date(startDate); new Date(date) <= new Date(endDate); date.setMonth(date.getMonth() + 1) ) {
          // per ognuno dei metalli
          let row = {
            id: i ,
            date:getMyIsoDate(date),
          }
          for (let index = 0; index < tempMineral.length; index++) {
              // true se salito, false se prezzo scende. Viene scelto casualmente. Ha il 60% di salire e 40 di scendere
              const isUp =  Math.floor(Math.random() * 10 ) > 3 ? true : false
              // percentuale di auomento / decremento
              const percentage = Math.floor( Math.random() * 50 )
              // calcolo variazione, massimo  1,05 o 0,95
              const variation = isUp ? 1 + percentage / 1000 : 1 - percentage / 1000 
              // viene moltiplicato il valore sopra al prezzo
              tempMineral[index].price = variation * tempMineral[index].price
              // valore del metallo 
              row[tempMineral[index].name] = tempMineral[index].price.toFixed(3)
          } // fine for metalli
          // aggiunta a tabella 
          prices.push(row)
          // incremendo per ID
          i ++
        
      } // fine for periodo di tre mesi
      return prices;
  } // fine generateMarketPrices

  // dati sulle risorse consumate dalle varie miniere - Ogni tre mesi vengono generati dati sulle miniere attive
  const generateResourceManagement = ( mines ) => {
      // array vuoto, andrà riempito con i dati 
      const resources = [];
      // progressivo per inserimento ID
      let i = 1
      // a partire dalla data di inizo e ogni tre mesi fino alla data di fine
      for ( let date = new Date( startDate ); date <= new Date(endDate); date.setMonth(date.getMonth() + 3) ) {
          // tutte le miniere attive in quel periodo
          const tempMines = mines.filter( mine => new Date( mine.start_date ) < new Date( date ) )
          // per ogni miniera attiva in quel periodo  - vengono generati numeri casuali per il consumo
          for (let index = 0; index < tempMines.length; index++) {
            const mine = tempMines[index];
            const setting = settings.find( row => row.dimension === mine.dimension )
            // compilazione oggetto da inserire
            const resource = {
              id: i,
              mine_id: mine.id,
              date: getMyIsoDate(date),
              // numero casuali per l'utilizzo di risorse
              water_usage: randomValue( setting.water ),
              energy_consumption: randomValue( setting.energy ),
              waste_generated: randomValue( setting.waste ),
            };
            resources.push(resource);
            i ++
          } // fine for 1
        
      } // Fine for 2

      return resources;
  } // fine funzione generateResourceManagement

  // generazione dati casuali ambiente
  function generateWeatherData( mines) {
    const weather = [];
    let i = 0
    for ( let date = new Date( startDate ); date <= new Date(endDate); date.setMonth(date.getMonth() + 3) ) {
        // tutte le miniere attive in quel periodo
        const tempMines = mines.filter( mine => new Date( mine.start_date ) < new Date( date ) )
        // per ogni miniera attiva in quel periodo  - vengono generati numeri casuali per il consumo
        for (let index = 0; index < tempMines.length; index++) {
            const mine = tempMines[index];
            const {temperature, precipitation}  = randomWeather( date , mine.zone)
            // compilazione oggetto da inserire
            const resource = {
              id: i,
              location: mine.location,
              date: getMyIsoDate(date),
              // numero casuali per l'utilizzo di risorse
              temperature,
              precipitation,
            };
            weather.push(resource);
            i ++
        } // fine for 1
    } // Fine for 2
    
    return weather;
  }

  export {
    generateMines,
    generateOperations,
    generateMarketPrices,
    generateResourceManagement,
    generateWeatherData
  };