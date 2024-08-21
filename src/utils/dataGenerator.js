// generazione casuali dei valori

// Minerali possibili da estrarre. price è il prezzo di partenza. Quantity è un coefficente per la quantità estratta. Più alto è e più è facile da estrarre
const mineralTypes = [
    {name:"Iridio",price:8000,quantity:0.5},
    {name:"Platino",price:1000,quantity:4},
    {name:"Oro",price:4000,quantity:1},
    {name:"Argento",price:100,quantity:40},
];

// coefficente aumento spese, simula l'inflazione e fa in modo che anno dopo anno le spese mediamente aumentino
const getCoeff = (year) => {
    const diff = year - 2005 // le spese aumenteranno dopo il 2005
    if( diff <= 0 ) return 1
    // per ogni anno dopo il 2005 tutte le spese verranno moltiplicate per un coefficente che aumenta di 0.15 per ogni anno
    else return 1 + (0.15 * diff)
} // fine get coeff

// data inizio e fine della quale generare i dati
const startDate = new Date(2000, 0, 2); // 2001-01-01
const endDate = new Date(2023, 11, 2); // 2023-12-01

// settaggi modificabili per cambiare la base dalla quale vengono estratti i valori casuali
const settings = [
  {dimension:1,quantity:5,cost:3500,water:3500,energy:3500,waste:2000},
  {dimension:2,quantity:10,cost:7000,water:7000,energy:7000,waste:5000},
  {dimension:3,quantity:25,cost:20000,water:20000,energy:20000,waste:15000},
] // fine settings

// data casuale presa tra due dati inserite come parametro
const randomDate = ( start , end ) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
} // fine randomDate

