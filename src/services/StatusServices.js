import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const findStatuses = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : 'statuses',
        headers
    })
} 

export const findStatusById = async statusId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `statuses/${statusId}`,
        headers
    })
} 

export const createStatus = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'statuses',
        data,
        headers
    })
} 

export const updateStatus = async ({statusId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'PUT',
        url : `statuses/${statusId}`,
        data,
        headers
    })
} 

export const removeStatus = async statusId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'DELETE',
        url : `statuses/${statusId}`,
        headers
    })
}

