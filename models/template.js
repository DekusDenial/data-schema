'use strict';

const Joi = require('joi');
const mutate = require('../lib/mutate');
const Template = require('../config/template');
const pipelineId = Joi.reach(require('./pipeline').base, 'id');

const MODEL = {
    id: Joi
        .number().integer().positive()
        .description('Identifier of this template')
        .example(123345),

    createTime: Joi
        .string()
        .isoDate()
        .max(32)
        .description('When this template was created')
        .example('2038-01-19T03:14:08.131Z'),

    labels: Joi
        .array()
        .items(Joi.string())
        .description('Labels for template')
        .example(['stable', 'latest', 'beta']),

    config: Template.config,
    namespace: Template.namespace,
    name: Joi
        .string()
        .max(64)
        .description('Template name')
        .example('nodejs/lib'),
    version: Template.version,
    description: Template.description,
    maintainer: Template.maintainer,
    images: Template.images,
    pipelineId
};

module.exports = {
    /**
     * All the available properties of Template
     *
     * @property base
     * @type {Joi}
     */
    base: Joi.object(MODEL).label('Template'),

    /**
     * Properties for template that will come back during a GET request
     *
     * @property get
     * @type {Joi}
     */
    get: Joi.object(mutate(MODEL, [
        'id', 'labels', 'config', 'name', 'version', 'description', 'maintainer', 'pipelineId'
    ], ['namespace', 'images', 'createTime'])).label('Get Template'),

    /**
     * Properties for template that will be passed during a CREATE request
     *
     * @property create
     * @type {Joi}
     */
    create: Joi.object(mutate(MODEL, [
        'config', 'name', 'version', 'description', 'maintainer'
    ], ['labels', 'namespace', 'images'])).label('Create Template'),

    /**
     * Properties for template that will be passed during a UPDATE request
     *
     * @property update
     * @type {Joi}
     */
    update: Joi.object(mutate(MODEL, [], ['labels']))
        .label('Update Template'),

    /**
     * List of fields that determine a unique row
     *
     * @property keys
     * @type {Array}
     */
    keys: ['namespace', 'name', 'version'],

    /**
     * List of all fields in the model
     * @property allKeys
     * @type {Array}
     */
    allKeys: Object.keys(MODEL),

    /**
     * List of indexes to create in the datastore
     *
     * @property indexes
     * @type {Array}
     */
    indexes: ['namespace', 'name'],

    /**
     * Primary column to sort queries by.
     * This defines queries to optionally sort a query result set by id.
     * Each range key matches up with an element in the indexes property
     *
     * @property rangeKeys
     * @type {Array}
     */
    rangeKeys: ['id', 'id'],

    /**
     * Tablename to be used in the datastore
     *
     * @property tableName
     * @type {String}
     */
    tableName: 'templates'
};
