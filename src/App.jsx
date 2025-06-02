import { useState } from 'react'
import Scene from './portfolioroom'
import LoadingScreen from './loadingpage';
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <Scene />
      )}
    </>
  );
}

export default App;
