var Field  = require('../Field'),
	React  = require('react'),
	Select = require('react-select');


module.exports = Field.create({
	displayName: 'WebTranslateIt',

	onFallbackValueChanged: function (event) {
		this.props.onChange({
			path: this.props.path,
			value: {
				key     : this.props.value.key,
				fallback: event.target.value
			}
		});
	},

	onKeyChanged: function (newValue) {
		this.props.onChange({
			path: this.props.path,
			value: {
				key     : newValue,
				fallback: this.props.value.fallback
			}
		});
	},

	renderValue: function() {
		var selected = _.findWhere(this.props.ops, {value: this.props.value.key});
		return <div className="field-value">{selected ? selected.label : null}</div>;
	},

	renderField: function () {
		var fallback = this.props.value.fallback ? this.props.value.fallback : '';
		var key      = this.props.value.key && this.props.value.key !== this.props.ops[0].value ? this.props.value.key : fallback ? this.props.ops[0].value : '';

		return (
			<div>
				<Select ref="focusTarget" name={this.props.paths.key} value={key} options={this.props.ops} onChange={this.onKeyChanged} />
				<input type="text" name={this.props.paths.fallback} placeholder="Fallback if key doesn't exists" value={fallback} onChange={this.onFallbackValueChanged} autoComplete="off" className="form-control" />
			</div>
		);
	}
});
