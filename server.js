const express= require('express')
const mongoose = require('mongoose')
const feedback = require('./models/feedbackModel')
const app= express()

app.use(express.json())
app.get('/',(req,res) => {
    console.log('here')
    res.send('Hi')

})
const cors = require('cors');

app.use(cors());


app.listen(3000)
mongoose.connect('mongodb+srv://admin:Ana19052004@ananyaapi.uh5arcp.mongodb.net/?retryWrites=true&w=majority&appName=AnanyaAPI')
.then(() =>{
    console.log('connected to server')
}).catch((error)=>{
    console.log(error)

})
app.post('/feedback', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Assuming you have a Feedback model defined
        const newfeedback = await feedback.create({ name, email, message });
        res.status(200).json(newfeedback);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
function submitFeedback() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    fetch('file:///C:/Users/HP/OneDrive/proto1.html', { // Update URL to match your backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      alert('Feedback submitted successfully!');
      console.log(data);
      // Add any additional handling here (e.g., reset form)
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
      alert('Failed to submit feedback. Please try again later.');
    });
  }
  

