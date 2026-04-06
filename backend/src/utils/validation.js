/**
 * Validation Schemas using Joi
 * Defines validation rules for all API inputs
 */

const Joi = require('joi');

const schemas = {
  // Player validation
  createPlayer: Joi.object({
    name: Joi.string().required().min(2).max(255),
    age: Joi.number().integer().min(5).max(150),
    club: Joi.string().max(255),
    nationality: Joi.string().max(100).default('Mongolia'),
  }),

  updatePlayer: Joi.object({
    name: Joi.string().min(2).max(255),
    age: Joi.number().integer().min(5).max(150),
    club: Joi.string().max(255),
    nationality: Joi.string().max(100),
  }).min(1),

  // Tournament validation
  createTournament: Joi.object({
    name: Joi.string().required().min(2).max(255),
    start_date: Joi.date().required(),
    end_date: Joi.date().required().greater(Joi.ref('start_date')),
    location: Joi.string().max(255),
    type: Joi.string().required().valid('National', 'International', 'Club'),
    description: Joi.string(),
  }),

  updateTournament: Joi.object({
    name: Joi.string().min(2).max(255),
    start_date: Joi.date(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    location: Joi.string().max(255),
    type: Joi.string().valid('National', 'International', 'Club'),
    description: Joi.string(),
  }).min(1),

  // Match validation
  createMatch: Joi.object({
    tournament_id: Joi.number().required().integer().positive(),
    player1_id: Joi.number().required().integer().positive(),
    player2_id: Joi.number().required().integer().positive(),
    winner_id: Joi.number().integer().positive().required(),
    played_at: Joi.date().required(),
  }),

  // Match sets validation
  matchSets: Joi.array().items(
    Joi.object({
      set_number: Joi.number().required().integer().positive(),
      player1_score: Joi.number().required().integer().min(0),
      player2_score: Joi.number().required().integer().min(0),
    })
  ).required().min(1),

  // News validation
  createNews: Joi.object({
    title: Joi.string().required().min(5).max(255),
    content: Joi.string().required().min(10),
    published: Joi.boolean().default(false),
  }),

  updateNews: Joi.object({
    title: Joi.string().min(5).max(255),
    content: Joi.string().min(10),
    published: Joi.boolean(),
  }).min(1),

  // Auth validation
  register: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(255),
  }),

  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

/**
 * Middleware to validate request data
 * @param {object} schema - Joi schema to validate against
 * @returns {function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      });
    }

    req.validatedData = value;
    next();
  };
}

module.exports = {
  schemas,
  validate,
};
