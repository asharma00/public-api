import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const port = 3000;
const app = express();

const APIURL = 'https://api.disneyapi.dev';

app.use(express.static('public'));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static('node_modules/bootstrap/dist'));


//rendering home page when server runs
app.get('/', async function(req, res) {
    try {
        const response = await axios.get(`${APIURL}/character`);
        res.render('index.ejs', { characters: response.data.data, other: response.data.info, search: '' });
    } catch (error) {
        res.render('index.ejs', { error: 'An error occurred while fetching characters. Please try again later.' });
    }
})


//rendering data from the API to the characters page
app.get('/characters', async function(req, res) {
    const apiQuery = req.query.api;
    const search = apiQuery.includes('name') ? apiQuery.split('=')[1] : '';

    try {
        const response = await axios.get(`${APIURL}/character${apiQuery}`);
        
        if(req.query.api.includes('name'))
            res.render('index.ejs', { characters: response.data.data, search: search });
        else
            res.render('index.ejs', { characters: response.data.data, other: response.data.info, search: '' });
    } catch (error) {
        res.render('index.ejs', { error: 'An error occurred while fetching characters. Please try again later.' });
    }
})


//rendering single character data
app.get('/profile/:id', async function(req, res) {
    const id = req.params.id;

    try {
        const response = await axios.get(`${APIURL}/character/${id}`);
        res.render('profile.ejs', { character: response.data.data });
    } catch (error) {
        res.render('index.ejs', { error: 'An error occurred while fetching character details. Please try again later.' });
    }
})


//running the port
app.listen(port, function() {
    console.log(`Server running on port ${port}`);
})