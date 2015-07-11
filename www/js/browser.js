if (!window.plugins) {
    window.plugins = {};
}

if (!window.cordova) {
    window.cordova = {
        plugins: {}
    };


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
    window.CameraPopoverOptions = {};
    window.Camera = {
        PictureSourceType: {
            CAMERA: 0,
            PHOTOLIBRARY:1

        },
        DestinationType: {
            DATA_URL: 1
        },
        EncodingType: {
            JPEG:1
        }
    }

    navigator.camera = {
        getPicture: function(f) {
            f("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");
        }
    };
}