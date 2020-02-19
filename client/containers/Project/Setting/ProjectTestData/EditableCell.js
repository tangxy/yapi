import React from 'react';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
import PropTypes from 'prop-types';
import { Input } from 'antd';


class EditableCell extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    editable: PropTypes.bool,
    onChange: PropTypes.func
  };
  state = {
    value: this.props.value,
    editable: false
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });

  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                onBlur={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.edit()}
              >
                {value || ' '}
              </div>

            </div>
        }
      </div>
    );
  }
}

export default EditableCell;
