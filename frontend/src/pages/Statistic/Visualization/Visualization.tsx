import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import EventBus from 'eventing-bus';
import Button from '@material-ui/core/Button';
import {VictoryPie, VictoryAxis, VictoryChart, VictoryTheme, VictoryBar} from 'victory';
import {BlockEventType} from 'common/shared.definition';
import './Visualization.scss';
interface VictoryPieData {
  x: string;
  y: number;
  label: string;
}
const Visualization = (props) => {
  const [pieData, setPieData] = useState<{x: string; y: number}[]>([]);
  const [barData, setBarData] = useState<{x: string; y: number}[]>([]);
  const isNumeric = (val: string) => /^\d+$/.test(val);
  
  const generatePieDataGender = (data: any[]) => {
    const stat = { 'Male': 0, 'Female': 0, 'Unknown': 0}
    for (const row of data) {
      const sex = row['Gender']
      if (sex === 'Male' || sex === 'Female'){
        stat[sex] +=1
      }else {
        stat['Unknown'] +=1
      }
    }

    const pieStat: {x: string; y: number}[] = Object.keys(stat).map((label) => ({x: label, y: stat[label]}));
    setPieData(pieStat);
  }
  const generateBarData = (data: any[]) =>{
    const annuaul:{x: string; y: number}[] = data.map((val)=>val['Annual Base Pay']).filter((val)=> isNumeric(val) && val.length < 6).map((el, i) => ({x:i.toString(), y:parseInt(el)}))
    setBarData(annuaul.slice(0, 800))
  }

  useEffect(() => {
    EventBus.on(BlockEventType.UploadCompensationCsv, ({data}) => {
      console.log(Object.keys(data[0]).map((col) => ({label: col, name: col})));
      generatePieDataGender(data);
      generateBarData(data)
    });
  }, []);
  return (
    <Container fluid className="Visualization">
      <Row>
        <Col>
          <h3>Gender</h3>
          <VictoryPie
            data={pieData}
            labels={({datum}) => {
              return `${datum.xName}:${datum.y}`}}
            style={{labels: {fill: 'black', fontSize: 20, fontWeight: 'bold'}}}
          />
        </Col>
        <Col>
          <h3>Annual Base Pay- FIRST 800 </h3>
          <VictoryChart
            height={400} width={600}
            theme={VictoryTheme.material}
            domainPadding={{ x: 50, y: [0, 20] }}
            
            // scale={{ x: "time" }}
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis
              tickFormat={(t) => `${Math.round(t*10)/10/1000}K`}
            />
            <VictoryBar
              style={{ data: { fill: "#c43a31" } }}
       
              data={barData}
            />
          </VictoryChart>
        </Col>
      </Row>
      
      
    </Container>
  );
};

export default Visualization;
