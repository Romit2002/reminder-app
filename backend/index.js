require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {connectDb} = require('./db/conn');
const port = process.env.PORT|| 5000;

// App config
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const start = async () => {
    try{
        await connectDb(process.env.MONGODB_URL);
        console.log("Database Connected!!!")
        

    }
    catch(err){
        console.log(err);
    }    
}

start();


const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean,
})

const Reminder = new mongoose.model("reminder", reminderSchema);


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const toNumber = `whatsapp:${process.env.PHONE_NO}`;
const fromNumber = `whatsapp:${process.env.FROM_NO}`;
const sendMsg = async (msg) => {
    client.messages
    .create({
       body: msg,
       from: fromNumber,
       to: toNumber
     })
    .then(message => console.log(message.sid));
}
setInterval(async ()=>{
    // console.log("Hello");
    const reminderList = await Reminder.find({});
    // reminderList = JSON.parse(reminderList);
    // console.log(reminderList);
    reminderList.forEach(async element => {
        if(!element.isReminded){
            const now = new Date();
            // console.log(now);
            const remDate = new Date(element.remindAt);
            // console.log(remDate);
            if(remDate-now<=0){
                await Reminder.findByIdAndUpdate(element._id,{ isReminded : true });
                // console.log("Updated!!!")
                const msg = element.reminderMsg;
                // console.log(msg);
                await sendMsg(msg);
            }
        }
    });
},5000);
// setInterval(()=>{
//     console.log("Hello")
//     // const reminderList = Reminder.find({});
//     // reminderList = JSON.parse(reminderList);
//     // reminderList.forEach(reminder=>{
//     //     if(!reminder.isReminded){
//     //         const now = new Date();
//     //         if(new Date(reminder.remindAt)-now<0){
//     //             reminder.findByIdAndUpdate(reminder._id, {isReminded:true});
//     //             console.log("Reminder Done");
//     //         }
//     //     }
//     // })


// },10000)


    // client.messages
    // .create({
    //    body: 'Hello there!',
    //    from: 'whatsapp:+14155238886',
    //    to: 'whatsapp:+918777429224'
    //  })
    // .then(message => console.log(message.sid));


// API Routes
app.get('/getAllReminder',async (req,res)=> {
    try{
        const data = await Reminder.find();
        res.json(data);}
    catch(err){
        res.status(500).send('server error!!');
    }
})

app.post('/addReminder', (req,res)=> {
    const { reminderMsg, remindAt } = req.body;

    const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded:false,
    })
    reminder.save();
    Reminder.find({})
})

app.post('/deleteReminder', async (req,res)=> {
    await Reminder.deleteOne({_id:req.body.id});
   
    Reminder.find({});
})

// app.get("/", (req,res)=> {
//     res.send("A Message from BE");
// })


app.listen(port, ()=>{
    console.log(`Server connected to port ${port}`)
});
