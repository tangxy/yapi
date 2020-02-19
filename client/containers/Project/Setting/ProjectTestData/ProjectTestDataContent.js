import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectTestData.scss';
// import EditableTable from './EditableTable.js';
import { Row, Col, Form, Input, Select, Button, Table, Divider, Tag, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    lg: { offset: 1, span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 19 },
    xs: { span: 24 },
    sm: { span: 14 }
  },
  className: 'form-item'
};



class ProjectTestDataContent extends Component {
  static propTypes = {
    testDataItem: PropTypes.object,
    columns: PropTypes.array,
    datas: PropTypes.array,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    handleNameInput: PropTypes.func
  };



  initState() {

  }

  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    this._isMounted = true;
    this.initState();
  }


  handleInit() {

  }

  componentWillReceiveProps() {

  }

  handleOk = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err/*, values*/) => {
      if (!err) {
        let assignValue = {};
        onSubmit(assignValue);
      }
    });
  };

  handleAndColumn = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err/*, values*/) => {
      if (!err) {
        let assignValue = {};
        onSubmit(assignValue);
      }
    });
  };
  render() {
    const { testDataItem } = this.props;
    const { getFieldDecorator } = this.props.form;
    const testDataTpl = data => {
      return (
        <div>
          <Row span="32">
            <Col span="6">
              <FormItem {...formItemLayout} required={false} label="数据名称">
                {getFieldDecorator('test.data.name', {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: data.name === '新测试数据' ? '' : data.name || '',
                  rules: [
                    {
                      required: false,
                      whitespace: true,
                      validator(rule, value, callback) {
                        if (value) {
                          if (value.length === 0) {
                            callback('请输入测试数据名称');
                          } else if (!/\S/.test(value)) {
                            callback('请输入测试数据名称');
                          } else {
                            return callback();
                          }
                        } else {
                          callback('请输入测试数据名称');
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={e => this.props.handleNameInput(e.target.value)}
                    placeholder="请输入测试数据名称"
                  />
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} required={false} label="适用范围">
                <Select value="0" defaultValue="0">
                  <Option key="0" value="0">
                    项目所有集合
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="4">
              < div className="btnwrap-changeproject" >
                <Button
                  className="m-btn btn-save"
                  icon="save"
                  type="primary"
                  size="large"
                  onClick={this.handleAndColumn}
                >
                  添加列
                </Button>
              </div>
            </Col>
            <Col span="4">
              < div className="btnwrap-changeproject" >
                <Button
                  className="m-btn btn-save"
                  icon="save"
                  type="primary"
                  size="large"
                  onClick={this.handleOk}
                >
                  添加行
                </Button>
              </div>
            </Col>
            <Col span="4">
              < div className="btnwrap-changeproject" >
                <Button
                  className="m-btn btn-save"
                  icon="save"
                  type="primary"
                  size="large"
                  onClick={this.handleOk}
                >
                  保 存
                </Button>
              </div>
            </Col>
          </Row>
        </div >
      );
    };

    return (
      <div>
        {testDataTpl(testDataItem)}
        <Table columns={this.props.columns} dataSource={this.props.datas} />
      </div >
    );
  }
}
export default Form.create()(ProjectTestDataContent);
