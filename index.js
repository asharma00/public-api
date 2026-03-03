import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();

const APIURL = 'https://api.irail.be';

app.use(express.static('public'));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static('node_modules/bootstrap/dist'));


//current date and time for Belgium
var currentDate = new Date().toLocaleDateString("en-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "Europe/Brussels"
    }).replace(/\//g, "");

var currentTime = new Date().toLocaleTimeString("en-BE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Brussels"
    }).replace(":", "");


//rendering home page when server runs
app.get('/', function(req, res) {
    res.render('index.ejs');
})


//get calls of index.ejs
// app.get('/belgium', async function(req, res) {
//     // try {
//     //     var response = await axios(`${APIURL_belgium}/stations/?format=json&lang=en`);
//     //     console.log(response.data.station);
//     //     res.render('belgium.ejs', { content: response.data.station });
//     // }
//     // catch(error) {
//     //     res.render('belgium.ejs', { error: 'No results found!' })
//     // }
//     res.render('belgium.ejs')
// })


app.post('/get-results', async (req, res) => {
    console.log(req.body)
    var API = '';
    switch(req.body.apiType) {
        case 'stations':
            API = `${APIURL}/${req.body.apiType}/?format=json&lang=en`;
            break;
        case 'liveboard':
            var timeSelection = req.body.arrdep == '' ? 'departure' : req.body.arrdep;
            var trainTime = req.body.time == '' ? currentTime : req.body.time;
            var trainDate = req.body.date == '' ? currentDate : req.body.date;
            API = `${APIURL}/${req.body.apiType}/?station=${req.body.station}&arrdep=${timeSelection}&alerts${req.body.alert}&
                time=${trainTime}&date=${trainDate}&format=json&lang=en`;
            break;
        case 'connections':
            var timeSelection = req.body.arrdep == '' ? 'departure' : req.body.arrdep;
            var trainTime = req.body.time == '' ? currentTime : req.body.time;
            var trainDate = req.body.date == '' ? currentDate : req.body.date;
            API = `${APIURL}/${req.body.apiType}/?from=${req.body.fromStation}&to=${req.body.toStation}&timesel=${timeSelection}&
                typeOfTransport=${req.body.transportType}&time=${trainTime}&date=${trainDate}&format=json&lang=en`;
            break;
        case 'vehicle':
            API = `${APIURL}/${req.body.apiType}/?id=${req.body.vid}&date=${currentDate}&alerts${req.body.alert}&format=json&lang=en`;
            break;
        case 'composition':
            API = `${APIURL}/${req.body.apiType}/?id=${req.body.tid}&data=''&format=json&lang=en`;
            break;
        case 'disturbances':
            API = `${APIURL}/${req.body.apiType}/?lineBreakCharacter=''&format=json&lang=en`;
            try {
                var response = await axios(API);
                res.render('index.ejs', { code: 200, disturbContent: response.data.disturbance });
            }
            catch(error) {
                res.render('index.ejs', { code: 404, disturbContent: error });
            }
            break;
        default:
            break;
    }

    // try {
    //     var response = await axios(API);
    //     console.log(response.data);
    //     res.render('index.ejs', { content: response.data });
    // }
    // catch(error) {
    //     res.render('index.ejs', { error: 'No results found!' })
    // }

//     apiType: 'vehicle',
//   station: '',
//   sid: '',
//   vid: 'BE.NMBS.IC318',
//   fromStation: '',
//   toStation: '',
//   date: '121212',
//   time: '',
//   transportType: '',
//   tid: '',
//   alert: 'false'

    // var API = `${APIURL}/${req.body.apiType}/?
    //     station=${req.body.station}&
    //     sid=${req.body.sid}&
    //     vid=${req.body.vid}&
    //     fromStation=${req.body.fromStation}&
    //     toStation=${req.body.toStation}&
    //     date=${currentDate}&
    //     time=${currentTime}&
    //     transportType=${req.body.transportType}&
    //     tid=${req.body.tid}&
    //     alert=${req.body.alert}&
    //     arr
    //     format=json&
    //     lang=en`;
    // console.log(API)
})


//running the port
app.listen(port, function() {
    console.log(`Server running on port ${port}`);
})