import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const findLevels = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : 'levels',
        headers
    })
} 

export const findLevelById = async levelId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `levels/${levelId}`,
        headers
    })
} 

export const createLevel = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'levels',
        data,
        headers
    })
} 

export const updateLevel = async ({levelId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'PUT',
        url : `levels/${levelId}`,
        data,
        headers
    })
} 

export const removeLevel = async levelId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'DELETE',
        url : `levels/${levelId}`,
        headers
    })
}

