
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Row, Col, Divider } from 'antd';
import axios from 'axios';


class ColReport extends Component {
  static propTypes = {
    project_id: PropTypes.number,
    id: PropTypes.number
  };
  constructor(props) {
    super(props);

    this.state = {
      reportVisable: false,
      report: {}
    }
  }
  async componentWillMount() {
    let res = await axios.get('/api/col/col_test_report?project_id=' + this.props.project_id + '&id=' + this.props.id);
    console.log(res);
    if (!res.data.errcode) {
      this.setState({ report: res.data.data, isMounted: true });
    }
  }
  jsonFormat(json) {
    // console.log('json',json)
    if (json && typeof json === 'object') {
      return JSON.stringify(json, null, '   ');
    }
    return json;
  }
  render() {
    const { report, isMounted } = this.state;
    let testReport = {};
    if (isMounted) {
      testReport = JSON.parse(report.test_report);
    }
    let oneTestReportTpl = (key, props) => {
      return (
        <div>
          <Divider >{key}:Request and Response Data</Divider>
          <Divider >Request</Divider>
          <Row className="case-report">
            <Col className="case-report-title" span="6">url</Col>
            <Col span="18">{props.url}</Col>
          </Row>
          <Row className="case-report">
            <Col className="case-report-title" span="6">method</Col>
            <Col span="18">{props.method}</Col>
          </Row>
          {props.query ? (
            <Row className="case-report">
              <Col className="case-report-title" span="6">query</Col>
              <Col span="18">{this.jsonFormat(props.query)}</Col>
            </Row>
          ) : null}

          {props.headers ? (
            <Row className="case-report">
              <Col className="case-report-title" span="6">headers</Col>
              <Col span="18">
                <pre>{this.jsonFormat(props.headers)}</pre>
              </Col>
            </Row>
          ) : null}

          {props.data ? (
            <Row className="case-report">
              <Col className="case-report-title" span="6">
                Body
              </Col>
              <Col span="18">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{this.jsonFormat(props.data)}</pre>
              </Col>
            </Row>
          ) : null}

          <Divider >Response</Divider>
          <Row className="case-report">
            <Col className="case-report-title" span="6">code</Col>
            <Col span="18">
              <pre>{props.status}</pre>
            </Col>
          </Row>
          {props.res_header ? (
            <Row className="case-report">
              <Col className="case-report-title" span="6">headers</Col>
              <Col span="18">
                <pre>{this.jsonFormat(props.res_header)}</pre>
              </Col>
            </Row>
          ) : null}
          {props.res_body ? (
            <Row className="case-report">
              <Col className="case-report-title" span="6">
                body
              </Col>
              <Col span="18">
                <pre>{this.jsonFormat(props.res_body)}</pre>
              </Col>
            </Row>
          ) : null}

          <Divider >Validators</Divider>
          {
            props.validRes ? (
              <Row className="case-report">
                <Col className="case-report-title" span="6">验证结果</Col>
                <Col span="18">
                  <pre>
                    {
                      props.validRes.map((item, index) => {
                        return <div key={index}>{item.message}</div>;
                      })
                    }
                  </pre></Col>
              </Row>
            ) : null}
        </div>);
    }
    let testReportTpl = (testReport) => {
      var res = [];
      for (let item in testReport) {
        res.push(<div>{oneTestReportTpl(item, testReport[item])}</div>)
      }
      return res
    }
    return (
      <div>
        <Divider >test drive data</Divider>
        {testReport.variables ? (
          <Row className="case-report">
            <Col className="case-report-title" span="6">variables</Col>
            <Col span="18">{this.jsonFormat(testReport.variables)}</Col>
          </Row>
        ) : null}

        {
          isMounted ? (
            testReportTpl(testReport)
          ) : null
        }
      </div>
    );
  }
}

export default ColReport;



