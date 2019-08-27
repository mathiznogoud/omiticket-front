import validator from 'validator'

const isEmail = (email) => {
    return validator.isEmail(email)
}

export default isEmail