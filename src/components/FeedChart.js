import React from 'react';
import { View, StyleSheet} from 'react-native';
import { AreaChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import PropTypes from 'prop-types';

export default class FeedChart extends React.Component {
    static propTypes = {
      data: PropTypes.array,
    }

    constructor(props) {
      super(props);
    }

    render() {
      var {data} = this.props;
      return (
        <View>
           <View style={styles.container}>
            <YAxis
                      dataPoints={ data }
                      contentInset={ { top: 30, bottom: 30 } }
                      labelStyle={ { color: 'grey' } }
                      formatLabel={ value => `${value}` }
                      style={ { width: '10%' } }
                  />
            <AreaChart
                style={ { height: 200, width: '90%' } }
                animate={false}
                dataPoints={ data }
                contentInset={ { top: 30, bottom: 30 } }
                curve={shape.curveNatural}
                svg={{
                    fill: 'rgba(134, 65, 244, 0.2)',
                    stroke: 'rgb(134, 65, 244)',
                }}
            />
          </View>
          <View style={styles.container}>
            <XAxis
                      style={ {  width:'100%' }}
                      values={ data }
                      contentInset={ { left: 35, right: 4} }
                      formatLabel={ (value, index) => index }
                      chartType={ XAxis.Type.Line }
                      labelStyle={ { color: 'grey' } }
                  />
          </View>
        </View>
      )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1, 
    flexDirection: 'row'
  }
});