import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useLocation, useNavigate } from "react-router-dom";

const AddCaption = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [captionText, setCaptionText] = useState("");

  useEffect(() => {
    if (imageUrl) {
      const newCanvas = new fabric.Canvas("canvas", {
        width: 600,
        height: 400,
      });
      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          img.set({ crossOrigin: "anonymous" });
          img.scaleToWidth(600);
          newCanvas.setBackgroundImage(
            img,
            newCanvas.renderAll.bind(newCanvas)
          );
        },
        { crossOrigin: "anonymous" }
      );
      setCanvas(newCanvas);
    }
  }, [imageUrl]);

  const handleAddCaption = () => {
    if (!captionText || !canvas) return;

    const text = new fabric.IText(captionText, {
    left: 50,
    top: 350,
    fontSize: 24,
    fill: "#ffffff",
    fontFamily: "Arial",
    backgroundColor: "rgba(0,0,0,0.5)",
    lockUniScaling: false,
    hasControls: true,
    originX: 'center',
    originY: 'top',
    scaleX: 1,
    scaleY: 1,
  });
    text.on("scaling", function () {
      const newScaleX = text.scaleX;
      text.fontSize = 24 * newScaleX;
  
      canvas.renderAll();
    });
    canvas.add(text);
    logCanvasObjects();
    canvas.setActiveObject(text);
    canvas.renderAll();
    setCaptionText("");
  };

  const handleRemoveObject = (type) => {
    const activeObject = canvas?.getActiveObject();
    const allObject = canvas?.getObjects();
    switch (type) {
      case "active":
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.renderAll();
        }
        break;
      case "all":
        if (allObject) {
          canvas.remove(...allObject);
          canvas.renderAll();
        }
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "captioned-image.png";
    link.click();
  };

  const handleBack = () => {
    navigate("/");
  };

  const logCanvasObjects = () => {
    if (!canvas) return;
    const allObjects = canvas.getObjects().map((obj, index) => {
      return {
        index,
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
        text: obj.text || null,
        src: obj.type === "image" ? obj.getSrc?.() : null,
        fill: obj.fill,
        fontSize: obj.fontSize || null,
        fontFamily: obj.fontFamily || null,
        backgroundColor: obj.backgroundColor || null,
      };
    });

    console.log("Canvas Layers:", allObjects);
  };

  const handleAddShape = (shapeType) => {
    let shape;
    const commonProps = {
      left: 100,
      top: 100,
      fill: "transparent",
      stroke: "white",
      strokeWidth: 2,
    };

    switch (shapeType) {
      case "rectangle":
        shape = new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 60,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          ...commonProps,
          radius: 50,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 38 },
            { x: 81, y: 100 },
            { x: 19, y: 100 },
            { x: 0, y: 38 },
          ],
          {
            ...commonProps,
            left: 100,
            top: 100,
            originX: "center",
            originY: "center",
          }
        );
        break;

      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  useLayoutEffect(() => {
    if (location.state?.imageUrl) {
      setImageUrl(location.state?.imageUrl);
    }
  }, [location]);

  return (
    <div className="add-caption-container">
      <div className="canvas-container">
        <canvas id="canvas" ref={canvasRef}></canvas>
      </div>

      <div className="controls">
        <h1>Add Caption</h1>
        <input
          type="text"
          placeholder="Enter your caption"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
        />
        <button onClick={handleAddCaption}>Add Caption</button>
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleBack}>Back</button>

        <div className="shape-buttons">
          <button onClick={() => handleAddShape("rectangle")}>
            Add Rectangle
          </button>
          <button onClick={() => handleAddShape("circle")}>Add Circle</button>
          <button onClick={() => handleAddShape("triangle")}>
            Add Triangle
          </button>
          <button onClick={() => handleAddShape("polygon")}>Add Polygon</button>
          <button
            onClick={() => handleRemoveObject("active")}
            style={{ marginTop: "20px", background: "red" }}
          >
            Remove Active Object
          </button>
          <button
            onClick={() => handleRemoveObject("all")}
            style={{ marginTop: "20px", background: "red" }}
          >
            Remove All Objects
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCaption;
