import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


// Create a supabase client for interacting with your database
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iplouzmpgowturxalotd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbG91em1wZ293dHVyeGFsb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDUxNDUsImV4cCI6MjA1NDEyMTE0NX0.lM3Mr1vQgI82T_dx-G9y0pf-SDRD-rLvXEbNXojIMOA'
const supabase = createClient(supabaseUrl, supabaseKey)


interface ChartRequestBody {
    type: string;
    electricity_unit: string;
    electricity_value: number;
    country: string;
    state: string;
}
  
interface ChartController {
    getTotalEmissionsData: (
        req: Request<{}, {}, ChartRequestBody>,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
}


const chartController: ChartController = {
    getTotalEmissionsData: async (req: Request, res: Response, next: NextFunction )  => {
    const newUUID = uuidv4();
    try {
      
  
      //*  SQL Retrieval
      // * ////////////////////////////////////
  
      const { data, error } = await supabase
        .from('electricity_emissions')
        .select('state, kwh, estimate_emissions' )
  
        console.log("data from supabase in chartController", data)
      // * ////////////////////////////////////
  
        res.locals.chartData = data;
        return next();
      } catch (error) {
        if (error instanceof Error)
          console.error('Error creating carbon estimate:', error.message);
        res.status(500).json({ error: 'Error fetching data' });
      }
    },
  };
  
  export default chartController;
  