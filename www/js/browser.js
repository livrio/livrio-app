if (!window.plugins) {
    window.plugins = {};
}

if (!window.cordova) {
    window.cordova = {
        plugins: {}
    };
}

function setPlatform(p) {
    document.body.classList.remove("platform-ios");
    document.body.classList.remove("platform-android");
    document.body.classList.add("platform-" + p);
}



window.facebookConnectPlugin = {
    login: function(p, success, failure) {
        console.log("facebook");
        success({
            status: "connected",
            authResponse: {
                accessToken: "CAAKEya4xmrYBAEQZAMEcWqppD5FZCSAFkb0W7eJ0WIMX5XaZBpCtPuaAzVfKVShHFLOHk4QB9ZA1Vi8EfbQgzGt8UU7sE2mVcP9AvvnI2IOYHDETpZCY3DlbHxYcjGD7by3kNWLMhR66754KwuVQZCZAhutYl3ZBm1s79fTkOZAdJIwgsJoo8jNVyXF77skYP5xPcMZA8803faWDAjvKX6OkWqRKNtadfUozpoQKLKJQBBngZDZD"
            }
        });
    },
    api: function(p, e, success, failure) {
        success({
            "id":"777268029017567",
            "email":"aureliosaraiva@gmail.com",
            "age_range":{"min":21},
            "name":"Aurélio Saraiva",
            "gender":"male",
            "picture":{"data":{"height":160,"is_silhouette":false,
            "url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/s160x160/1044664_520207491390290_2012217390_n.jpg?oh=aaae5ecf5a4c314d5b206b2d5901223b&oe=56024E25&__gda__=1439253895_c2c3adc928578ed10bdb5556e8a62177","width":144}}}
            );
    }
};

window.plugins.toast = {
    showShortBottom: function(text) {
        console.log("TOAST",text);
    },
    showLongBottom:function(text) {
        console.log("TOAST",text);
    }
};


cordova.plugins.barcodeScanner = {
    scan: function(success) {
        success({
            text: "9788536502694"
        });
    }
};
