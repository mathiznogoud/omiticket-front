import {getApiResponse} from './index'
import {getCookie, setCookie} from '../helpers/cookies'

export const findDepartments = async () => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : 'departments',
        headers
    })
} 

export const findDepartmentById = async departmentId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'GET',
        url : `departments/${departmentId}`,
        headers
    })
} 

export const createDepartment = async data => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'POST',
        url : 'departments',
        data,
        headers
    })
} 

export const updateDepartment = async ({departmentId,data}) => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'PUT',
        url : `departments/${departmentId}`,
        data,
        headers
    })
} 

export const removeDepartment = async departmentId => {
    const token = getCookie('token')
    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    return await getApiResponse({
        method : 'DELETE',
        url : `departments/${departmentId}`,
        headers
    })
}

