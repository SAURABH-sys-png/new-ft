import { BlockMath, InlineMath } from 'react-katex'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Math Rendering Example
        </h1>
        
        <p className="text-gray-600 mb-4 text-lg">
          Here is an inline math equation: <InlineMath math="\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}" />
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-4">
          <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Complex Equation:</p>
          <BlockMath math="f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi" />
        </div>
      </div>
    </div>
  )
}

export default App
