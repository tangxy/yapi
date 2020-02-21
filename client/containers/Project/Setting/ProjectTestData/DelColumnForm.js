import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
const FormItem = Form.Item;

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
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class DelColumnForm extends Component {
  static propTypes = {
    columns: PropTypes.array,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values, () => {
          this.props.form.resetFields();
        });

      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (

      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="可选列">
          {getFieldDecorator('checkbox-group')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {
                  this.props.columns && this.props.columns.map(item => {
                    return (
                      <div key={item}>
                        {item !== "key" ?
                          <Col span={8}>
                            <Checkbox value={item}>{item}</Checkbox>
                          </Col> : <div></div>}
                      </div>
                    );
                  })
                }
              </Row>
            </Checkbox.Group>,
          )}
        </Form.Item>
        <FormItem {...formItemLayout} label="注意:">
          <span style={{ color: "#FF0000" }}>数据中的整列将被删除，请谨慎操作</span>
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

export default Form.create()(DelColumnForm);
