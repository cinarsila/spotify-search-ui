import React, { Component } from 'react';
import { render } from 'react-dom';
import { Table, Button, Form, Container, Row, Col, Modal, Spinner } from "react-bootstrap";

const styles = {
  container: {
    margin: 15
  }
}

export default class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackList: [],
      trackFetching: false,
      count: 0,
      showModal: false
    };
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.fetchTrackList = this.fetchTrackList.bind(this)
  }

  handleClose() {
    this.setState({ showModal: false, trackList: [] });
    this.filterForm.reset()
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  fetchTrackList(genre) {
    this.setState({ trackFetching: true })
    fetch(
      `http://localhost:5000/tracks/${genre}`)
      .then(res => {
        this.setState({ trackFetching: false })
        if (res.ok) {
          return res.json()
        } else if (res.status === 404) {
          throw Error(`Genre not found`);
        }
      })
      .then(res => this.setState({ trackList: res }))
      .catch((error) => {
        this.handleShow()
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.fetchTrackList(this.input.value)
  }

  renderModal() {
    return (
      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Body>Searched genre not found !</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderFilter() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)} ref={form => this.filterForm = form}>
        <Form.Row>
          <Form.Group as={Col} md="4" controlId="genreId">
            <Form.Control ref={(ref) => { this.input = ref }} type="text" placeholder="Genre" />
          </Form.Group >
          <Col md={4}>
            <Button variant="primary" size="md" type="submit">Search</Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }

  renderTable() {
    const { trackList, trackFetching } = this.state;
    var rowCounter = 0;

    var tableTrackRows;

    if (trackList.length > 0) {
      var artistName = trackList[0].artistName;
      tableTrackRows = trackList.map((track) => {
        rowCounter++;
        return (
          <tr>
            <td>{rowCounter}</td>
            <td>{artistName}</td>
            <td>{track.trackName}</td>
            <td><img src={track.image} width='50px' height='50px'></img></td>
            <td><a href={track.previewUrl}>{track.previewUrl}</a></td>
          </tr>
        );
      })
    }
    else {
      tableTrackRows = <tr>
        <th></th>
        <th></th>
        <th>No data found</th>
        <th></th>
        <th></th>
      </tr>;
    }

    if (trackFetching) {
      return (
        <div>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
        </div>)
    }

    return (
      <Table striped bordered condensed hover variant="dark">
        <style type="text/css">
          {`
              .table thead th {
                width: 10px;
                text-align: center;
              }
              .table-dark td, .table-dark th, .table-dark thead th {
                width: 10px;
                text-align: center;
              } 
            `}
        </style>

        <thead>
          <tr>
            <th>#</th>
            <th>Artist Name</th>
            <th>Track Name</th>
            <th>Image</th>
            <th>Preview Url</th>
          </tr>
        </thead>
        <tbody>
          {
            tableTrackRows
          }
        </tbody>
      </Table>
    );

  }

  render() {
    return (
      <Container style={styles.container}>
        {this.renderModal()}
        {this.renderFilter()}
        {this.renderTable()}
      </Container>
    );
  }
}
