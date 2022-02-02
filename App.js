import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      raceData: [],
      sortedRaces: [],
      unsortedRaces: [],
      selectedCategory: null,
      time: Date.now(),
      rowsToFetch: 5,
    };

    document.title = 'Entain Coding Test';
  }

  // Use fetch API to gather the 10 next races to jump and add it to app state
  // then set interval to update time in app state
  componentDidMount() {
    this.getRacingData();

    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
      this.getRacingData();
    }, 1000);
  }

  // Clear the interval once app is closed/unmounted
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Fetch a specified number of next races to jump, sort by time ascending
  // race categories and races >=60 seconds over start time
  getRacingData = () => {
    fetch(`https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=${this.state.rowsToFetch}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(json => {
      const { data } = json;

      this.setState({
        sortedRaces: [],
      })

      let newRaces = [];

      const races = data.race_summaries;

      for (const [key] of Object.entries(races)) {
        const races = races[key];
        newRaces = newRaces.concat({
          // TODO: You will have to work with the API payload to determine what data you require
        });
      }

      // Sort races by time to jump and add them to race list
      newRaces.sort((item1, item2) => {
        return item1.advertisedStart - item2.advertisedStart;
      });

      // Filter races for only those which are <60 seconds over start time
      let sortedRaceCount = 0;

      this.setState({
        unsortedRaces: newRaces,
        sortedRaces: newRaces.filter((value) => {
          if (sortedRaceCount < 5 && (value.advertisedStart - this.state.time) > -60000) {
            sortedRaceCount++;
            return true;
          }
          return false;
        })
      });

      if (sortedRaceCount < 5) {
        this.setState({ rowsToFetch: this.state.rowsToFetch + 1 });
        this.getRacingData();
      }
    });
  }

  // Format time in XXmin XXs
  getFormattedTime = (rawTime) => {
    const timeMs = Math.round((rawTime - this.state.time) / 1000);
    const timeMins = Math.round(Math.abs(timeMs) / 60);
    const timeSecs = Math.abs(timeMs) % 60;

    // TODO: Implement your logic to format the display of the race jump time
  }

  // Render components
  render() {
    return (
      <div className="container">
        <div className="buttonContainer">
          <button className="buttonToggle" onClick={() => {
            // TODO: Populate the state sets with appropriate actions to give each button functionality
            this.setState();
          }}>All Races</button>
        </div>
        <div className="categories">
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState();
            }}>Greyhounds</button>
          </div>
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState();
            }}>Harness</button>
          </div>
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState();
            }}>Thoroughbreds</button>
          </div>
        </div>
        <div className="list">
          {this.state.sortedRaces.map(item => (
            <ul>
              {/* TODO: Edit the string below to display the Race number, Meeting name and time to jump */}
              <span className="item">Race X - Meeting - Jumps in X</span>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
