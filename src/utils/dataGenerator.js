const mineralTypes = ["Ferro", "Rame", "Litio", "Oro", "Argento"];

const randomDate = (startDate,endDate) => {
    const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    return date.toISOString().split('T')[0];
}

const generateMines = (n) => {
    const mines = [];
    const statuses = ["Active", "Inactive"];
    
    for (let i = 0; i < n; i++) {
      const mine = {
        id: i + 1,
        name: `Miniera_${i + 1}`,
        location: `Location_${Math.floor(Math.random() * 100) + 1}`,
        type_of_mineral: mineralTypes[Math.floor(Math.random() * mineralTypes.length)],
        start_date: randomDate(new Date(1980, 0, 1), new Date(2023, 0, 1)),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
      mines.push(mine);
    }
    return mines;
}

const generateOperations = (n, mines) => {
    const operations = [];
    
    for (let i = 0; i < n; i++) {
      const operation = {
        id: i + 1,
        mine_id: mines[Math.floor(Math.random() * mines.length)].id,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        extracted_quantity: (Math.random() * 450 + 50).toFixed(2),
        operation_cost: (Math.random() * 9000 + 1000).toFixed(2),
        equipment_used: `Equipment_${Math.floor(Math.random() * 50) + 1}`
      };
      operations.push(operation);
    }
    return operations;
  }


  const generateMarketPrices = (n) => {
    const prices = [];
    
    for (let i = 0; i < n; i++) {
      const price = {
        id: i + 1,
        date: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
        mineral_type: mineralTypes[Math.floor(Math.random() * mineralTypes.length)],
        price_per_unit: (Math.random() * 950 + 50).toFixed(2)
      };
      prices.push(price);
    }
    return prices;
  }

  const generateResourceManagement = (n, mines) => {
    const resources = [];
    
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

  const generateEnvironmentalImpact = (n, mines) => {
    const impacts = [];
    
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

  const generateSafetyRecords = (n, mines) =>  {
    const safety = [];
    const severities = ["Low", "Medium", "High", "Critical"];
    
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

  const generateProductionPlanning = (n, mines) => {
    const planning = [];
    
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

  function generateWeatherData(n, mines) {
    const weather = [];
    
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