const isPhoneNumber = (phoneNumber) => {
    const reString = /[\d-]+/
    const re = new RegExp(reString)
    console.log('Phone',phoneNumber,re.test(phoneNumber))
    return re.test(phoneNumber)
}

export default isPhoneNumber