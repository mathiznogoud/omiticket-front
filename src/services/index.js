import axios from 'axios'

const serverUrl = process.env.SERVER_URL || 'https://omiticket.herokuapp.com/api/v1/'

export const getApiResponse = async ({ url, method, data, params, headers}) => {
    const defaultHeaders = {
        'Accept' : '*/*'
    }

    try {
        const response = await axios({
            url: `${serverUrl}${url}`,
            method,
            data,
            params,
            headers : {...headers,...defaultHeaders}
        })
        return response['data']
        
    } catch (e) {
        return {
            success: false,
            message: e.message || e
        }
    }


}