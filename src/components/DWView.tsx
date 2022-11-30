import { ReactNode, useCallback, useEffect, useState } from 'react'
import dwv from 'dwv'
import { MdCircle, MdClear, MdCropSquare, MdDraw, MdHelp, MdLayers, MdLight, MdNorthEast, MdSquareFoot, MdZoomIn } from 'react-icons/md'
import { FaRuler } from 'react-icons/fa'

import { ProgressIndicator } from './ProgressIndicator'
import { ToolButton } from './ToolButton'

import './DWView.css'

dwv.image.decoderScripts = {
  jpeg2000: 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
  'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
  'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js',
  rle: 'assets/dwv/decoders/dwv/decode-rle.js'
}

const tools = {
  Scroll: {},
  ZoomAndPan: {},
  WindowLevel: {},
  Draw: {
    options: ['Arrow', 'Ruler', 'Protractor', 'Rectangle', 'Ellipse'],
    type: 'factory',
    events: ['drawcreate', 'drawchange', 'drawmove', 'drawdelete']
  }
}

const toolIcons: Record<keyof typeof tools, ReactNode> = {
  Scroll: <MdLayers />,
  ZoomAndPan: <MdZoomIn />,
  WindowLevel: <MdLight />,
  Draw: <MdDraw />
}

const toolLabels: Record<keyof typeof tools, string> = {
  Scroll: 'Navegar camadas',
  ZoomAndPan: 'Zoom/Mover',
  WindowLevel: 'Brilho',
  Draw: 'Desenhar'
}

const drawToolsIcons: Record<string, ReactNode> = {
  Arrow: <MdNorthEast />,
  Ruler: <FaRuler />,
  Protractor: <MdSquareFoot />,
  Rectangle: <MdCropSquare />,
  Ellipse: <MdCircle />
}

const drawToolsLabels: Record<string, string> = {
  Arrow: 'Seta',
  Ruler: 'Régua',
  Protractor: 'Transferidor de grau',
  Rectangle: 'Seleção retangular',
  Ellipse: 'Seleção elíptica'
}

interface DWViewProps {
  urls: string[]
}

export function DWView ({ urls }: DWViewProps) {
  const [toolNames, setToolNames] = useState<Array<keyof typeof tools>>([])
  const [selectedTool, setSelectedTool] = useState<string>()
  const [loadProgress, setLoadProgress] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dwvApp, setDWVApp] = useState <any | null>(null)
  const [metaData, setMetaData] = useState([])

  const onChangeShape = (app: any, shape: string) => {
    app?.setDrawShape(shape)
  }

  const handleChangeTool = useCallback((app: any, tool: string, drawShape?: string) => {
    if (app) {
      console.log('Changing tool: ', { tool, drawShape })

      if (drawShape) {
        setSelectedTool([tool, drawShape].join('/'))
      } else {
        setSelectedTool(tool)
      }

      app.setTool(tool)

      if (tool === 'Draw') {
        onChangeShape(app, drawShape ?? tools.Draw.options[0])
      }
    }
  }, [])

  const onReset = (app: any) => {
    app?.resetDisplay()
  }

  useEffect(() => {
    if (dwvApp !== null) {
      return
    }

    // create app
    const app = new dwv.App()

    // initialise app
    app.init({
      dataViewConfigs: { '*': [{ divId: 'layerGroup0' }] },
      tools
    })

    // load events
    let nReceivedError = 0
    let nReceivedAbort = 0
    let isFirstRender: boolean | null = null

    const handleLoadStart = () => {
      // reset flags
      nReceivedError = 0
      nReceivedAbort = 0
      isFirstRender = true
    }

    const handleLoadProgress = (event: any) => {
      setLoadProgress(event.loaded)
    }

    const handleRendered = () => {
      if (isFirstRender) {
        console.log('rendered for first time')

        isFirstRender = false
        // available tools
        const names = Object.keys(tools).filter((key) => {
          return (
            (key === 'Scroll' && app.canScroll()) ||
            (key === 'WindowLevel' && app.canWindowLevel()) ||
            (key !== 'Scroll' && key !== 'WindowLevel')
          )
        })

        setToolNames(names as Array<keyof typeof tools>)
        handleChangeTool(app, names[0])
      }
    }

    const handleLoad = () => {
      setMetaData(dwv.utils.objectToArray(app.getMetaData(0)))
      setDataLoaded(true)
    }

    const handleLoaded = (/* event */) => {
      if (nReceivedError) {
        setLoadProgress(0)

        alert('Received errors during load. Check log for details.')
      }

      if (nReceivedAbort) {
        setLoadProgress(0)

        alert('Load was aborted.')
      }
    }

    const handleError = (event: any) => {
      console.error(event.error)
      ++nReceivedError
    }

    const handleAbort = () => {
      ++nReceivedAbort
    }

    const handleKeyDown = (event: any) => {
      app.defaultOnKeydown(event)
    }

    app.addEventListener('loadstart', handleLoadStart)
    app.addEventListener('loadprogress', handleLoadProgress)
    app.addEventListener('renderend', handleRendered)
    app.addEventListener('load', handleLoad)
    app.addEventListener('loadend', handleLoaded)
    app.addEventListener('error', handleError)
    app.addEventListener('abort', handleAbort)

    app.addEventListener('keydown', handleKeyDown)

    window.addEventListener('resize', app.onResize)

    setDWVApp(app)

    app.loadURLs(urls)
  }, [dwvApp, handleChangeTool, urls])

  return (
    <div className="flex">
      <div className="mt-10 px-4 py-4">
        <h1 className="text-xl text-zinc-100">
          Ferramentas:
        </h1>

        <div className="mt-4 flex items-start gap-2">
          {toolNames.filter(tool => tool !== 'Draw').map(tool => (
            <ToolButton
              key={tool}
              tool={tool}
              isSelected={selectedTool === tool}
              onSelectTool={() => handleChangeTool(dwvApp, tool)}
              tooltip={toolLabels[tool] ?? ''}
            >
              {toolIcons[tool] ?? <MdHelp />}
            </ToolButton>
          ))}

          <button
            className="bg-brand-600 hover:bg-brand-500 active:bg-brand-900 border active:border-brand-900 px-2 py-2 rounded text-2xl text-zinc-100"
            title="Resetar posicionamento"
            onClick={() => onReset(dwvApp)}
          >
            <MdClear />
          </button>
        </div>

        <div className="mt-2 flex items-start gap-2">
          {tools.Draw.options.map(drawOption => (
            <ToolButton
              key={`Draw-${drawOption}`}
              tool="Draw"
              toolShape={drawOption}
              isSelected={selectedTool === `Draw/${drawOption}`}
              onSelectTool={() => handleChangeTool(dwvApp, 'Draw', drawOption)}
              tooltip={drawToolsLabels[drawOption] ?? ''}
            >
              {drawToolsIcons[drawOption] ?? <MdHelp />}
            </ToolButton>
          ))}
        </div>
      </div>

      <div id="dwv" className="flex-1 justify-center items-center">
        {loadProgress < 100 && (
          <div className="absolute top-0 left-0 z-50 w-[100vw] h-[100vh] bg-zinc-900 flex justify-center items-center">
            <ProgressIndicator progress={loadProgress} />
          </div>
        )}

        <div id="layerGroup0" className="layerGroup">
          <div id="dropBox"></div>
        </div>
      </div>
    </div>
  )
}
