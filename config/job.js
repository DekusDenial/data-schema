'use strict';

const Joi = require('joi');
const Regex = require('./regex');

const SCHEMA_MATRIX = Joi.object()
    // IEEE Std 1003.1-2001
    // Environment names contain uppercase letters, digits, and underscore
    // They cannot start with digits
    .pattern(Regex.ENV_NAME, Joi.array().items())
    // All others are marked as invalid
    .unknown(false)
    // Add documentation
    .options({
        language: {
            object: {
                allowUnknown: 'only supports uppercase letters, digits, and underscore (cannot '
                + 'start with digit)'
            }
        }
    });
const SCHEMA_ENVIRONMENT = Joi.object()
    // IEEE Std 1003.1-2001
    // Environment names contain uppercase letters, digits, and underscore
    // They cannot start with digits
    .pattern(Regex.ENV_NAME, Joi.any())
    // All others are marked as invalid
    .unknown(false)
    // Add documentation
    .options({
        language: {
            object: {
                allowUnknown: 'only supports uppercase letters, digits, and underscore (cannot '
                + 'start with digit)'
            }
        }
    });
const SCHEMA_STEP_STRING = Joi.string();
const SCHEMA_STEP_OBJECT = Joi.object()
    // Steps can only be named with A-Z,a-z,0-9,-,_
    // Steps only contain strings (the command to execute)
    .pattern(Regex.STEP_NAME, Joi.string())
    // All others are marked as invalid
    .unknown(false)
    // And there can be only one command per step
    .length(1)
    // Add documentation
    .options({
        language: {
            object: {
                allowUnknown: 'only supports the following characters A-Z,a-z,0-9,-,_'
            }
        }
    });
const SCHEMA_STEP = Joi.alternatives().try(SCHEMA_STEP_STRING, SCHEMA_STEP_OBJECT);
const SCHEMA_STEPS = Joi.array().items(SCHEMA_STEP).min(1);
const SCHEMA_IMAGE = Joi.string();
const SCHEMA_JOB = Joi.object()
    .keys({
        steps: SCHEMA_STEPS,
        environment: SCHEMA_ENVIRONMENT,
        matrix: SCHEMA_MATRIX,
        image: SCHEMA_IMAGE
    })
    .default({});

/**
 * Various components of a Job
 * @type {Object}
 */
module.exports = {
    matrix: SCHEMA_MATRIX,
    steps: SCHEMA_STEPS,
    step: SCHEMA_STEP,
    environment: SCHEMA_ENVIRONMENT,
    image: SCHEMA_IMAGE,
    job: SCHEMA_JOB
};