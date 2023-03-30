import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { host, secretApiKey } = publicRuntimeConfig

const api = {
    paths: {
        getPath: "/public/getPath",
        getPage: "/public/getPage",
        getPromotion: "/integation/loylatyPromotion",
        getPromotionDetail: "/integation/loylatyPromotionDetail",
        sendInfoSupport: "/public/sendInfoSupport"
    },
    get: async (key, params = "") => {
        let rs = await fetch(`${host}${api.paths[key]}${params}`, {
            headers: {
                "Authorization": `Bearer ${secretApiKey}`
            }
        })
        rs = await rs.json();
        console.log(`${host}${api.paths[key]}${params}`, rs.errorCode, rs.errorMsg)
        return rs
    },
    post: async (key, data = {}) => {
        let rs = await fetch(`${host}${api.paths[key]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${secretApiKey}` 
            },
            body: JSON.stringify(data)
        })
        rs = await rs.json()
        console.log(`${host}${api.paths[key]}`, rs.errorCode, rs.errorMsg)
        return rs
    }
}

export default api