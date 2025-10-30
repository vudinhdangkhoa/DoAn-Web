class APIRoute {
    //static baseUrl=`http://localhost:5225`;
     static baseUrl=`https://2gcqx76s-5225.asse.devtunnels.ms`;
    static getUrlImage(url){
        return `${this.baseUrl}${url}`;
    }
    static getURL(url){
        return `${this.baseUrl}/api/${url}`;
    }
    // static getURL(url){
    //     return `https://2gcqx76s-5225.asse.devtunnels.ms/api/${url}`;
    // }
}
export default APIRoute;