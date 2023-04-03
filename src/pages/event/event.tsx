import { Button, Col, Form, Row, Table, Typography, message } from "antd";
import { useParams } from "react-router-dom";

import WeeklyPicker from "../../components/weekly-calendar";
import axios from "../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import "./styles.scss";
import dayjs from "dayjs";

const fetchEventData = (id: string) =>
  axios.get(`/events/${id}`).then(({ data }) => data);

const addVotes = ({ id, votes }: any) =>
  axios.post(`/events/${id}`, { votes }).then(({ data }) => data);

const EventPage = () => {
  const [selected, setSelected] = useState([]);
  const { id } = useParams();

  const { data = {}, isLoading } = useQuery(["event", id], () =>
    fetchEventData(id || "")
  );

  console.log("data", data);
  const queryClient = useQueryClient();

  const eventItem = useMutation({
    mutationFn: addVotes,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["event", newEvent.id] });

      // Snapshot the previous value
      const previousEvent = queryClient.getQueryData(["event", newEvent.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(["event", newEvent.id], newEvent);
      queryClient.invalidateQueries(["event"]);
      // Return a context with the previous and new todo
      return { previousEvent, newEvent };
    },
    onSettled: (data) => {
      message.success("Vote added!");
    },
  });

  const startDate = dayjs()
  return (
    <div className="event-page">
      <header>Event: {data.event?.title}</header>

      <Typography.Title level={2} className="month-title">
        {startDate.format('MMMM')}
        {' '}
        <span>{startDate.format('YYYY')}</span>
      </Typography.Title>
      <Row>
        <Col className="table-col">
          <WeeklyPicker onChange={setSelected} />
        </Col>
      </Row>
      <Row>
        <Typography>Voters:</Typography>
      
      </Row>
      <Row>
      <Table
          columns={[{ title: "Name", dataIndex: "by" },
        {
          dataIndex: 'created_at', title: 'Date'
        }]}
          dataSource={data.votes}
        />
      </Row>
      <Row justify="center">
        <Col>
          <Button
            size="large"
            type="primary"
            onClick={() => eventItem.mutate({ id, votes: selected })}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default EventPage;
