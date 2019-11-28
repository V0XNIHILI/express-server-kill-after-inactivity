import express, { Request, Response, NextFunction } from 'express';

// Setup of activity killer =======================================================================

const portNumber = 5000; // On which port the Express server operates
const timeOutMinutes = 0.1; // After how many minutes the express server kills itself
const checkTimeOutSeconds = 1; // How many seconds should there be between two inactivity checks

// Helper functions ===============================================================================

function getCurrentTimeStamp() {
  const currentDate = new Date();

  return currentDate.getTime();
}

let lastActivityTimeStamp = getCurrentTimeStamp();

function updateLastActivityTime(_req: Request, _res: Response, next: NextFunction) {
  lastActivityTimeStamp = getCurrentTimeStamp();
  next();
}

// Express app setup ==============================================================================

// Create a new express application instance
const app: express.Application = express();

// Enable Express to parse the request body
app.use(express.json());

// Display a HTML page with <code>Express</code> if someone goes to root url of the convert to PDF
// server, to show that it is working
app.get('/', updateLastActivityTime, (_req: Request, res: Response) => {
  console.log('You got a request on your Express server!');
  res.send('<code>Express</code>');
});

// Create a NodeJS web server at the set port
app.listen(portNumber, () => {
  console.log(`Express server listening on port ${portNumber}!`);
});

// Method which kills the server after inactivity =================================================

function checkAndKillAfterInactivity() {
  const newLastActivityTimeStamp = getCurrentTimeStamp();

  // Check if the time inactive surpassed the set inactivity time before we want to kill it
  if ((newLastActivityTimeStamp - lastActivityTimeStamp) / 1000 >= timeOutMinutes * 60)
    process.exit();
}

// Setup the interval which checks every checkTimeOutSeconds whether the server needs to be killed
setInterval(checkAndKillAfterInactivity, checkTimeOutSeconds * 1000);
