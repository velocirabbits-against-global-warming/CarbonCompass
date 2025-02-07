import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// Create a supabase client for interacting with your database
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iplouzmpgowturxalotd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbG91em1wZ293dHVyeGFsb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDUxNDUsImV4cCI6MjA1NDEyMTE0NX0.lM3Mr1vQgI82T_dx-G9y0pf-SDRD-rLvXEbNXojIMOA'
const supabase = createClient(supabaseUrl, supabaseKey)


interface ElectricityRequestBody {
  type: string;
  electricity_unit: string;
  electricity_value: number;
  country: string;
  state: string;
}

interface ElectricityController {
  getEmissions: (
    req: Request<{}, {}, ElectricityRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

const electricityController: ElectricityController = {
  getEmissions: async (req: Request, res: Response, next: NextFunction )  => {
  const newUUID = uuidv4();
  try {
    const {type, country, state, electricity_unit, electricity_value} = req.body;

      if (
        !type ||
        !country ||
        !state ||
        !electricity_unit ||
        !electricity_value
      ) {
        res
          .status(400)
          .json({ message: 'Missing required fields in request body' });
        return;
      }

      const response = await axios.post(
        'https://www.carboninterface.com/api/v1/estimates',
        { type, electricity_unit, electricity_value, country, state },
        {
          headers: {
            Authorization: 'Bearer AxECWl4yoSTCmSsDS0YbQ',
            'Content-Type': 'application/json',
          },
        }
      );

      const { carbon_lb, carbon_kg } = response.data.data.attributes;

      const emissionsData = { carbon_lb, carbon_kg };

    console.log('Electricity emissionsData', emissionsData);

    //*  SQL Insertion
    // * ////////////////////////////////////

    const roundedDownCarbon_kg = Math.floor(carbon_kg)
    const roundedDownElectricity_value = Math.floor(electricity_value)

    const { data, error } = await supabase
      .from('electricity_emissions')
      .insert({ electricity_emissions_id: newUUID, 
        session_id: '235aea14-0f20-422e-b44b-c4e7d21d68f4',
        country: country,
        state: state,
        kwh: roundedDownElectricity_value,
        estimate_emissions: roundedDownCarbon_kg
      })
      .select()

      console.log("data from supabase in electricityController", data)
    // * ////////////////////////////////////

      res.locals.emissionsData = emissionsData;
      return next();
    } catch (error) {
      if (error instanceof Error)
        console.error('Error creating carbon estimate:', error.message);
      res.status(500).json({ error: 'Error fetching data' });
    }
  },
};

export default electricityController;
