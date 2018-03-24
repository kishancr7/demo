var os = require('os');
var grpc = require('grpc');
var fs = require('fs');
var express = require('express');
var app = express();
//var lndCert = fs.readFileSync('/home/kishan/lncli-web/lnd.cert');
//var lndkey = fs.readFileSync('/home/kishan/.lnd/tls.key');
//var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load('rpc.proto');
//console.log(lnrpcDescriptor);
var lnrpc = lnrpcDescriptor.lnrpc;
//var lightning = new lnrpc.Lightning('localhost:10009', credentials);
var html = (fs.readFileSync('webstore.html').toString());
var reqPage = (fs.readFileSync('invoice.html').toString());
var sleep = require('sleep');
var moment = require('moment'); 
var https = require('https');
require('events').EventEmitter.defaultMaxListeners = Infinity;
//const lndcertpath = "/home/kishan/lncli-web/lnd.cert";
//const macaroonPath = "/home/kishan/.lnd/admin.macaroon";
//console.log(lndcertpath);

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

      const lndHost = "localhost:10009";
			const lndCert = fs.readFileSync('/home/kishan/.lnd/tls.cert');
			const sslCreds = grpc.credentials.createSsl(lndCert);
      console.log("Creds = " + sslCreds);

			var credentials;
			
		
					var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
						const adminMacaroon = fs.readFileSync('/home/kishan/.lnd/admin.macaroon');
						const metadata = new grpc.Metadata();
						metadata.add("macaroon", adminMacaroon.toString("hex"));
						callback(null, metadata);
					});
					credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
			     console.log("Credentials = " + credentials.toString());	 
			
      console.log("lnrpc" + lnrpc);
			var lightning = new lnrpc.Lightning(lndHost, credentials);
			console.log("Lightning=" + lightning);


app.use(express.static(__dirname + '/index'));

//console.log('cfdre12');

/**app.get('/', (req, res)) => {
	call = lightning.addInvoice({
		memo: 'abcde' ,
		value: {{amt}},
		 function(err, response)
		  {console.log('AddInvoice: ' + response);
	});
}*/																																																					

app.get('/',function (req, res) {
    console.log("Home page loaded.")
    
    var amount = req.query['totalprice'];
     //create invoice to allow skipping
     call = lightning.addInvoice({ 
        memo: "adwatcher",
        value: amount,
        }, function(err, response) {
            if(err)
	         {
		console.log(err);	
	    }
            console.log("Response in add invoice = " + response);
            console.log('AddInvoice: ' + response.payment_request);
            res.send(reqPage,response.payment_request);
            //display newly generated invoices everytime the page loads with qr code(still working on qr code gerneration)
            //res.send(html+''+ '<br><h4 id="note1">Please pay 50 sat invoice to donate, then click "support" to verify.</h4><p id="invoice">'+response.payment_request+'</p><a href="http://adwatcher.hopto.org:7777/skip/' +response.payment_request + '/"'+'><img id="support" src="https://pre00.deviantart.net/b38e/th/pre/i/2015/181/f/3/youtube_support_button__donation_button__by_koolgoldfinch-d8zf3if.png"></img></a><!--Hide the pay button until user watches for a minute --><script>function readyToPay() {$("#paid").show("slow");};$("#paid").hide(); window.setTimeout(readyToPay, 300000);</script>');
     });
});

//console.log(value);

	app.listen(8000, '172.30.2.82', () => {
	console.log('Server is up on port 8000');
});
