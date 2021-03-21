import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

export const getResource = async (url: string, config: AxiosRequestConfig) => {
    try {
        const resource: AxiosResponse<string> = await axios.get(url, config)
        return resource
    } catch (error) {
        console.error(error)
    }
}