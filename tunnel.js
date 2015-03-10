wsmTunnel = function(targetWindow, domain, name){
    var connect = $.Deferred();
    var tthis = this;
    var name = name === undefined ? 'tunnel' : 'tunnel_'+name;
    var domain = domain === undefined ? window.location.host : domain;
    var receive;
    this.connect = function(fn){
        listen();
        if(connect.state() === 'pending'){
            this.send('connect');
        }
        connect.promise().done(fn);
        return connect.promise();
    }

    this.send = function(data){
        targetWindow.postMessage(JSON.stringify({name:name, data:data}),"*");
    }
    var listen = function(){
        $(window).on('message',function(evt){
            if(domain === '*' || evt.originalEvent.origin.search(domain)>=0){
                var data = $.parseJSON(evt.originalEvent.data);
                if(data.name === name){
                    data = data.data;
                    if(data === 'connected'){
                        connect.resolve(tthis);
                    }else if(data === 'connect'){
                        tthis.send('connected');
                        connect.resolve(tthis);
                    }else{
                        receive(data);
                    }
                }
            }
        });
    }
    this.onreceive = function(fn){
        receive = fn;
        return this;
    }
}
