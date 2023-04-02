import { Button, Col, Form, Row, message } from "antd";
import { useParams } from "react-router-dom";

import WeeklyPicker from "../../components/weekly-calendar";
import axios from "../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import "./styles.scss";

const fetchEventData = (id: string) =>
  axios.get(`/events/${id}`).then(({ data }) => data);

const addVotes = ({id, votes}: any) =>
  axios.post(`/events/${id}`, { votes }).then(({ data }) => data);

const EventPage = () => {

  const [selected, setSelected] = useState([])
  const { id } = useParams();

  const { data = {}, isLoading } = useQuery(["event", id], () =>
    fetchEventData(id || "")
  );
  const queryClient = useQueryClient()

  const eventItem = useMutation({
    mutationFn: addVotes,
    onMutate: async (newEvent)=>{
      await queryClient.cancelQueries({ queryKey: ['event', newEvent.id] })

      // Snapshot the previous value
      const previousEvent = queryClient.getQueryData(['event', newEvent.id])
  
      // Optimistically update to the new value
      queryClient.setQueryData(['event', newEvent.id], newEvent)
      queryClient.invalidateQueries(['event'])
      // Return a context with the previous and new todo
      return { previousEvent, newEvent }
    },
    onSettled: (data)=>{
      message.success('Vote added!')
    }
  });
  
  return (
    <div className="event-page">
      <header>Event: {data.event?.title}</header>
      <Form
        onFinish={(e) => {
          console.log("e :>> ", e);
        }}
      >
        <Row>
          <Col className="table-col">
            <WeeklyPicker onChange={setSelected} />
          </Col>
        </Row>
        <Row>
          <Button type="primary" onClick={() => eventItem.mutate({id, votes: selected})}>
            Submit
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default EventPage;
