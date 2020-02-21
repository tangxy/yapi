import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
const FormItem = Form.Item;
const { TextArea } = Input;

class ExportTestDataForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    csvdata: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }
  render() {
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
      <Form >
        <FormItem {...formItemLayout} label="CSV数据:">
          <TextArea value={this.props.csvdata || ''} autoSize={{ minRows: 10, maxRows: 20 }} style={{ height: "300px" }} />
        </FormItem>
        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >关闭</Button>
        </FormItem>
      </Form >
    );
  }
}

export default Form.create()(ExportTestDataForm);
