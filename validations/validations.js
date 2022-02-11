const Joi = require('joi');

const postSchema = Joi.object({
    flame_s: Joi.number()
        .min(0)
        .max(100)
        .required(),
    flame_e: Joi.number()
        .min(0)
        .max(100)
        .required(),
    candle_s: Joi.number()
        .min(0)
        .max(100)
        .required(),
    candle_e: Joi.number()
        .min(0)
        .max(100)
        .required(),
    date_s: Joi.date()
        .required(),
    date_e: Joi.date()
        .required(),
    win: Joi.number()
        .min(0)
        .max(100)
        .required(),
    loss: Joi.number()
        .min(0)
        .max(100)
        .required(),
    symbol: Joi.string()
        .required(),
    volume_s: Joi.number()
        .min(0)
        .required(),
    volume_e: Joi.number()
        .min(0)
        .required(),
    trade_s: Joi.number()
        .min(0)
        .required(),
    trade_e: Joi.number()
        .min(0)
        .required(),
    full: Joi.boolean()
        .required()
    
});

const validation = (schema)=> {
    const validationMiddleware = (req, _, next)=> {
        const {error} = schema.validate(req.body);
        if(error){
            error.status = 400;
            next(error);
        }
        next();
    }

    return validationMiddleware;
}

module.exports = {
    postSchema,
    validation,
}
