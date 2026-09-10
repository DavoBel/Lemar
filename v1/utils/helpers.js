export const getPaginacion = (req) => {
    const limite = getLimite(req);
    const pagina = getPagina(req);
    const skip = (pagina - 1) * limite;
    return { limite, pagina, skip };
};

export const getLimite = req=>{
    const limite = parseInt(req.query.limite);
    if(isNaN(limite) || limite <=0){
        return 10;
    }else if(limite>30){
        return 30;
    }else{
        return limite;
    }
}

export const getPagina = req =>{
    let pagina = parseInt(req.query.pagina)  || 1;
    if(pagina < 1){
        pagina = 1;
    }
    return pagina;
}