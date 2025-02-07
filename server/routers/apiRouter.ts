import express from 'express';
const apiRouter = express.Router();

import electricityController from '../controllers/electricityController.ts';
import vehicleController from '../controllers/vehicleController.ts';
import openAiController from '../controllers/openAiController.ts';

// * TEST

apiRouter.get('/test', (req, res) => {
  console.log('Test is working');
  res.status(200).send('The Test is Working!');
});

// * ROUTE - ELECTRICITY
apiRouter.post(
  '/electricity',
  electricityController.getEmissions,
  (req, res) => {
    res.status(200).json(res.locals.emissionsData);
  }
);

// * ROUTE - VEHICLES
// on input form page load, get the vehicle makes for client selection (complete)
apiRouter.get('/vehicle/makes', vehicleController.getMakes, (req, res) => {
  res.status(200).json(res.locals.vehicleMakes);
});
// on make selection, get the vehicle makes for client selection (complete)
apiRouter.get(
  '/vehicle/makes/:makeId',
  vehicleController.getModels,
  (req, res) => {
    res.status(200).json(res.locals.vehicleModels);
  }
);
// *TODO the client will send a request on submit to get the emissions data from the form (incomplete)
apiRouter.post('/vehicle', vehicleController.getEmissions, (req, res) => {
  res.status(200).json(res.locals.vehicleModels);
});

// * ROUTE - OPENAI
apiRouter.post('/openai/', openAiController.generateResponse, (req, res) => {
  res.status(200).json({ aiResponse: res.locals.aiResponse });
});

export default apiRouter;
