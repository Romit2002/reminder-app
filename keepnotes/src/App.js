import React, { useEffect, useState } from 'react'
import axios from "axios";
// import DateTimePicker from "react-datetime-picker";
import './App.css';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import dayjs from 'dayjs';

const App = () => {

  const [reminderMsg, setReminderMsg] = useState("");
  const [remindAt,setRemindAt] = useState();

  const [reminderList, setReminderList ] = useState([]);
  const call = async () => {
    try{
      const res = await axios.get('http://localhost:5000/getAllReminder');
      setReminderList(res.data);
    }
    catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    call();
    // console.log(reminderList);
  },[reminderList]);
  const addReminder = (e) => {
    axios.post("http://localhost:5000/addReminder",{reminderMsg, remindAt}).then(res=>setReminderList(res.data));
    e.preventDefault();
    setReminderMsg("");
    setRemindAt("");
  }

  const deleteReminder = (id) => {
    axios.post("http://localhost:5000/deleteReminder",{id}).then(res=>setReminderList(res.data));
  }

  const onDateChange = (e) => {
    setRemindAt(e.$d);
  }
  return (
    <div className="App">
    {console.log(reminderList)}
      <div className="homepage">
        <div className="homepage_header">
          <h1>Remind Me⏰</h1>
          <input type='text' placeholder='Reminder Notes Here' onChange={(e)=>{
            setReminderMsg(e.target.value);
          }} value={reminderMsg}/>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
          'MobileDateTimePicker',
          'DesktopDateTimePicker',
          'StaticDateTimePicker',
        ]}
      >
        <DemoItem label="Choose Your Time" class="time">
          <DateTimePicker value={remindAt} onChange={onDateChange}/>
        </DemoItem>
        
      </DemoContainer>
    </LocalizationProvider>
          <div className="button" onClick={addReminder}>Add Reminder</div>
        </div>

        <div className="homepage_body">
        {reminderList.map((val)=>{
          const dateTimeString = val.remindAt;
          const dateTime = new Date(dateTimeString);
          const date = dateTime.toLocaleDateString();

          // Get the time component in 12-hour format with leading zeros
          const hours = dateTime.getHours();
          const minutes = dateTime.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';

          // Format hours and minutes with leading zeros
          const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
          const formattedMinutes = minutes.toString().padStart(2, '0');

          const time = `${formattedHours}:${formattedMinutes} ${ampm}`;

          return(
            <div key={val._id} className="reminder_card">
            <h2>{val.reminderMsg}</h2>
            <h3>Remind Me at:</h3>
            <p>{date} {time}</p>
            <div className="button" onClick={()=>deleteReminder(val._id)}>Delete</div>
            </div>
          )
          
        })}
        
        </div>
      </div>
    </div>
  )
}

export default App
