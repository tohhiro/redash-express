//fetchができるようにする
const fetch = require('node-fetch') 

module.exports = class redash {

    // fetchの関数
    static fetchRedash = async(token, url, method) => {
        let response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Key ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        })

        return response
    } 

    // Redashのrefresh時のendpointを生成
    static refreshRedash = (host, body) =>{

        const url = new URL(`${host}/queries/${body.queryId}/refresh`)

        Object.keys(body).forEach((key)=>{
            if(key === 'host' || key === 'token' || key === 'queryId'){ 
                return               
            }else{
                url.searchParams.append(key, body[key])
            }
        });
        console.log(url.toString())
        return url.toString()
    }

    // Redashのjob時のendpointを生成
    static jobRedash = (host, job) =>{

        const url = new URL(`${host}/jobs/${job}`)
        return url
        
    }

    // Redashのresult時のendpointを生成
    static resultRedash = (host,body,result) =>{

        const url = new URL(`${host}/queries/${body.queryId}/results/${result}`)
        return `${url.toString()}.json`
        
    } 
}