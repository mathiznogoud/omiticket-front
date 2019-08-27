import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const findTickets = async (query) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'tickets/all',
        headers,
        data : query
    })
}

export const findTicketsByDepartment = async (deptId, query) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : `${deptId}/tickets/all`,
        headers,
        data : query
    })
}

export const findTicketById = async ticketId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `tickets/${ticketId}`,
        headers
    })
}

export const createTicket = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'tickets',
        data,
        headers
    })
}

export const assignTicket = async ({ticketId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : `tickets/${ticketId}/assign`,
        data,
        headers
    })
}

export const updateTicketStatus = async ({ ticketId, data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'PUT',
        url : `tickets/update_status/${ticketId}`,
        data,
        headers
    })
}


export const updateTicket = async ({ticketId, data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'PUT',
        url : `tickets/${ticketId}`,
        data,
        headers
    })
}

export const removeTicket = async ticketId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'DELETE',
        url : `tickets/${ticketId}`,
        headers
    })
}

export const exportAll = async (data) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : `download_csv/all`,
        headers,
        data
    })
}

export const exportByDepartment = async (departmentId, data) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : `${departmentId}/download_csv`,
        headers,
        data
    })
}