import { useState, useEffect } from 'react';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const Chart = () => {


    const [emissionsFetchData, setEmissionsFetchData] = useState([])
    const [emissionsLabel, setEmissionsLabel] = useState([])
    const [emissionsNumbers, setEmissionsNumbers] = useState([])
    const [backgroundColors, setBackgroundColors] = useState([])

    async function getData() {
        const url = `/api/chart-data/electric-emissions/state`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          
          const json = await response.json();
          console.log("json.data in chart fetch", json.data)
          setEmissionsFetchData(json.data)
          
        } catch (err) {
          if (err instanceof Error)
          console.log(err.message);
        }
    }



    const data = {
        labels: emissionsLabel,
        datasets: [
          {
            label: 'Emissions by State',
            data: emissionsNumbers,
            backgroundColor: backgroundColors,
            hoverOffset: 4
          }
        ]
    };



    useEffect(() => {

        (async () => {
            try {
              const data = await getData();
              // Handle the data
            } catch (error) {
              // Handle errors
            }
          })();
        // * run data extraction func here
        const labels:any= []
        const emissionNumbers:any = []
        const backgroundColors:any = []
        

        emissionsFetchData.forEach((element, i) => {
            labels.push(element['state'])
            emissionNumbers.push(element['estimate_emissions'])
            const hue = (i * 360) / emissionsFetchData.length;
            backgroundColors.push(`hsl(${hue}, 70%, 60%)`)
        });

        console.log("labels in useEffect", labels)
        console.log("emissionNumbers in useEffect", emissionNumbers)
        console.log("backgroundColor", backgroundColors)

        setEmissionsLabel(labels)
        setEmissionsNumbers(emissionNumbers)
        setBackgroundColors(backgroundColors)


        console.log("data ran in useEffect", data)
    }, [])



    return <Doughnut data={data} />

}

export default Chart;