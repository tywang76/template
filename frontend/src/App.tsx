import { ItemList } from './components/ItemList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
      </header>
      <ItemList />
    </div>
  );
}

export default App;
