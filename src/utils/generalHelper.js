// metodo per formattare il numero con sepratori di migliaia e decimali
export const getFormattedNumber = ( number ) => {
    let tempNumber = number.toFixed(2)
    tempNumber = tempNumber.replace('.',',')
    return tempNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

