import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'

import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

let policeData = []

fetch(`https://data.police.uk/api/crimes-no-location?category=all-crime&force=leicestershire`)
.then(response => response.json())
.then(data => console.log(data));

const rowData = [
  {make: "Toyota", model: "Celica", price: 35000},
  {make: "Ford", model: "Mondeo", price: 32000},
  {make: "Porsche", model: "Boxter", price: 72000}
];

class App extends React.Component {

  state = {
    policeForces: ''
  }

  componentDidMount() {
    fetch(`https://data.police.uk/api/forces`)
    .then(response => response.json())
    .then(data => this.setState({
      policeForces: data
    }))
  }
  
render() {
   return (
     <div>
       <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.state.policeForces !== '' ? this.state.policeForces.map(force => {
            return <Dropdown.Item>{force.name}</Dropdown.Item>}) : ""}
            
          {/* <Dropdown.Item href="#/action-1">{policeForces[0][0].name}</Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={rowData}>
               <AgGridColumn field="make"></AgGridColumn>
               <AgGridColumn field="model"></AgGridColumn>
               <AgGridColumn field="price"></AgGridColumn>
           </AgGridReact>
       </div>
      </div>
   );
}
};

export default App;
