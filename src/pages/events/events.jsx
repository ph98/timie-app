import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Typography,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import axios from "../../utils/axios";

import "./styles.scss";
const { RangePicker } = DatePicker;

function getEvents() {
  return axios.get("/events").then(({ data }) => data);
}
function createEvent({ title, start: startInput, end: endInput }) {
  const start = dayjs(startInput).format('YYYY-MM-DD')
  const end = dayjs(endInput).format('YYYY-MM-DD')
  return axios.post("/events", { title, start, end }).then(({ data }) => data);
}

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const showModal = searchParams.get("new");
  const { isLoading, data = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const events = useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries("events");
      queryClient.invalidateQueries("events");
      message.success("Event created!");
      navigate("/events");
      form.resetFields();
    },
  });

  return (
    <div className="events-page">
      <Modal
        title="Title"
        open={showModal}
        onOk={() => {
          events.mutate({ 
            title: form.getFieldsValue().title,
            start: form.getFieldsValue().dates[0],
            end: form.getFieldsValue().dates[1],
        });
        }}
        confirmLoading={events.isLoading}
        onCancel={() => {
          navigate("/events");
        }}
      >
        <div className="add-events-inner">
          <Form
            form={form}
            onSubmitCapture={() => {
              console.log('form.getFieldsValue()', form.getFieldsValue())
              events.mutate({ 
                title: form.getFieldsValue().title,     
                start: form.getFieldsValue().dates[0],
                end: form.getFieldsValue().dates[1],
              });
            }}
          >
            <Form.Item name="title">
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item name="dates">
              <RangePicker />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Row className="header">
        <Col>
          <Typography>Events</Typography>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              navigate("/events?new=true");
            }}
          >
            Add events
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="table-col">
          <Table
            loading={isLoading}
            dataSource={data}
            rowKey="_id"
            columns={[
              {
                title: "",
                width: 50,
                dataIndex: "_id",
                render: (id, record, index) => (
                  <Link to={`/events/${id}`}>#{index + 1}</Link>
                ),
              },
              {
                title: "Title",
                dataIndex: "title",
                render: (e) => e || " - ",
              },
              {
                title: "Created",
                dataIndex: "created_at",
                render: (e) => dayjs(e).format("YYYY-MM-DD"),
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
