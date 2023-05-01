import { Avatar, Button, Col, Row, Table, Typography, message } from "antd";
import { useParams } from "react-router-dom";

import WeeklyPicker from "../../components/weekly-calendar";
import axios from "../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import "./styles.scss";
import dayjs from "dayjs";
import userContext from "../../context/userContext";

const fetchEventData = (id: string) =>
  axios.get(`/events/${id}`).then(({ data }) => data);

const addVotes = ({ id, votes }: any) =>
  axios.post(`/events/${id}`, { votes }).then(({ data }) => data);

const EventPage = () => {
  const [selected, setSelected] = useState<any>([]);
  const { id } = useParams();

  const { user } = useContext(userContext);

  const { data = {}, isLoading } = useQuery(
    ["event", id],
    () => fetchEventData(id || ""),
    {
      onSettled: (data) => {
        const myVote = data.votes.find(({ by }: any) => by._id === user._id);
        if (myVote) {
          setSelected(myVote.votes);
        }
      },
    }
  );

  const queryClient = useQueryClient();

  const eventItem = useMutation({
    mutationFn: addVotes,
    onSuccess: async (newEvent) => {
      message.success("Vote added!");
      await queryClient.cancelQueries({ queryKey: ["event", newEvent.id] });
      queryClient.invalidateQueries(["event"]);
    },
  });

  const startDate = dayjs(data.event.start);
  const endDate = dayjs(data.event.end || dayjs(startDate).add(1, 'week'));
  return (
    <div className="event-page">
      <Row>
        <Typography.Title level={2} className="month-title">
          {startDate.format("MMMM")} <span>{startDate.format("YYYY")}</span>
        </Typography.Title>

        <Typography.Title level={3} className="title">
          - {data.event?.title}
        </Typography.Title>
      </Row>

      <Row>
        <Col className="table-col">
          <WeeklyPicker
            setSelectedCells={setSelected}
            selectedCells={selected}
            data={data.votes}
            start={startDate}
            end={endDate}
          />
        </Col>
      </Row>
      <Row justify="end">
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
      <Row>
        <Typography>Voters:</Typography>
      </Row>

      <Row justify="center">
        <Col>
          <Table
            rowKey="_id"
            columns={[
              {
                title: "",
                dataIndex: ["by", "image"],
                render: (image) => <Avatar size={"small"} src={image} />,
              },
              { title: "Name", dataIndex: ["by", "name"] },
              {
                dataIndex: "created_at",
                title: "Date",
                render: (date) => dayjs(date).format("YYYY/MM/DD HH:mm"),
              },
              { title: "Votes", dataIndex: ["votes", "length"] },
            ]}
            loading={isLoading}
            dataSource={data.votes}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EventPage;
