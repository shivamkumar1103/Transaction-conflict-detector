const express = require('express');
const cors = require('cors');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/schedules', scheduleRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
