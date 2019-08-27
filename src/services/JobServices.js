import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const findJobs = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : 'jobs',
        headers
    })
} 

export const findJobById = async jobId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `jobs/${jobId}`,
        headers
    })
} 

export const createJob = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'jobs',
        data,
        headers
    })
} 

export const updateJob = async ({jobId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'PUT',
        url : `jobs/${jobId}`,
        data,
        headers
    })
} 

export const removeJob = async jobId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    
    return await getApiResponse({
        method : 'DELETE',
        url : `jobs/${jobId}`,
        headers
    })
}

