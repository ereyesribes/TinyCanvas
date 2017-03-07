"use strict";
var tinySprite = (function () {
    function tinySprite(path, frameW, frameH, loadCallback) {
        if (loadCallback === void 0) { loadCallback = function (i) { }; }
        this.img = new Image();
        this.img.setAttribute("src", path);
        tinyCanvas.appendEvent(this.img, "load", function (e) {
            loadCallback(this.img);
        });
        this.frameW = frameW;
        this.frameH = frameH;
    }
    return tinySprite;
}());
var tinyCanvas = (function () {
    function tinyCanvas(canvas, fps) {
        if (fps === void 0) { fps = 25; }
        if (canvas && (canvas.getContext)) {
            this.cnv = canvas;
            this.ctx = canvas.getContext('2d');
            this.frameRate = fps;
            this.eventFunctions = {};
            this.bcanvas = document.createElement("canvas");
            this.bcanvas.setAttribute("width", this.cnv.getAttribute("width"));
            this.bcanvas.setAttribute("height", this.cnv.getAttribute("height"));
            this.buffer = this.bcanvas.getContext('2d');
        }
        else {
            alert("Error: Element is not a canvas or browser doesn't support this feature.");
        }
    }
    tinyCanvas.preload = function (path, loadCallback) {
        if (loadCallback === void 0) { loadCallback = function () { }; }
        var img = new Image();
        img.setAttribute("src", path);
        tinyCanvas.appendEvent(img, "load", function (e) {
            loadCallback(img);
        });
        return img;
    };
    tinyCanvas.appendEvent = function (obj, e, funct) {
        if (obj.addEventListener) {
            obj.addEventListener(e, funct, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent('on' + e, funct);
        }
    };
    tinyCanvas.removeEvent = function (obj, e, funct) {
        if (obj.removeEventListener) {
            obj.removeEventListener(e, funct, false);
        }
        else if (obj.attachEvent) {
            obj.detachEvent('on' + e, funct);
        }
    };
    tinyCanvas.prototype.cursor = function (event) {
        if (!event) {
            var e = window.event;
        }
        if (!event.target) {
            event.target = event.srcElement;
        }
        var totalOffsetX = 0, totalOffsetY = 0, canvasX = 0, canvasY = 0, currentElement = this.cnv;
        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        } while (currentElement = currentElement.offsetParent);
        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;
        return { x: canvasX, y: canvasY };
    };
    tinyCanvas.prototype.img = function (img, x, y) {
        this.buffer.drawImage(img, x, y);
    };
    tinyCanvas.prototype.sprite = function (spr, x, y, row, column) {
        this.buffer.drawImage(spr.img, row * spr.frameW, column * spr.frameH, spr.frameW, spr.frameH, x, y, spr.frameW, spr.frameH);
    };
    tinyCanvas.prototype.pathImg = function (path, x, y) {
        var img = new Image();
        img.setAttribute("src", path);
        tinyCanvas.appendEvent(img, "load", function (e) {
            this.buffer.drawImage(img, x, y);
        }.bind(this));
    };
    tinyCanvas.prototype.onFrame = function (callback) {
        if (!this.fint) {
            this.fint = setInterval(function () {
                callback(this.buffer);
            }.bind(this), 1000.0 / this.frameRate);
            return true;
        }
        else {
            return false;
        }
    };
    tinyCanvas.prototype.clearFrame = function () {
        clearInterval(this.fint);
    };
    tinyCanvas.prototype.on = function (eName, callback) {
        eName = eName.toLowerCase();
        if (eName === "frame") {
            this.onFrame(callback);
        }
        else {
            if (!this.eventFunctions[eName]) {
                this.eventFunctions[eName] = function (e) {
                    var cur = this.cursor(e);
                    callback(e, this.buffer, { "x": cur.x, "y": cur.y });
                }.bind(this);
                tinyCanvas.appendEvent(this.cnv, eName, this.eventFunctions[eName]);
                return true;
            }
            else {
                return false;
            }
        }
    };
    tinyCanvas.prototype.no = function (eName) {
        eName = eName.toLowerCase();
        if (eName === "frame") {
            this.clearFrame();
        }
        else {
            tinyCanvas.removeEvent(this.cnv, eName, this.eventFunctions[eName]);
            delete this.eventFunctions[eName];
        }
    };
    tinyCanvas.prototype.line = function (x1, y1, x2, y2, style) {
        if (style === void 0) { style = undefined; }
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
    };
    tinyCanvas.prototype.draw = function () {
        this.ctx.drawImage(this.bcanvas, 0, 0);
        this.clearBuffer();
    };
    tinyCanvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, 4000, 4000);
    };
    tinyCanvas.prototype.clearBuffer = function () {
        this.buffer.clearRect(0, 0, 4000, 4000);
    };
    return tinyCanvas;
}());
