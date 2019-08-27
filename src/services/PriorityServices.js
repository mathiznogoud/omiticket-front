import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

const token = getCookie('token')
const headers = {
    'Authorization' : `Bearer ${token}`
}

export const findPriorities = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : 'priorities',
        headers
    })
} 

export const findPriorityById = async priorityId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `priorities/${priorityId}`,
        headers
    })
} 

export const createPriority = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'priorities',
        data,
        headers
    })
} 

export const updatePriority = async ({priorityId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'PUT',
        url : `priorities/${priorityId}`,
        data,
        headers
    })
} 

export const removePriority = async priorityId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'DELETE',
        url : `priorities/${priorityId}`,
        headers
    })
}

