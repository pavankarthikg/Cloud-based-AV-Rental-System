import React, { Component } from "react";
import Input from "./input";
import {Checkbox} from "antd";
import Joi from "joi-browser";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleCheckboxChange = ({name, value}) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty({name, value});
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];    const data = { ...this.state.data };
    data[name] = value;
    this.setState({ data, errors });
  }

  renderButton = (label, onClick) => {
    return (
      <button
        disabled={this.validate()}
        className="btn btn-dark"
        onClick={onClick}
      >
        {label}
      </button>
    );
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        error={errors[name]}
        value={data[name]}
        onChange={this.handleChange}
      ></Input>
    );
  };

  renderRadioOptions = (name, label, type) => {
    return (
        <div className="form-check">
          <label className="form-check-label">
            <input
                className="form-check-input"
                type={type}
                value={label}
                onChange={this.handleChange}
                name={name}
            ></input>
            {label}
          </label>
        </div>
    );
  }

  renderCheckbox = (name, label) => {
    return (
        <div className="form-group d-flx">
          <label htmlFor={name}>{label}</label>
          <div className="form-check-label flx-1">
            <Checkbox onChange={(e) => this.handleCheckboxChange({name, value: e.target.checked.toString()})}/>
          </div>
        </div>
    );
  };
}

export default Form;
