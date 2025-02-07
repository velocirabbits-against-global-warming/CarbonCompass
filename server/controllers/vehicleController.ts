import axios from 'axios';
// import supabase from '../model/supabaseCarbonCompassModel.js'
import { v4 as uuidv4 } from 'uuid';
// Create a supabase client for interacting with your database
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iplouzmpgowturxalotd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbG91em1wZ293dHVyeGFsb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDUxNDUsImV4cCI6MjA1NDEyMTE0NX0.lM3Mr1vQgI82T_dx-G9y0pf-SDRD-rLvXEbNXojIMOA'
const supabase = createClient(supabaseUrl, supabaseKey)




import { Request, Response, NextFunction } from 'express';

interface VehicleRequestBody {
  type: string;
  distance_unit: string;
  distance_value: number;
  vehicle_model_id: string;
}

interface VehicleController {
  getMakes: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  getModels: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  getEmissions: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

const vehicleController: VehicleController = {
  getMakes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(
        'https://www.carboninterface.com/api/v1/vehicle_makes',
        {
          headers: {
            Authorization: 'Bearer AxECWl4yoSTCmSsDS0YbQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);

      res.locals.vehicleMakes = response.data;

      return next();
    } catch (error) {
      return next(error);
      // console.error('Error getting vehicle makes:', error.message);
      // res.status(500).json({ error: 'Error fetching data' });
    }
  },

  getModels: async (req: Request, res: Response, next: NextFunction) => {
    const { makeId } = req.params;
    try {
      const response = await axios.get(
        `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`,
        {
          headers: {
            Authorization: 'Bearer AxECWl4yoSTCmSsDS0YbQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);

      res.locals.vehicleModels = response.data;

      return next();
    } catch (error) {
      return next(error);
      // console.error('Error getting vehicle makes:', error.message);
      // res.status(500).json({ error: 'Error fetching data' });
    }
  },
  getEmissions: async (req: Request, res: Response, next: NextFunction) => {
    // controller for getting vehicle emissions calculation from the front end
    const newUUID = uuidv4();
    try {
      const { type, distance_unit, distance_value, vehicle_model_id } =
        req.body;
      const response = await axios.post(
        'https://www.carboninterface.com/api/v1/estimates',
        { type, distance_unit, distance_value, vehicle_model_id },
        {
          headers: {
            Authorization: 'Bearer AxECWl4yoSTCmSsDS0YbQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      const carbon_lb = response.data.data.attributes.carbon_lb;
      const carbon_kg = response.data.data.attributes.carbon_kg;
      const emissionsData = { carbon_lb, carbon_kg };

      //*  SQL Insertion
      // * ////////////////////////////////////

      const roundedDownCarbon_kg = Math.floor(carbon_kg)
      const roundedDowndistance_value = Math.floor(distance_value)


      const { data, error } = await supabase
      .from('vehicle_emissions')
      .insert({ vehicle_emissions_id: newUUID, 
        session_id: '235aea14-0f20-422e-b44b-c4e7d21d68f4',
        unit: distance_unit,
        units_driven: roundedDowndistance_value,
        estimate_emissions: roundedDownCarbon_kg,
        vehicle_model_id: vehicle_model_id
        })
      .select()


      console.log("data from supabase in vehicleController", data)

      // * ////////////////////////////////////

      res.locals.vehicleModels = emissionsData;
      console.log('res.locals.vehicleModels', res.locals.vehicleModels);

      return next();
    } catch (error) {
      if (error instanceof Error)
      console.error('Error creating carbon estimate:', error.message);
      res.status(500).json({ error: 'Error fetching data' });
    }
  },
};

export default vehicleController;
