import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {AgGridReact} from 'ag-grid-react';
import { geolocated } from "react-geolocated";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

let today = new Date()

class App extends React.Component {

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  state = {
    currentYear: (today.getFullYear()).toString(),
    currentMonth: ((today.getMonth()-1)).toString(),
    currentYearNearMe: (today.getFullYear()).toString(),
    currentMonthNearMe: ((today.getMonth()-1)).toString(),
    policeForces: '',
    selectedForce: '',
    selectedForceName: 'Leicestershire',
    selectedForceDate: today.getFullYear() + '-' + (today.getMonth()-1),
    rowData: [],
    columnDefs: [
      {
        field: "crime",
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200
      },
      {
        field: "date",
        width: 100
      },
      {
        field: "outcome",
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 400
      },
      {
        field: "locationtype",
        headerName: 'Location Type'
      }
    ]
  }

  componentDidMount() {
    fetch(`https://data.police.uk/api/forces`)
    .then(response => response.json())
    .then(data => this.setState({
      policeForces: data
    }))
  }

  onGridReady = params => {
  //   fetch(`https://data.police.uk/api/crimes-no-location?category=all-crime&force=leicestershire&date=2021-08`)
  //   .then(response => response.json())
  //   .then(data => {
  //     let newRowData = []
  //     data.forEach(crime => {
  //     newRowData.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: crime.outcome_status.category})
  //   })
  //   this.setState({ rowData: newRowData })
  // })
  }

  selectedForce = event => {
    this.setState({
      selectedForce: event.target.id,
      selectedForceName: event.target.innerHTML
    })
    fetch(`https://data.police.uk/api/crimes-no-location?category=all-crime&force=${event.target.id}`)
    .then(response => response.json())
    .then(data => {
      let newRowDataForce = []
      if (data !== []) {
        data.forEach(crime => {
          if (crime.outcome_status !== null) {
            newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: crime.outcome_status.category})
          }
          else {
            newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: "Unknown"})
          }
          
        })
        this.setState({ rowData: newRowDataForce })
      }
      else {
        this.setState({ rowData: [] })
      }
    })
  }

  setNewDate = event => {
    this.setState({
      currentYear: event.target.parentElement.children[0].value,
      currentMonth: event.target.id
    })
    fetch(`https://data.police.uk/api/crimes-no-location?category=all-crime&force=${this.state.selectedForce}&date=${event.target.parentElement.children[0].value + '-' + event.target.id}`)
    .then(response => response.json())
    .then(data => {
      let newRowDataForce = []
      if (data !== []) {
        data.forEach(crime => {
          if (crime.outcome_status !== null) {
            newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: crime.outcome_status.category})
          }
          else {
            newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: "Unknown"})
          }
          
        })
        this.setState({ rowData: newRowDataForce })
      }
      else {
        this.setState({ rowData: [] })
      }
    })
    .catch(function(err) {
      alert('no data')
    })
  }

  setNewDateNearMe = event => {
    this.setState({
      currentYear: event.target.parentElement.children[0].value,
      currentMonth: event.target.id
    })
    if (this.props.coords) {
      console.log(this.props.coords.latitude)
        console.log(this.props.coords.longitude)
        fetch(`https://data.police.uk/api/crimes-at-location?date=${event.target.parentElement.children[0].value}-${event.target.id}&lat=${this.props.coords.latitude}&lng=${this.props.coords.longitude}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          let newRowDataForce = []
          if (data !== []) {
            data.forEach(crime => {
              if (crime.outcome_status !== null) {
                newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: crime.outcome_status.category, locationtype: crime.location_type})
              }
              else {
                newRowDataForce.push({crime: crime.category.replaceAll('-', ' '), date: crime.month, outcome: "Unknown"})
              }
              
            })
            this.setState({ rowData: newRowDataForce })
          }
          else {
            this.setState({ rowData: [] })
          }
        })
    }
  }
  
render() {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  let maxOffset = 60
  let thisYear = (new Date()).getFullYear()
  let availableYears = []
    for (let i = 0; i < maxOffset; i++) {
      availableYears.push(thisYear - i)
    }
   return (
     <div>
       <h3 style={{marginLeft: "15px", marginTop: '15px'}}>Currently showing data for {this.state.currentYear}-{this.state.currentMonth}</h3>
       <Dropdown style={{ display: 'inline-flex' }}>
        <Dropdown.Toggle style={{marginBottom: '15px', marginLeft: '15px', marginRight: '15px'}}variant="secondary" id="dropdown-basic">
          Select Area
        </Dropdown.Toggle>

        <Dropdown.Menu style={{maxHeight: '300px', overflowY: 'scroll'}}>
          {this.state.policeForces !== '' ? this.state.policeForces.map(force => {
            return <Dropdown.Item id={force.id} onClick={this.selectedForce}>{force.name}</Dropdown.Item>}) : ""}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown style={{ display: 'inline-flex' }}>
      <Dropdown.Toggle style={{marginBottom: '15px', marginLeft: '15px', marginRight: '15px'}} variant="secondary">
          Select Month
        </Dropdown.Toggle>
        <Dropdown.Menu>
        <Accordion defaultActiveKey="0" style={{ display: 'inline-flex', width: '600px'}}>
        <Accordion.Item eventKey="0" style={{ width: '600px'}}>
          <Accordion.Header>Select Month</Accordion.Header>
          <Accordion.Body >
            <Form.Select aria-label="Default select example">
              <option id="year-select">Select Year</option>
                {availableYears.map(year => {
                    return <option id={year}>{year}</option>
                  })}
            </Form.Select>
            {months.map(month => {
              let monthIndex = (months.indexOf(month) + 1).toString()
              if (monthIndex.length === 1) {
                monthIndex = "0"+monthIndex
              }
              return <Button onClick={this.setNewDate} style={{marginTop: '10px', marginLeft: '10px'}} variant="outline-secondary" id={monthIndex}>{month}</Button>
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown style={{ display: 'inline-flex' }}>
      <Dropdown.Toggle style={{marginBottom: '15px', marginLeft: '15px', marginRight: '15px'}} variant="primary">
          Crimes Near Me
        </Dropdown.Toggle>
        <Dropdown.Menu>
        <Accordion defaultActiveKey="0" style={{ display: 'inline-flex', width: '600px'}}>
        <Accordion.Item eventKey="0" style={{ width: '600px'}}>
          <Accordion.Header>Select Month</Accordion.Header>
          <Accordion.Body >
            <Form.Select aria-label="Default select example">
              <option id="year-select">Select Year</option>
                {availableYears.map(year => {
                    return <option id={year}>{year}</option>
                  })}
            </Form.Select>
            {months.map(month => {
              let monthIndex = (months.indexOf(month) + 1).toString()
              if (monthIndex.length === 1) {
                monthIndex = "0"+monthIndex
              }
              return <Button onClick={this.setNewDateNearMe} style={{marginTop: '10px', marginLeft: '10px'}} variant="outline-secondary" id={monthIndex}>{month}</Button>
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
        </Dropdown.Menu>
      </Dropdown>

       <div className="ag-theme-alpine" style={{height: 600, width: 1200}}>
           <AgGridReact
               rowData={this.state.rowData}
               onGridReady={this.onGridReady}
               columnDefs={this.state.columnDefs}
            >
           </AgGridReact>
       </div>
      </div>
   );
}
};

export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App);
