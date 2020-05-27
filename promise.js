Promise.all=function(promise){
        return new Peomise((resolve,reject)=>{
            let index=0;
            let result=[];
            if(promise.length==0){
                resolve(result)
            }
            else{
                function processResult(i,data){
                    result[i]=data
                    if(++index==promise.length){
                        resolve(result)
                    }
                }
                for(let i=0;i<promise.length;i++){
                    Promise.resolve(promise[i]).then((data)=>{
                        processResult(i,data),(err)=>{reject(err); return}
                    })
                }
            }
        })
}