import { CurrencySwap } from "./components/CurrencySwap"

// Supports weights 100-900
import '@fontsource-variable/inter/index.css';

function App() {
  return (
    <div
      className="h-screen w-screen overflow-hidden flex items-center justify-center bg-slate-50"
    >
      <CurrencySwap />
    </div>
  )
}

export default App