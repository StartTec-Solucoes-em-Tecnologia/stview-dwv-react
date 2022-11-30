import { DWView } from './components/DWView'

function App () {
  const params = new URLSearchParams(window.location.search)

  const baseUrl = params.get('base_url')
  const size = Number(params.get('size'))

  if (!baseUrl) {
    return (
      <div>
        <h1 className="text-center text-zinc-200 text-3xl my-10">
          Error: 404
        </h1>
      </div>
    )
  }

  const urls = (!size)
    ? [baseUrl]
    : Array(size + 1).fill(undefined).map((_, index) => `${baseUrl}-${String(index).padStart(5, '0')}.dcm`)

  return (
    <div>
      <DWView urls={urls} />
    </div>
  )
}

export default App
