import './App.css';
import fabric from 'fabric';
import React, { useEffect, useState, useRef } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Topbar.scss';
import './Sidebar.scss';
import './Main.scss'
import './Content.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Dialog } from 'primereact/dialog';
        

import { Tooltip } from 'primereact/tooltip';
import { ContextMenu } from 'primereact/contextmenu';
         

//const FabricContext = React.createContext();

function App() {
  const { editor, onReady } = useFabricJSEditor();
  //const [visibleLeft, setVisibleLeft] = useState(false);
  const history = [];
  const [color, setColor] = useState("#35363a");
  const contextMenu = useRef(null);
  const [displayBasic, setDisplayBasic] = useState(false);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }

    editor.canvas.renderAll();
  }, [editor]);

  const onAddCircle = () => {
    editor.addCircle();
  };
  
  const onAddRectangle = () => {
    editor.addRectangle();
  };

  const onAddLine = () => {
    editor.addLine();
  }

  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };

  const addText = () => {
    editor.addText("Text");
  };

  const contextMenuItems = [
    {
      label: 'Undo',
      icon: 'pi pi-undo',
      command:()=>{ editor.canvas.remove(editor.canvas.getActiveObject()); }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command:()=>{ editor.canvas.remove(editor.canvas.getActiveObject()); }
    }
  ];

  const onContextRightClick = (event) => {
    contextMenu.current.show(event);
  };

  return (
    <div className="layout-wrapper">
      <div className="layout-topbar">
        <div className='layout-topbar-logo'>
          <span>DRAW</span> 
        </div>
        <Button className="p-link layout-topbar-button" tooltip="Zoom In" tooltipOptions={{ position: 'bottom' }} onClick={() => editor.canvas.setZoom(editor.canvas.getZoom() + 0.5)}>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" tooltip="Zoom Out" tooltipOptions={{ position: 'bottom' }} onClick={() => editor.canvas.setZoom(editor.canvas.getZoom() - 0.5)}>
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{color: "#000000",}}/>
        </Button>
        <Button className="p-link layout-topbar-button" onClick={addText} rounded text tooltip="Add Text Box" tooltipOptions={{ position: 'bottom' }}>
          <FontAwesomeIcon icon={faFont} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" onClick={toggleDraw} rounded text tooltip="Enable/Disable Draw" tooltipOptions={{ position: 'bottom' }}>
          <FontAwesomeIcon icon={faPenToSquare} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" onClick={undo} rounded text tooltip="Undo" tooltipOptions={{ position: 'top' }}>
          <FontAwesomeIcon icon={faArrowRotateLeft} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" onClick={redo} rounded text tooltip="Redo" tooltipOptions={{ position: 'top' }}>
          <FontAwesomeIcon icon={faArrowRotateRight} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" onClick={removeSelectedObject} rounded text tooltip="Delete Selected Item" tooltipOptions={{ position: 'top' }}>
          <FontAwesomeIcon icon={faTrashCan} style={{color: "#000000",}} />
        </Button>
        <Button className="p-link layout-topbar-button" onClick={clear} rounded text tooltip="Clear the Canvas" tooltipOptions={{ position: 'top' }}>
          <FontAwesomeIcon icon={faEraser} style={{color: "#000000",}} />
        </Button>
        <label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <div className='layout-topbar-menu'>
          <Button className="p-link layout-topbar-button" rounded text style={{color: "#000000"}} tooltip="Download (WIP)" tooltipOptions={{ position: 'bottom' }}>
            <FontAwesomeIcon icon={faDownload} />
          </Button>
          <Button className="p-link layout-topbar-button" rounded text style={{color: "#000000"}} tooltip="Upload (WIP)" tooltipOptions={{ position: 'bottom' }}>
            <FontAwesomeIcon icon={faUpload} />
          </Button>
          <Button  icon="pi pi-info-circle" rounded text tooltip="Info" tooltipOptions={{ position: 'bottom' }} style={{color: "#000000", fontSize: '1.5rem'}} onClick={() => setDisplayBasic(true)} />
          <Dialog header="Info" visible={displayBasic} style={{ width: '50vw' }} onHide={() => setDisplayBasic(false)}>
              <p className="m-0">
                  This is a simple drawing application. There are many like it, but this one is mine.
                  This application is still a work in progress, with many features and shapes coming
                  in the future. To get started, check out the shapes in the left panel and editing
                  buttons above the canvas.
              </p>
          </Dialog>
        </div>
      </div>
      <div className="layout-sidebar">
        <Accordion activeIndex={0}>
          <AccordionTab header="Shapes">
            <Button onClick={onAddRectangle} severity="secondary" tooltip="Add Square" outlined >
              <FontAwesomeIcon icon={faSquareFull} style={{color: "#000000",}} className='iconStyle' />
            </Button>
            <Button onClick={onAddCircle} severity="secondary" tooltip="Add Circle" outlined >
              <FontAwesomeIcon icon={faCircle} style={{color: "#000000",}} className='iconStyle' />
            </Button>
            <Button onClick={onAddLine} severity="secondary" tooltip="Add Line" outlined >
              <FontAwesomeIcon icon={faMinus} rotation={45} style={{color: "#000000",}} className='iconStyle' />
            </Button>


          </AccordionTab>
          <AccordionTab header="UML">
              <p className="m-0">
                  Test 2
              </p>
          </AccordionTab>
          <AccordionTab header="Other">
              <p className="m-0">
                  Test 3
              </p>
          </AccordionTab>
      </Accordion>
      </div>
      <div className="layout-main-container">
        <div className="layout-main" onContextMenu={onContextRightClick}>
          <FabricJSCanvas className="sample-canvas" onReady={onReady} />
          <ContextMenu ref={contextMenu} model={contextMenuItems} />
          
        </div>
      </div>
    </div>

  );
}

export default App;