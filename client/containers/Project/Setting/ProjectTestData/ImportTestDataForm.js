import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
const FormItem = Form.Item;
const { TextArea } = Input;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ImportTestDataForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values.csvdata, () => {
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
        <FormItem {...formItemLayout} label="CSV数据:">
          {getFieldDecorator('csvdata')(<TextArea rows={8} placeholder="请输入或粘贴待导入数据" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="说明:">
          <span style={{ color: "#FF0000" }}>
            1、待导入数据中第一列必须是英文列名,且不能使用列名 key
            2、数据分隔符必须是逗号
            3、数据表格中定义的列名与csv中列名相同数据将被导入,其他列将被忽略
          </span>
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

export default Form.create()(ImportTestDataForm);
