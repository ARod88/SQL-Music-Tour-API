// DEPENDENCIES
const stages = require('express').Router()
const db = require('../models')
const { Event } = db;
const { Op } = require('sequelize');

stages.get('/', async (req, res) => {
    try {
        const searchTerm =req.query.name ? req.query.name : '';
        const foundStages = await Event.findAll({
            order: [
                ['available_start_time', 'ASC'],
                ['name', 'DESC']
            ],
            where: {
                name: {
                    [Op.iLike] : `%${searchTerm}%`

                }
            }
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
});

// FIND A SPECIFIC EVENT
stages.get('/:id', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { band_id: req.params.id }
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
});

// CREATE

stages.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newStage
        })
    } catch(err) {
        res.status(500).json(err)
    }
});

// UPDATE

stages.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedStages} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
});

// DELETE A BAND
stages.delete('/:id', async (req, res) => {
    try {
        const deletedStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedStages} stages(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
});



module.exports = stages;