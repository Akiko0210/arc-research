"use client";
import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import ExpandingCircle from "@/components/ExpandingCircle";
import { usePosts } from "@/providers/PostProvider";

const MatterJsComponent = () => {
  const canvasRef = useRef(null);
  const { checkLists } = usePosts();
  const [clickedPosition, setClickedPosition] = useState(null);
  const repulsionDistance = 100; // Adjust this value to control the repulsion force
  let mouseMovedDuringDrag = false;
  let trashBin;

  useEffect(() => {
    const sketch = (p) => {
      let objects = [];
      let selectedObject = null;
      let offset = null;

      p.setup = () => {
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;
        p.createCanvas(canvasWidth, canvasHeight);
        p.background(0); // Set background color to black

        // Create trash bin
        trashBin = {
          x: canvasWidth - 100, // Adjust position as needed
          y: canvasHeight - 100, // Adjust position as needed
          width: 80,
          height: 80,
          label: "Trash",
        };
        objects = checkLists.map((list, index) => {
          return {
            x: p.random(canvasWidth),
            y: p.random(canvasHeight),
            radius: 40,
            fillStyle: p.color(p.random(255), p.random(255), p.random(255)), // Random color for each circle
            label: list.title, // Text label for the circle
            index,
          };
        });
        // create objects (vertices)
        // for (let i = 0; i < 5; i++) {
        //   const object = {
        //     x: p.random(canvasWidth),
        //     y: p.random(canvasHeight),
        //     radius: 40,
        //     fillStyle: p.color(p.random(255), p.random(255), p.random(255)), // Random color for each circle
        //     label: `Object ${i}`, // Text label for the circle
        //   };
        //   objects.push(object);
        // }
      };

      p.draw = () => {
        p.background(0); // Clear the canvas on every frame

        // Update positions based on repulsion
        for (let i = 0; i < objects.length; i++) {
          for (let j = i + 1; j < objects.length; j++) {
            const dx = objects[j].x - objects[i].x;
            const dy = objects[j].y - objects[i].y;
            const distance = p.sqrt(dx * dx + dy * dy);

            if (distance < repulsionDistance) {
              const forceMagnitude = (repulsionDistance - distance) * 0.01; // Adjust this value to control the repulsion strength
              const forceX = (forceMagnitude * dx) / distance;
              const forceY = (forceMagnitude * dy) / distance;

              objects[i].x -= forceX;
              objects[i].y -= forceY;
              objects[j].x += forceX;
              objects[j].y += forceY;
            }
          }
        }

        // Display connections (lines) with variable opacity
        for (let i = 0; i < objects.length; i++) {
          for (let j = i + 1; j < objects.length; j++) {
            const dx = objects[j].x - objects[i].x;
            const dy = objects[j].y - objects[i].y;
            const distance = p.sqrt(dx * dx + dy * dy);

            // Calculate opacity as a function of distance
            const opacity = p.map(distance / 5, 0, repulsionDistance, 255, 0);

            p.stroke(255, opacity); // Set stroke color to white with variable opacity
            p.line(objects[i].x, objects[i].y, objects[j].x, objects[j].y);
          }
        }

        // Display vertices (circles) with outline and solid dot
        // let hovered = false;
        for (let i = 0; i < objects.length; i++) {
          const object = objects[i];

          // Draw outline
          p.noFill();
          p.strokeWeight(2); // Set stroke weight for outline
          p.stroke(object.fillStyle); // Set outline color to white
          p.ellipse(object.x, object.y, object.radius * 1);

          // Draw solid dot
          p.fill(object.fillStyle); // Set fill color to object's fillStyle
          p.noStroke();
          p.ellipse(object.x, object.y, object.radius * 0.1); // Adjust the radius for the solid dot as needed

          // Draw text box
          p.fill(255); // Set fill color to white
          p.textSize(12); // Set text size
          p.textAlign(p.CENTER, p.BOTTOM); // Align text to center bottom
          p.text(object.label, object.x, object.y - object.radius - 5); // Adjust the vertical offset as needed
        }

        // Draw trash bin
        p.fill(255);
        p.textSize(12); // Set text size
        p.textAlign(p.CENTER, p.BOTTOM); // Align text to center bottom
        p.text(trashBin.label, trashBin.x + trashBin.width / 2, trashBin.y); // Adjust the vertical offset as needed
        p.fill(255, 0, 0); // Set fill color to red
        p.rect(trashBin.x, trashBin.y, trashBin.width, trashBin.height); // Draw trash bin rectangle
      };

      // Event handling for circle clicks and drag
      p.mousePressed = () => {
        mouseMovedDuringDrag = false;
        for (let i = 0; i < objects.length; i++) {
          const d = p.dist(p.mouseX, p.mouseY, objects[i].x, objects[i].y);
          if (d < objects[i].radius) {
            selectedObject = objects[i];
            offset = p.createVector(
              selectedObject.x - p.mouseX,
              selectedObject.y - p.mouseY
            );
            break;
          }
        }
      };

      p.mouseDragged = () => {
        mouseMovedDuringDrag = true;
        if (selectedObject) {
          selectedObject.x = p.mouseX + offset.x;
          selectedObject.y = p.mouseY + offset.y;
        }
      };

      p.mouseReleased = () => {
        if (selectedObject && offset && !mouseMovedDuringDrag) {
          console.log(
            "Clicked but not dragged on a circle:",
            objects.indexOf(selectedObject)
          ); // Log the index of the clicked circle
          setClickedPosition({
            x: selectedObject.x,
            y: selectedObject.y,
            index: selectedObject.index,
          });
        } else {
          // Check if dragged object is inside trash bin
          if (
            selectedObject &&
            selectedObject.x > trashBin.x &&
            selectedObject.x < trashBin.x + trashBin.width &&
            selectedObject.y > trashBin.y &&
            selectedObject.y < trashBin.y + trashBin.height
          ) {
            // Remove the dragged object from the array
            const index = objects.indexOf(selectedObject);
            if (index !== -1) {
              objects.splice(index, 1);
            }
          }
        }
        selectedObject = null;
        offset = null;
      };
    };

    new p5(sketch, canvasRef.current);

    return () => {
      // Clean up any resources if needed
    };
  }, []);

  return (
    <div>
      {/* <div>{`${clickedPosition.x} + ${clickedPosition.y}`}</div> */}
      <div ref={canvasRef}></div>;
      {clickedPosition && (
        <ExpandingCircle
          x={clickedPosition.x}
          y={clickedPosition.y}
          index={clickedPosition.index}
        />
      )}
    </div>
  );
};

export default MatterJsComponent;
