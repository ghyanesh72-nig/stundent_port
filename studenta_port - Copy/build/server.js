const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// MongoDB URI
const uri = 'mongodb+srv://dsatm72:DSATM72dsatm@cluster0.8jygx.mongodb.net/studentPortfolioDB?retryWrites=true&w=majority';

// MongoDB client setup outside route handlers
let client;
let studentsCollection;
let adminCollection;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB once when the server starts
const connectMongoDB = async () => {
  try {
    client = new MongoClient(uri);
    await client.connect();
    studentsCollection = client.db("studentPortfolioDB").collection("students");
    adminCollection = client.db("studentPortfolioDB").collection("admin");
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

// POST request to submit form data (assuming this is related to 'students')
app.post('/submit-form', async (req, res) => {
  const formData = req.body;

  try {
    const result = await studentsCollection.insertOne(formData); // Use studentsCollection here
    res.status(200).json({ message: "Data inserted successfully", data: result });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});

// GET request to fetch all students
app.get('/students', async (req, res) => {
  try {
    const students = await studentsCollection.find().toArray(); // Use studentsCollection
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// GET request to fetch a specific student by USN (excluding hobbies)
app.get('/students/:usn', async (req, res) => {
  const { usn } = req.params;

  try {
    const student = await studentsCollection.findOne({ usn });
    if (student) {
      // Remove 'hobbies' field from the student object before sending
      delete student.hobbies;
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student by USN:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// GET request for admin (if needed)
app.get('/admin', async (req, res) => {
  try {
    const admin = await adminCollection.find().toArray(); // Use adminCollection
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Graceful shutdown of MongoDB connection when server is closed
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await client.close();
  process.exit(0);
});

// Start the server after connecting to MongoDB
connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
////////////////////////admin login///////////

app.post('/admin', async (req, res) => {
  const { email, password } = req.body; // Get email and password from the request body

  try {
    // Find the admin by email
    const admin = await adminCollection.findOne({ email });

    if (admin) {
      // Compare the stored password with the provided password
      if (admin.password === password) {
        // Password matches, login successful
        const username = email.split('@')[0]; // Extract the username (part before '@')

        res.status(200).json({
          success: true,
          message: 'Login successful',
          adminName: username, // Send the extracted username
        });
      } else {
        // Invalid password
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Admin not found
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT request to update student data by USN
app.put('/update-student/:usn', async (req, res) => {
  const { usn } = req.params;  // Get the USN from the URL parameters
  const updatedData = req.body;  // Get the updated data from the request body

  try {
      // Find the student by USN and update their data
      const result = await studentsCollection.updateOne(
          { usn },
          { $set: updatedData }
      );

      if (result.modifiedCount === 0) {
          return res.status(404).json({ success: false, message: "Student not found or no changes made." });
      }

      res.status(200).json({ success: true, message: "Student data updated successfully." });
  } catch (error) {
      console.error("Error updating student data:", error);
      res.status(500).json({ success: false, message: "Error updating student data" });
  }
});



