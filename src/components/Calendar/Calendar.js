import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

import Snackbar from '@material-ui/core/Snackbar';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const time = ["1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12am"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeek(date) {
  var currentDate = moment(date);

  var weekStart = currentDate.clone().startOf('isoWeek');
  var weekEnd = currentDate.clone().endOf('isoWeek');

  var days = [];

  for (var i = 0; i <= 6; i++) {
    days.push({
      date: moment(weekStart).add(i, 'days').format("MMM D YYYY"),
      day: daysOfWeek[i]
    });
  }
  return days;
}

function getTime() {
  var hours = new Date().getHours();
  var hours = (hours+24)%24; 
  var mid='am';

  if(hours==0) {
    hours=12;
  } else if(hours>12) {
    hours=hours%12;
    mid='pm';
  }

  return `${hours}${mid}`
}

export default function CalendarDesign() {
  const classes = useStyles();
  const [dateValue, onChange] = useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState({
    eventName: "",
    eventDesc: ""
  });

  const [events, setEvents] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [editEvent, setEdit] = React.useState(false);
  const [idToUpdate, setIdToUpdate] = React.useState('');
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertName, setAlertName] = React.useState('');

  useEffect(() => {
    let url = "http://localhost:3001/events";

    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setEvents(data);
      })
  }, []);

  const handleChangeofSave = (event) => {
    setChecked(event.target.checked);
  };

  const handleDeleteofEvent = (id) => {
    const url = `http://localhost:3001/events/${id}`;

    fetch(url, {
      method: 'DELETE'
    }).then(function(response) {
      setEvents(events.filter((data) => {
        if (data.id === id) {
          return null
        } else {
          return data
        }
      }));

      setValue({
        eventName: "",
        eventDesc: ""
      });
    });
  };

  events && events.map((data) => {
    const day = moment(new Date()).format("MMM D YYYY");
    const time = getTime();
    if (data.date === day && data.time === time && data.remind) {
      setOpenAlert(true);
      setAlertName(data.name);
      setTimeout(() => {
        setOpenAlert(false);
      }, 6000);
    }
  })

  const handleEditOfEvent = (id) => {
    
    events.map(data => {
      if (data.id === id) {
        setIdToUpdate(id);
        setValue({
          eventName: data.name,
          eventDesc: data.description
        })
        setChecked(data.remind);
      }
    });

    setEdit(true);
  }

  const [eventDetail, setEventDetail] = React.useState({
    day: '',
    time: ''
  });

  const addEvent = (day, time) => (e) => {
    e.stopPropagation();
    setEventDetail({ ...eventDetail, ["day"]: day, ["time"]: time});
    setOpen(true);
  }

  const EditEventSubmit = () => {
    const dataToUpdate = {
      id: idToUpdate,
      name: value.eventName,
      description: value.eventDesc,
      date: eventDetail.day,
      time: eventDetail.time,
      remind: checked
    };

    const url = `http://localhost:3001/events/${idToUpdate}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToUpdate)
    }).then(function(response) {
      setEvents(events.map((data) => {
        if (data.id === idToUpdate) {
          return dataToUpdate;
        } else {
          return data;
        }
      }));
      setOpen(false);
      setEdit(false);
    });
  }

  

  const CreateEventSubmit = () => {
    const data = {
      id: events.length + 1,
      name: value.eventName,
      description: value.eventDesc,
      date: eventDetail.day,
      time: eventDetail.time,
      remind: checked
    };

    const url = "http://localhost:3001/events";

    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      setOpen(false);
      setEvents([...events, data]);
    });
  }

  const handleChange = props => event => {
    setValue({ ...value, [props]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const datesOfWeek = getWeek(dateValue);

  let eventData = [];
  datesOfWeek.map((data) => {
    events && events.map((eventDetail) => {
      if (eventDetail.date === data.date) {
        eventData.push(Object.assign({}, eventDetail, data));
      }
    })
  });

  const tableRowData = time.map((row) => (
    <TableRow key={row}>
      <TableCell style={{width: "10px"}}>{row}</TableCell>
      {datesOfWeek.map((day) => {
        let eventName = [];
        eventData && eventData.map((data) => {
          if(data.date === day.date && row === data.time) {
            eventName.push({
              name: data.name,
              id: data.id
            })
          }
        })
        return (
          <TableCell style={{borderLeft: "1px solid blanchedalmond"}} onClick={addEvent(day.date, row)}>
            {eventName && eventName.map((data) => (<Chip
              label={data.name}
              onDelete={() => handleDeleteofEvent(data.id)}
              onClick={() => handleEditOfEvent(data.id)}
            />))}
          </TableCell>
        )
      })}
    </TableRow>
  ));

  return (
    <div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={3} style={{padding: "20px"}}>
            <Calendar
                onChange={onChange}
                value={dateValue}
            />
            <div style={{textAlign: "center", padding: "20px"}}>
              <Button variant="outlined" color="primary" onClick={addEvent(moment(new Date()).format("MMM D YYYY"), getTime())}>
                Create an Event
              </Button>
            </div>
          </Grid>
          <Grid item xs={9} style={{padding: "20px"}}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                <TableCell></TableCell>
                  {datesOfWeek.map((day) => (
                    <TableCell>
                      <div  style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                        <span>{day.day}</span>
                        <span>{day.date.substring(0, day.date.length-4)}</span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRowData}
              </TableBody>
            </Table>
          </TableContainer>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{editEvent ? 'Edit the event' : 'Add an Event'}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{display: "Flex", flexDirection: "column"}}>
            <span style={{width: "100%"}}>Date: {eventDetail.day}</span>
            <span style={{width: "100%"}}>Time: {eventDetail.time}</span>
          </DialogContentText>
          <div className={classes.padding20nil}>
            <Grid container>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="standard-basic"
                  label="Name of the Event"
                  style={{ width: "100%" }}
                  value={value.eventName}
                  onChange={handleChange("eventName")}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="standard-basic"
                  label="Provide a description"
                  style={{ width: "100%" }}
                  value={value.eventDesc}
                  onChange={handleChange("eventDesc")}
                />
              </Grid>
              <Grid item style={{padding: "10px 0"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChangeofSave}
                    name="checked"
                    color="primary"
                  />
                }
                label="remind me"
              />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions style={{padding: "25px"}}>
          {editEvent ? (<Button
            onClick={EditEventSubmit}
            variant="contained"
            color="primary"
          >
            Edit this Event
          </Button>) : (<Button
            onClick={CreateEventSubmit}
            variant="contained"
            color="primary"
          >
            Add Event
          </Button>)}
        </DialogActions>
      </Dialog>

      {openAlert ? (<Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openAlert}
        autoHideDuration={6000}
        message={alertName}
      /> ) : ''}
    </div>
  );
};
