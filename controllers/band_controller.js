const bands = require('express').Routes();
const db = require('../models')
const { band } = db

bands.get('/', async (req,res) => {
    try{

        const foundBands = await band.findAll();
        res.status(200),json(foundBands);

    } catch(e) {
        res.status(500),json(e)
    }
})

module export = bands