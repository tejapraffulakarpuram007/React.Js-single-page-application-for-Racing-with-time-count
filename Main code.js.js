import React from 'react';
import './App.css';

const categoriesData = [
  { title: 'Greyhound racing', id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61' },
  { title: 'Harness racing', id: '161d9be2-e909-4326-8c2c-35ed71fb460b' },
  { title: 'Horse racing', id: '4a2788f8-e825-4d36-9894-efd4baf1cfae' }
]

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
        const race = races[key];
        newRaces = newRaces.concat({
          // TODO: You will have to work with the API payload to determine what data you require
          meeting_name: race?.meeting_name,
          race_number: race?.race_number,
          advertisedStart: race?.advertised_start?.seconds * 1000,
          race_id: race?.race_id,
          category_id: race?.category_id
        });
      }

      // Sort races by time to jump and add them to race list
      newRaces.sort((item1, item2) => {
        return item1.advertisedStart - item2.advertisedStart;
      });

      // console.log(newRaces, this.state.time);
      // Filter races for only those which are <60 seconds over start time
      let sortedRaceCount = 0;
      this.setState({
        unsortedRaces: newRaces,
        sortedRaces: newRaces.filter((value) => {
          if (sortedRaceCount < 5 && (value.advertisedStart - this.state.time) > -60000) {
            sortedRaceCount++;
            if (this.state.selectedCategory !== null) {
              if (value?.category_id === this.state.selectedCategory) {
                return true;
              }

            } else {
              return true
            }

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
    console.log(rawTime, this.state.time, 'times')
    console.log('-----------------------------------');
    return `${this.unixTime(timeMs)}`
  }




  unixTime(unixtime) {

    var u = new Date(unixtime * 1000);

    return '' + ('0' + u.getUTCMinutes()).slice(-2) + 'min' +
      ' : ' + ('0' + u.getUTCSeconds()).slice(-2) + 'sec'
  }

  getCategoryNameById = (id) => {
    const data = categoriesData.filter((item) => item.id === id)
    if (data.length > 0) {
      return `${data[0].title}`
    }
  }

  // Render components
  render() {
    return (
      <div className="container">
        <div className="buttonContainer">

          <button className="buttonToggle" onClick={() => {
            // TODO: Populate the state sets with appropriate actions to give each button functionality
            this.setState({ selectedCategory: null });
          }}>All Races</button>
        </div>
        <div className="categories">
          {categoriesData.map((item) => (
            <div className="buttonContainer">
              <button key={item?.id} className="buttonToggle" onClick={() => {
                // TODO: Populate the state sets with appropriate actions to give each button functionality
                this.setState({ selectedCategory: item?.id });
              }}>{item?.title}</button>
            </div>
          ))}
        </div>
        <div className="list">
          {this.state.sortedRaces.map(item => (
            <ul>
              {/* TODO: Edit the string below to display the Race number, Meeting name and time to jump */}
              <span className="item">{`${this.getCategoryNameById(item?.category_id)} : ${item?.meeting_name} : ${item?.race_number} : ${new Date(item?.advertisedStart).toLocaleString("en-US", { timeZone: "Australia/Sydney" }).split(',')[1]}  Aus time Time left ${this.getFormattedTime(item?.advertisedStart)}`}</span>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
