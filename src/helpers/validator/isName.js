const isName = (name) => {
    const reString = /[a-zA-Z\s]+/
    const re = new RegExp(reString)
    return re.test(name)
}

export default isName