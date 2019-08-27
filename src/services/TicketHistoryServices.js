import {getApiResponse} from './index'
import {getCookie} from '../helpers/cookies'

export const findHistories = async ticketId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : `ticket_logs/${ticketId}`,
        headers
    })
} 

export const getVersionDetails = async versionId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `ticket_logs/${versionId}/details`,
        headers
    })
} 