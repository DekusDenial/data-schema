'use strict';

const Joi = require('joi');
const Regex = require('../config/regex');

const SCHEMA_USER = Joi.object().keys({
    url: Joi.string()
        .uri()
        .required()
        .label('Link to Profile')
        .example('https://github.com/stjohnjohnson'),

    name: Joi.string()
        .required()
        .label('Display Name')
        .example('Dao Lam'),

    username: Joi.string()
        .required()
        .label('Username')
        .example('d2lam'),

    avatar: Joi.string()
        .uri()
        .required()
        .label('Link to Avatar')
        .example('https://avatars.githubusercontent.com/u/622065?v=3')
}).label('SCM User');

const SCHEMA_REPO = Joi.object().keys({
    name: Joi.string()
        .required()
        .label('Organization and repository name')
        .example('screwdriver-cd/screwdriver'),

    branch: Joi.string()
        .required()
        .label('Branch of the repository')
        .example('master'),

    url: Joi.string()
        .uri()
        .required()
        .label('Link to Repository')
        .example('https://github.com/screwdriver-cd/screwdriver/tree/master')
}).label('SCM Repository');

const SCHEMA_COMMAND = Joi.object().keys({
    name: Joi.equal('sd-checkout-code')
        .required()
        .label('Command name')
        .example('sd-checkout-code'),

    command: Joi.string()
        .required()
        .label('Checkout command to run')
}).label('SCM Command');

const SCHEMA_COMMIT = Joi.object().keys({
    message: Joi.string()
        .required()
        .label('Commit message')
        .example('Fixing a bug with signing'),

    author: SCHEMA_USER
        .required()
        .label('Author of the commit'),

    url: Joi.string()
        .uri()
        .required()
        .label('Link to commit')
        .example('https://github.com/scredriver-cd/screwdriver/commit/8843d7f92416211de')
}).label('SCM Commit');

const SCHEMA_PR = Joi.object().keys({
    url: Joi.string()
        .uri()
        .label('Link to PR')
        .example('https://git.ouroath.com/MAILSERVICES/gdpr-event-processor/pull/1')
}).label('SCM Pull Request');

const SCHEMA_HOOK = Joi.object().keys({
    action: Joi.string()
        .when('type', { is: 'pr',
            then: Joi.valid(['opened', 'reopened', 'closed', 'synchronized']) })
        .when('type', { is: 'repo', then: Joi.valid('push') })
        .when('type', { is: 'ping', then: Joi.allow('').optional(), otherwise: Joi.required() })
        .label('Action of the event'),

    branch: Joi.string()
        .when('type', { is: 'ping', then: Joi.allow('').optional(), otherwise: Joi.required() })
        .label('Branch of the repository'),

    checkoutUrl: Joi
        .string().regex(Regex.CHECKOUT_URL)
        .required()
        .label('Checkout URL for the application')
        .example('git@github.com:screwdriver-cd/data-schema.git#master')
        .example('https://github.com/screwdriver-cd/data-schema.git#master'),

    hookId: Joi.string()
        .allow('')
        .optional()
        .label('Uuid of the event'),

    lastCommitMessage: Joi.string()
        .allow('')
        .optional()
        .label('Last commit message'),

    prNum: Joi.number()
        .integer()
        .positive()
        .optional()
        .label('PR number'),

    prRef: Joi.string()
        .allow('')
        .optional()
        .label('PR reference of the repository'),

    prSource: Joi.string()
        .allow('')
        .when('type', {
            is: 'pr',
            then: Joi.valid(['fork', 'branch'])
        })
        .optional()
        .label('PR original source'),

    scmContext: Joi
        .string().max(128)
        .required()
        .description('The SCM in which the repository exists')
        .example('github:github.com'),

    sha: Joi.string().hex()
        .when('type', { is: 'ping', then: Joi.allow('').optional(), otherwise: Joi.required() })
        .label('Commit SHA')
        .example('ccc49349d3cffbd12ea9e3d41521480b4aa5de5f'),

    type: Joi.string()
        .valid(['pr', 'repo', 'ping'])
        .required()
        .label('Type of the event'),

    username: Joi.string()
        .required()
        .label('Username')
        .example('d2lam')
}).label('SCM Hook');

module.exports = {
    command: SCHEMA_COMMAND,
    commit: SCHEMA_COMMIT,
    repo: SCHEMA_REPO,
    user: SCHEMA_USER,
    hook: SCHEMA_HOOK,
    pr: SCHEMA_PR
};