// la funzione servirà poi per calcolare i valori casuali. Prende un valore di base e restituisce un valore a partire da 2/3 a 5/3. Un valore di 100 restituisce da 75 a 125
const randomValue = ( baseValue ) => {
    const start = baseValue * 0.75
    const end = baseValue + ( baseValue * 0.25 )
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
        temperature = Math.floor(Math.random() * 10 ) + 30 // da 30 a 40 gradi
        const isRaining = Math.floor(Math.random() * 10 ) < 3 ? true : false // basse probabilità di pioggia 30%
        precipitation = isRaining ? Math.floor(Math.random() * 30 ) + 5 : 0 // poca quanità d'acqua
    }else if( zone === 2 ){ //zona 2 temperata
        temperature = Math.floor(Math.random() * 30 ) // temperatura da 0 a 30
        const isRaining = Math.floor(Math.random() * 10 ) < 6 ? true : false // probabilmita del 60% che abbia piovuto
        precipitation = isRaining ? Math.floor(Math.random() * 90 ) + 5 : 0 // precipitazioni medie
    }else{ //zona 3 fredda
        temperature = Math.floor(Math.random() * 25 ) - 10 // da -10 a 15 gradi
        const isRaining = Math.floor(Math.random() * 10 ) < 7 ? true : false // probabilmita del 70% che abbia piovuto
        precipitation = isRaining ? Math.floor(Math.random() * 200 ) + 5 : 0 // alte precipitazioni
    } // fine if else temperatura e prcipitazioni

    // variazione temperatura e precipitazioni in base al mese
    const tempDate = new Date( date )
    const month = tempDate.getMonth() + 1

    // se inverno
    if( month >= 10 || month <= 1 ){
         // abbassa la tempratura di un numero variabile tra 5 a 15
         temperature = temperature - Math.floor(Math.random() * 10 ) + 5
    }else if( month >= 6 && month <= 9  ){
        // alza la temperatura tra un numero da 5 a 15
         temperature = temperature + Math.floor(Math.random() * 10 ) + 5
    }

    return {temperature, precipitation}

} // fine randomWeather

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
      // anno della miniera precedente + 1
      const tempYear = prevDate.getFullYear() + 2  
      // le prime 4 hanno ognuna i 4 minerali diversi. Le altre saranni casuali
      const mineral = i < 4 ? mineralTypes[i].name : mineralTypes[Math.floor(Math.random() * mineralTypes.length)].name
      // valorizzazioni dati miniera
      const mine = {
        // id progressivo
        id: i + 1, 
        // Nome miniera, nome progressivo
        name: `Miniera_${i + 1}`,
        // location casuale
        location: `Location_${i + 1}`,
        // zona della location - da 1 a 3 (arida, temperata e fredda) casuale. Ogni zona ha i suoi clima 
        zone: Math.floor(Math.random() * 3 ) + 1,
        // Tipo di minerale scelto da mineralTypes , array iniziale
        type_of_mineral: mineral,
        // data di inizio, compreso casualmente tra la data di inizio della miniera precedente (+ 1 anno) e i due anni successivi
        start_date: randomDate( prevDate, new Date(tempYear, 0, 1)),
        // Dimensione casuale (piccla, media, grande)
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
const generateOperations = ( mines , weatherData ) => {
    // array vuoto che conterrà le operazioni di estrazione
    const operations = [];
    let i = 1
    // per ongni mese
    for ( let date = new Date(startDate); new Date(date) <= new Date(endDate); date.setMonth(date.getMonth() + 1) ) {
        // tutte le possibili miniere di quel mese
        const tempMines = mines.filter( row => new Date(row.start_date) < new Date(date))
        // per ogni miniera presente in quel mese
        for (let index = 0; index < tempMines.length; index++) {  
            // miniera
            const tempMine = tempMines[index];
            // valore casuale - l'operazione verrà inserita il 50% delle volte
            const control = Math.floor(Math.random() * 10 )
            if( control < 5 ) continue
            // settings in base alla dimnesionde della miniera, per il calcolo delle quantita estratte - più è grande e piùsi estrae
            const tempSetting = settings.find( row => row.dimension === tempMine.dimension )
            // info sul minerale estratto
            const tempMineral = mineralTypes.find( row => row.name === tempMine.type_of_mineral )
            // creazione operazione utilizzando funzioni di estrazione casuale di valori
            const operation = {
              id:i,
              mine_id:tempMine.id,
              extracted_quantity:randomValue( tempSetting.quantity ) * tempMineral.quantity, // valore casuale * coefficente minerale
              operation_cost:randomValue( tempSetting.cost ) * getCoeff( date.getFullYear() ), // valore causale * coefficente di aumento annuo
              date:getMyIsoDate(date)
            }
            // estrazioni dati meterologici
            const weather = weatherData.find( row => row.location === tempMine.location && operation.date === row.date )
            // se le precipitazioni nel mese dell'estrazione per quella location raggiungono valori di 130 e 80. La produzione viene diminuita
            if( weather.precipitation > 130 ) operation.extracted_quantity = operation.extracted_quantity * 0.7
            else if( weather.precipitation > 80 ) operation.extracted_quantity = operation.extracted_quantity * 0.85
            // inserimento nell'array
            operations.push(operation);
            i ++
        } // fine for
        
    } // fine for mesi

    return operations;
  } // fine generateOperations

  // generazione andamento prezzi metalli
  const generateMarketPrices = () => {

      const prices = [];
      let i = 1
      // copia di mineralTypes, che contiene i prezzi iniziali,  per tenere i prezzi aggiornati
      const tempMineral = JSON.parse( JSON.stringify( mineralTypes ) )
      // ogni 1 mesi partendo dalla data di inizio a quella di fine
      for ( let date = new Date(startDate); new Date(date) <= new Date(endDate); date.setMonth(date.getMonth() + 1) ) {
          // valori inizialli n-esima riga che conterrà tutti i prezzi
          let row = {
            id: i ,
            date:getMyIsoDate(date),
          }
          // per ognuno dei metalli
          for (let index = 0; index < tempMineral.length; index++) {
              // true se salito, false se prezzo scende. Viene scelto casualmente. Ha il 60% di salire e 40 di scendere
              const isUp =  Math.floor(Math.random() * 10 ) > 3 ? true : false
              // percentuale di auomento / decremento
              const percentage = Math.floor( Math.random() * 50 )
              // calcolo variazione, massimo  1,05 o 0,95
              const variation = isUp ? 1 + percentage / 1000 : 1 - percentage / 1000 
              // viene aggiornato il valore del minerale nell'oggetto che tiene traccia dei valori
              tempMineral[index].price = variation * tempMineral[index].price
              // valore del metallo aggioranto nell'array vero e proprio
              row[tempMineral[index].name] = tempMineral[index].price.toFixed(3)
          } // fine for metalli
          // aggiunta a tabella la riga con i prezzi del mese
          prices.push(row)
          // incremendo per ID
          i ++
        
      } // fine for periodo di tre mesi
      return prices;
  } // fine generateMarketPrices

  // dati sulle risorse consumate dalle varie miniere - Ogni mese vengono generati dati sulle miniere attive
  const generateResourceManagement = ( mines , operations , weatherData ) => {
      // array vuoto, andrà riempito con i dati 
      const resources = [];
      // progressivo per inserimento ID
      let i = 1
      // a partire dalla data di inizo e ogni  mese fino alla data di fine
      for ( let date = new Date( startDate ); date <= new Date(endDate); date.setMonth(date.getMonth() + 1 ) ) {
          // tutte le miniere attive in quel periodo
          const tempMines = mines.filter( mine => new Date( mine.start_date ) < new Date( date ) )
          // per ogni miniera attiva in quel periodo  - vengono generati numeri casuali per il consumo
          for (let index = 0; index < tempMines.length; index++) {
            const isoDate = getMyIsoDate(date) // data in foramto iso
            const mine = tempMines[index]; // n-esima miniera
            // controlla se la miniera era operativa quel mese
            const isOperative = operations.find( row => row.date === isoDate && row.mine_id === mine.id  )
            // se non lo era salta il mese
            if( !isOperative ) continue;
            // settaggi in base alla grandezza della miniera, influenzeranno in consumi
            const setting = settings.find( row => row.dimension === mine.dimension )
            // compilazione oggetto da inserire
            const resource = {
              id: i,
              mine_id: mine.id,
              date: isoDate ,
              // numero casuali per l'utilizzo di risorse moltiplicati per il coefficente di aumento anno
              water_usage: randomValue( setting.water ) * getCoeff( date.getFullYear() ),
              energy_consumption: randomValue( setting.energy ) * getCoeff( date.getFullYear() ),
              waste_generated: randomValue( setting.waste ) * getCoeff( date.getFullYear() ),
            };

            // in caso di zone aride viene alzato il consumo dell'acuqa e abbassatao quello dell'energia
            if( mine.zone === 1 ){
                resource.water_usage = resource.water_usage * 1.7
                resource.energy_consumption = resource.energy_consumption * 0.8
            // in caso di zone fredde  viene alzato il consumo dell'energia e abbassatao quello dell'acqua
            }else if( mine.zone === 3 ){
                resource.water_usage = resource.water_usage * 0.8
                resource.energy_consumption = resource.energy_consumption * 1.7
            } // fine ifl else per alterazione valori in base alla zona

            // ulteriori modifiche in base alla temperatura
            const weather = weatherData.find( row => row.location === mine.location && resource.date === row.date )
            // in base alle tempertaure raggiunte si modificano di nuovo l'utilizzo di acqua e energia
            if( weather.temperature > 35 ) resource.water_usage = resource.water_usage * 1.5
            if( weather.temperature < 0 ) resource.energy_consumption = resource.energy_consumption * 1.5
            // inserimento nell'array

            // aggiunta all'array della riga
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
    for ( let date = new Date( startDate ); date <= new Date(endDate); date.setMonth(date.getMonth() + 1) ) {
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