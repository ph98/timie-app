import { Button, Checkbox, Col, Form, Row, Table } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import "./styles.scss";

const weekdays = [...Array(7).keys()].map((i) => dayjs().startOf("week").add(i, "day"));
const hours = [...Array(18).keys()].map((i) => i + 6);

const columns = [
  {
    title: "Hour",
    dataIndex: "id",
    width: 50,
  },
  ...weekdays.map((weekday) => ({
    render: (hour: number) => <Form.Item name={`${weekday.day()}-${hour}`} valuePropName='checked'><Checkbox /></Form.Item>,
    dataIndex: 'id',
    title: weekday.format("ddd"),
  })),
];


const EventPage = () => {
  const { id } = useParams();

  return (
    <div className="event-page">
      <header>Event # {id}</header>
      <Form onFinish={e=>{
        console.log('e :>> ', e);
      }}>
        <Row>
          <Col className="table-col">
            <Table
              className="event-table"
              pagination={false}
              rowKey="id"
              columns={columns}
              dataSource={hours.map((hour) => ({
                id: hour,
              }))}
              bordered
            />
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default EventPage;
