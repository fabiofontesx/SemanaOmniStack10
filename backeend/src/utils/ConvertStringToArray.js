function convertStringToArray(string){
    return string.split(',').map(tech=>tech.trim());
}

module.exports = convertStringToArray;