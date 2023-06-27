// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event, MeetGreet, Band, SetTime, Stage } = db;
const { Op } = require('sequelize');


events.get('/', async (req, res) => {
    const { name } = req.params;
    try {
        const foundEvent = await Event.findOne({
            where: { name },
            include: [
                {
                    model: MeetGreet,
                    as: 'meet_greets',
                    attributes: {
                        exclude: ['event_id', 'band_id']
                    },
                    include: {
                        model: Band, 
                        as: 'band',
                        attributes: {
                            exclude: ['band_id', 'genre', 'recommendation']
                        }
                    }
                },
                {
                    model: SetTime,
                    as: 'set_times',
                    attribute: {
                        exclude: ['event_id', 'band_id', 'stage_id', 'set_time_id']
                    },
                    include: [
                        { 
                            model: Band,
                            as: 'band'
                        },
                        {
                            model: Stage,
                            as: 'stage'
                        }
                    ]  
                },
                {
                    model: Stage,
                    as: 'stages',
                    through: { attributes: [] }
                }
            ]
        });
        if (!foundEvent) {
            res.status(404).json({ message: 'Cound not find Event'})
        } else {
            res.status(200).json(foundEvent);
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
});

events.get("/:name", async (req, res) => {
    const { event= ''} = req.query

    try {
        
        const foundEvent = await Event.findOne({
            where: { name: req.params.name },
            include: [
                {
                    model: MeetGreet,
                    as: "meet_greets",
                    attributes: {
                      exclude: ['event_id', 'band_id']  
                    },
                    include: [
                        {
                            model: Band,
                            as: 'band',
                            attributes: {
                                exclude: ['band_id', 'genre', 'recommendation']
                            }
                        }
                    ]
                },
                {
                    model: SetTime,
                    as: 'set_times',
                    include: {
                        model: Event,
                        as: 'event',
                        where: {
                            name: {
                            [Op.iLike] : `%${event}%`
                            }
                        }
                    }
                }
            ],
        });
        res.status(200).json(foundBand);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

module.exports = events