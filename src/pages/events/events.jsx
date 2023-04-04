import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios";

import "./styles.scss";

function getEvents() {
  return axios.get("/events").then(({ data }) => data);
}
function createEvent({title}){
  return axios.post('/events', {title}).then(({ data }) => data);
}

const EventsPage = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const showModal = searchParams.get('new')
  const { isLoading, data = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const [form] = Form.useForm();

  const queryClient = useQueryClient()

  const events = useMutation({
    mutationFn: createEvent,
    onMutate: async (newEvent) =>{
      await queryClient.cancelQueries({ queryKey: ['events', newEvent.id] })

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(['events', newEvent.id])
  
      // Optimistically update to the new value
      queryClient.setQueryData(['events', newEvent.id], newEvent)
      queryClient.invalidateQueries('events')
      // Return a context with the previous and new todo
      return { previousEvents, newEvent }
    },
    onSuccess: ()=>{
      navigate('/events')
    }
    
  })


  return (
    <div className="events-page">
      <Modal
        title="Title"
        open={showModal}
        onOk={()=>{
          events.mutate({title: form.getFieldsValue().title})
        }}
        confirmLoading={events.isLoading}
        onCancel={()=>{
          navigate('/events')
        }}
      >
        <div className="add-events-inner">
          <Form form={form}>
            <Form.Item name='title'>
              <Input placeholder="Title"/>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Row className="header">
        <Col>
          <Typography>Events</Typography>
        </Col>
        <Col>
          <Button type="primary" size="large" onClick={()=>{
            navigate('/events?new=true')
          }}>
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
                title: "id",
                width: 50,
                dataIndex: "_id",
                render: (id, record, index) => <Link to={`/events/${id}`}>#{index+1 }</Link>,
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
