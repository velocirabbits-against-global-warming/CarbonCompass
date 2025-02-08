// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import ClientForm from '../components/ClientForm';
import AiForm from '../components/AiForm';
import Chart from '../components/Chart';
import './App.css';

function App() {
  return (
    <div>
      <ClientForm />
      <AiForm />
      <Chart/>
    </div>
  );
}

export default App;
