var _         = require('underscore');
var FieldType = require('../Type');
var util      = require('util');
var utils     = require('keystone-utils');

function WebTranslateIt(list, path, options) {
	this._properties = ['ops'];
	options.nofilter = true; // TODO: remove this when 0.4 is merged

	// make an options array out of strings
	var strings   = options.strings;
	var ops       = [];
	var upperCase = function(m, space, letter) {
		return space + letter.toUpperCase();
	};

	for (var s = 0; s < strings.length; s++) {
		var str = strings[s];
		ops.push({
			value: str,
			label: str.replace(/_{1,}/g,' ').replace(/(\s{1,}|\b)(\w)/g, upperCase)
		});
	}

	this.ops      = ops;
	this.labels   = _.pluck(this.ops, 'label');
	this.keys     = _.pluck(this.ops, 'value');
	this.fallback = '';

	WebTranslateIt.super_.call(this, list, path, options);
}
util.inherits(WebTranslateIt, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a virtual for accessing the label of the selected value,
 * and statics to the Schema for converting a value to a label,
 * and retrieving all of the defined options.
 */
WebTranslateIt.prototype.addToSchema = function() {
	var schema = this.list.schema;
	var paths = this.paths = {
		key     : this._path.append('.key'),
		fallback: this._path.append('.fallback')
	};

	schema.nested[this.path] = true;
	schema.add({
		key     : String,
		fallback: String
	}, this.path + '.');

	this.bindUnderscoreMethods();
};


/**
 * Validates that a valid option has been provided in a data object
 */
WebTranslateIt.prototype.validateInput = function(data, required, item) {
	if (required) {
		var key      = data[this.paths.key];
		var fallback = data[this.paths.fallback];
		return fallback !== undefined && fallback !== null && key !== undefined && key !== null;
	} else {
		return true;
	}
};

WebTranslateIt.prototype.isModified = function(item) {
	return item.isModified(this.paths.key) || item.isModified(this.paths.fallback);
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
WebTranslateIt.prototype.updateItem = function(item, data) {
	if (!_.isObject(data)) return;

	var paths = this.paths;
	var path  = paths['key'];
	if (data[path]) {
		item.set(path, data[path]);
	}

	var path = paths['fallback'];
	if (data[path]) {
		item.set(path, data[path]);
	}
};


exports = module.exports = WebTranslateIt;
