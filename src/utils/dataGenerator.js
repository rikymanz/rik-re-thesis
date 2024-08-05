// generazione casuali dei valori

// Minerali possibili da estrarre
const mineralTypes = [
    {name:"Ferro",price:0.1000},
    {name:"Rame",price:7.5},
    {name:"Platino",price:10000},
    {name:"Oro",price:20000},
    {name:"Argento",price:200},
];

// data casuale presa tra due dati inserite come parametro
const randomDate = (startDate,endDate) => {
    const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    return date.toISOString().split('T')[0];
} // fine randomDate

// data casuale presa tra due dati inserite come parametro
const getMyIsoDate = (date) => {
  const tempDate = new Date(date);
  return tempDate.toISOString().split('T')[0];
} // fine randomDate

// generazione casuale n miniere
const generateMines = ( ) => {
    const n = 10
    const mines = [];
    // Più probabilità che la miniera sia attiva
    const statuses = ["Active", "Inactive"];
    // fa in modo le miniere abbiano date corrette progressive
    let prevDate = new Date('2000-01-01')
    // creazione di ogni singola miniera
    for (let i = 0; i < n; i++) {
      const tempYear = prevDate.getFullYear() + 2  
      const mine = {
        // id progressivo
        id: i + 1, 
        // Nome miniera, nome progressivo
        name: `Miniera_${i + 1}`,
        // location casuale
        location: `Location_${Math.floor(Math.random() * 1000) + 1}`,
        // Tipo di minerale scelto da mineralTypes , array iniziale
        type_of_mineral: mineralTypes[Math.floor(Math.random() * mineralTypes.length)].name,
        // data di inizio, compreso casualmente tra la data di inizio della miniera precedente (+ 1 anno) e i due anni successivi
        start_date: randomDate( prevDate, new Date(tempYear, 0, 1)),
        // status casuale presi da array statuses - solo le prime 6 (su 10) possono essere non attive
        status: i < 6 ? statuses[Math.floor(Math.random() * statuses.length)] : 'Active'
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
      // viene creata l'operazione di estrazione, la miniera e l'id verranno aggiunte successivamente
      const operation = {
        id:0,
        date: randomDate(new Date(mines[0].start_date), new Date(2023, 0, 1)),
        extracted_quantity: (Math.random() * 450 + 50).toFixed(2),
        operation_cost: (Math.random() * 9000 + 1000).toFixed(2),
      }
      // statuses[Math.floor(Math.random() * statuses.length)]
      // miniere possibili, presenti in quel periodo
      const tempMines = mines.filter( row => new Date(row.start_date) < new Date(operation.date))
      // variabile di controllo, è un numero casuale che scarte l'operation in base alla quantità di miniere. Serve per fare in modo che vengano fatte pià operazioni se sono presenti più miniere
      const control = Math.floor(Math.random() * 10 ) + 1
      // scarto dell'n-esima operazione - casuale
      if( control > tempMines.length ) continue
      // assegnazione miniera tra quelle possibili
      operation.mine_id = tempMines[ Math.floor(Math.random() * tempMines.length) ].id
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
      const startDate = new Date(2000, 0, 1); 
      const endDate = new Date(2023, 0, 1);
      let i = 1
      // copia di miner per tenere i prezzi aggiornati
      const tempMineral = JSON.parse( JSON.stringify( mineralTypes ) )
      // ogni 3 mesi partendo dalla data di inizio a quella di fine
      for ( let date = new Date(startDate); date <= new Date(endDate); date.setMonth(date.getMonth() + 3) ) {
          // per ognuno dei metalli
          for (let index = 0; index < tempMineral.length; index++) {
              // true se salito, false se prezzo scende. Viene scelto casualmente. Ha il 60% di salire e 40 di scendere
              const isUp =  Math.floor(Math.random() * 10 ) > 3 ? true : false
              // percentuale di auomento / decremento
              const percentage = Math.floor( Math.random() * 100 )
              // calcolo variazione, 1,0x o 0,9x 
              const variation = isUp ? 1 + percentage / 1000 : 1 - percentage / 1000 
              // viene moltiplicato il valore sopra al prezzo
              tempMineral[index].price = variation * tempMineral[index].price
              // prezzo da inserire in tabella
              const price = {
                id: i ,
                date:getMyIsoDate(date),
                mineral_type:tempMineral[index].name,
                price: tempMineral[index].price.toFixed(3) // prezzo con due cifre decimali
              };

              // aggiunta a tabella 
              prices.push(price)
              // incremendo per ID
              i ++
          } // fine for metalli
        
      } // fine for periodo di tre mesi
      return prices;
  } // fine generateMarketPrices

  const generateResourceManagement = (mines) => {
    const resources = [];
    const n = 150
    for (let i = 0; i < n; i++) {
      const resource = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        water_usage: (Math.random() * 9000 + 1000).toFixed(2),
        energy_consumption: (Math.random() * 4500 + 500).toFixed(2),
        waste_generated: (Math.random() * 450 + 50).toFixed(2)
      };
      resources.push(resource);
    }
    return resources;
  }

  const generateEnvironmentalImpact = ( mines ) => {
    const impacts = [];
    const n = 150
    for (let i = 0; i < n; i++) {
      const impact = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        emissions: (Math.random() * 900 + 100).toFixed(2),
        reclamation_efforts: `Efforts_${Math.floor(Math.random() * 10) + 1}`,
        environmental_incidents: `Incident_${Math.floor(Math.random() * 5) + 1}`
      };
      impacts.push(impact);
    }
    return impacts;
  }

  const generateSafetyRecords = ( mines) =>  {
    const safety = [];
    const severities = ["Low", "Medium", "High", "Critical"];
    const n = 150
    
    for (let i = 0; i < n; i++) {
      const record = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        incident_description: `Description_${Math.floor(Math.random() * 100) + 1}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        measures_taken: `Measures_${Math.floor(Math.random() * 50) + 1}`
      };
      safety.push(record);
    }
    return safety;
  }

  const generateProductionPlanning = ( mines) => {
    const planning = [];
    const n = 150
    for (let i = 0; i < n; i++) {
      const plannedQuantity = (Math.random() * 450 + 50).toFixed(2);
      const actualQuantity = (plannedQuantity * (Math.random() * 0.4 + 0.8)).toFixed(2);
      const plan = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        planned_extraction_quantity: plannedQuantity,
        actual_extraction_quantity: actualQuantity,
        variance: (actualQuantity - plannedQuantity).toFixed(2)
      };
      planning.push(plan);
    }
    return planning;
  }

  function generateWeatherData( mines) {
    const weather = [];
    const n = 150
    for (let i = 0; i < n; i++) {
      const data = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        temperature: (Math.random() * 50 - 10).toFixed(2),
        precipitation: (Math.random() * 200).toFixed(2),
        other_conditions: `Condition_${Math.floor(Math.random() * 10) + 1}`
      };
      weather.push(data);
    }
    return weather;
  }

  export {
    generateMines,
    generateOperations,
    generateMarketPrices,
    generateResourceManagement,
    generateEnvironmentalImpact,
    generateSafetyRecords,
    generateProductionPlanning,
    generateWeatherData
  };