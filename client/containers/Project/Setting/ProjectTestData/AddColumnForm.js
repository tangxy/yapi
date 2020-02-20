import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddColumnForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values.columnName, () => {
          this.props.form.resetFields();
        });

      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    return (

      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="列名">
          {getFieldDecorator('columnName', {})(
            <Input placeholder="列名(必须英文字母)" />
          )}
        </FormItem>

        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            确定
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddColumnForm);
