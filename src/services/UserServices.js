import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const signIn = async (args) => {
    const {email,password} = {...args}
    const user = { email, password }
    const data = { user }

    return await getApiResponse({
        method : 'POST',
        url : 'users/sign_in',
        data : data,
    })

}

export const signOut = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'users/sign_out',
        headers
    })
}

export const findUsers = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'GET',
        url : 'admins',
        headers
    })
}

export const createUser = async (data) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'POST',
        url : 'admins',
        headers,
        data
    })
}

export const findUserById = async (userId) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'GET',
        url : `admins/${userId}`,
        headers
    })
}

export const updateUser = async ({userId, data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'PUT',
        url : `admins/${userId}`,
        headers,
        data
    })
}


export const deleteUser = async (userId) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'DELETE',
        url : `admins/${userId}`,
        headers
    })
}

export const changePassword = async (data) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}` 
    }

    return await getApiResponse({
        method : 'POST',
        url : 'users/change_password',
        headers,
        data
    })
}

export const sendEmailReset = async (data) => {
    return await getApiResponse({
        method : 'POST',
        url : 'users/reset_password',
        data
    })
}


export const resendEmailReset = async (data) => {
    return await getApiResponse({
        method : 'POST',
        url : 'users/resend_confirm_email',
        data
    })
}