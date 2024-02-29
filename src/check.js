const isValidEmail = (email) => {
    const pattern = /[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}/gm
    const match = email.match(pattern) ? email.match(pattern) : undefined
    if(match==undefined){
        return false
    }
    return match.length == 1 && match[0].length == email.length
}
module.exports = {isValidEmail}