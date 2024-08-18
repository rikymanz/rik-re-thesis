export const getFormattedNumber = ( number ) => {
    let tempNumber = number.toFixed(2)
    tempNumber = tempNumber.replace('.',',')
    return tempNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

