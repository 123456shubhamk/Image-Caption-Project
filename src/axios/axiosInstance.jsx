import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: 'https://api.pexels.com',
    headers: {
        Authorization: 'EM7xEMRuUkHWhg3pUFI1E9Bkw90qgroyNq5xIJh7lzD9OPc5gWsZU7aA'
    }
})

export {AxiosInstance};