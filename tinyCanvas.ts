/*
  tinyCanvas, the canvas library of the people.
  Written by Javier Reyes Ribes <cobretti124@gmail.com>
*/
"use strict";

 class tinySprite {
  public img: HTMLImageElement;

  public frameW: number;
  public frameH: number;

  constructor(path: string, frameW: number, frameH: number, loadCallback: Function = function(i){}){
    this.img = new Image();
    this.img.setAttribute("src", path);

    tinyCanvas.appendEvent(this.img, "load", function(e){
      loadCallback(this.img);
    });


    this.frameW = frameW;
    this.frameH = frameH;
  }
}


class tinyCanvas {
  /*
    Note: You NEED to use the buffer.
    tinyCanvas will *NOT* allow you to draw directly on your canvas.
  */

  private ctx: CanvasRenderingContext2D;     // The context, publicly accessible.
  public frameRate: number;                 // FPS

  private cnv;                              // The actual Canvas element itself.
  private fint;                             // The Interval used to handle the onFrame eventoid.
  private eventFunctions;

  private bcanvas: HTMLCanvasElement;       // The back-buffer Canvas
  public buffer: CanvasRenderingContext2D;  // The back-buffer context.


  constructor(canvas: HTMLCanvasElement, fps: number = 25) {
    if (canvas && (canvas.getContext)) {
      this.cnv = canvas;
      this.ctx = canvas.getContext('2d');
      this.frameRate = fps;
      this.eventFunctions = {};

      // Initializes the buffer
      this.bcanvas = document.createElement("canvas");

      this.bcanvas.setAttribute("width", this.cnv.getAttribute("width"));
      this.bcanvas.setAttribute("height", this.cnv.getAttribute("height"));

      this.buffer = this.bcanvas.getContext('2d');

    } else {
      alert("Error: Element is not a canvas or browser doesn't support this feature.");
    }
  }

  // Preloads an image
  static preload(path: string, loadCallback: Function = function(){}): HTMLImageElement{
    var img = new Image();
    img.setAttribute("src", path);

    tinyCanvas.appendEvent(img, "load", function(e){
      loadCallback(img);
    });
    return img;
  }



  // Utility functions, append and remove an event without jQuery.
  static appendEvent(obj, e, funct): void {
    if (obj.addEventListener) {
      obj.addEventListener(e, funct, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + e, funct);
    }
  }

  static removeEvent(obj, e, funct): void {
    if (obj.removeEventListener) {
      obj.removeEventListener(e, funct, false);
    } else if (obj.attachEvent) {
      obj.detachEvent('on' + e, funct);
    }
  }
  /////////////////////////////////////////////////////////////////

  cursor(event) {
    if (!event) {var e = window.event;}
    if (!event.target) {event.target = event.srcElement;}

    var totalOffsetX = 0,
      totalOffsetY = 0,
      canvasX = 0,
      canvasY = 0,
      currentElement = this.cnv;
    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x: canvasX, y: canvasY};
  }

  /*
      Draws an image to the BUFFER.
      Should maybe preload or something.
  */

  // Draws a preloaded image unto the buffer, should ALWAYS be used instead of its sibling pathImg
  img(img: HTMLImageElement, x: number, y: number): void {
    this.buffer.drawImage(img, x, y);
  }

  // Draws a tinySprite unto the buffer
  sprite(spr: tinySprite, x: number, y: number, row: number, column: number){
    this.buffer.drawImage(spr.img, row * spr.frameW, column * spr.frameH, spr.frameW, spr.frameH, x, y, spr.frameW, spr.frameH)
    /*
      img 	Source image object 	Sprite sheet
      sx 	Source x 	Frame index times frame width
      sy 	Source y 	0
      sw 	Source width 	Frame width
      sh 	Source height 	Frame height
      dx 	Destination x 	0
      dy 	Destination y 	0
      dw 	Destination width 	Frame width
      dh 	Destination height 	Frame height
    */
  }

  // Draws a non-preloaded image unto the buffer
  pathImg(path: string, x: number, y: number): void {
    var img = new Image();
    img.setAttribute("src", path);

    tinyCanvas.appendEvent(img, "load", function(e){
      this.buffer.drawImage(img, x, y);
    }.bind(this));
  }



  // set the Frame callback.
  onFrame(callback: Function): boolean {
    // Injects the back buffer context into the callback.
    if (!this.fint) {
      this.fint = setInterval(function() {
        callback(this.buffer);
      }.bind(this), 1000.0 / this.frameRate);
      return true;
    } else {
      // You can only assign one callback.
      return false;
    }
  }

  clearFrame(): void {
    // Clears the onFrame eventoid.
    clearInterval(this.fint);
  }




  /*
    Appends an event or eventoid to tinyCanvas.
  */
  on(eName: string, callback: Function): boolean {
    eName = eName.toLowerCase();

    if (eName === "frame"){
      this.onFrame(callback);
    }else{
      if (!this.eventFunctions[eName]) {
        this.eventFunctions[eName] = function(e){
            var cur = this.cursor(e);
            callback(e, this.buffer, {"x": cur.x, "y": cur.y});
          }.bind(this);
        tinyCanvas.appendEvent(this.cnv, eName, this.eventFunctions[eName]);
        return true;
      } else {
        return false;
      }
    }
  }

  // Unbinds an event or eventoid.
  no(eName: string): void {
    eName = eName.toLowerCase();

    if (eName === "frame"){
      this.clearFrame();
    } else  {
      tinyCanvas.removeEvent(this.cnv, eName, this.eventFunctions[eName]);
      delete this.eventFunctions[eName]; /////////////////////////////////
    }
  }


  /*
    Draws a line onto the BACK-BUFFER.
  */
  line(x1: number, y1: number, x2: number, y2: number, style: string = undefined): void {
    var oldStyle = this.buffer.strokeStyle;

    if (style !== undefined) {
      this.buffer.strokeStyle = style;
    }
    this.buffer.beginPath();
    this.buffer.moveTo(x1, y1);
    this.buffer.lineTo(x2, y2);
    this.buffer.closePath();
    this.buffer.stroke();

    this.buffer.strokeStyle = oldStyle;
  }
  /*
    Maybe it would be necessary to make an onClick method which would trigger a callback with
    the position of the click, relative to the canvas

  */


  // Draws the back-buffer onto the Canvas.
  draw(): void {
    this.ctx.drawImage(this.bcanvas, 0, 0);
    this.clearBuffer();
  }

  // Clears the Canvas
  clear(): void {
    this.ctx.clearRect(0, 0, this.cnv.getAttribute("width"), this.cnv.getAttribute("height"));
  }

  // Clears the buffer.
  clearBuffer(): void {
    this.buffer.clearRect(0, 0, this.cnv.getAttribute("width"), this.cnv.getAttribute("height"));
  }

}
