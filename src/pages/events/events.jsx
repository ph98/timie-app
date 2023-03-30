import { Button, Col, Row, Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";

import "./styles.scss";

function getEvents() {
  return axios.get("/events").then(({ data }) => data);
}
const EventsPage = () => {
  const { isLoading, data = { data: [] } } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  
  return (
    <div className="events-page">
      <Row className="header">
        <Col>
          <Typography>Events</Typography>
        </Col>
        <Col>
          <Button type="primary" size="large">
            Add events
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="table-col">
          <Table
            loading={isLoading}
            dataSource={data.data}
            rowKey="id"
            columns={[
              {
                title: "id",
                width: 50,
                dataIndex: "id",
                render: (id) => <Link to={`/events/${id}`}>#{id}</Link>,
              },
              {
                title: "name",
                dataIndex: "attributes",
                render: (e) => e.name || " - ",
              },
              {
                title: "Created",
                dataIndex: "attributes",
                render: (e) => dayjs(e.createdAt).format("YYYY-MM-DD"),
              },
              {
                title: "actions",
                key: "link",
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EventsPage;
