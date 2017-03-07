
# TinyCanvas, the canvas library of the people

In looking at how other libraries seemed to tackle this issue, I remained
unconvinced by the "let's teach Canvas how to do something it's already good at
doing" feel that they transmitted.

So I decided that I'd make my very own library, focusing on stuff that Canvas
has no clue how to do (event handling, paint cycle, double buffering), but that
will keep popping up as stuff that will persistently be necessary to operate a
Canvas properly.

Without further adieu...

## Let's see it working

Include tinyCanvas.js

You now have access to two classes: tinyCanvas and tinySprite, more on the second later.
For now let's review the methods offered by the tinyCanvas class:

Firstly let's create a tinyCanvas:

```
  var tcv = (myCanvasElement);
```
as a second argument, you can specify the FPS, which default to 25.

So... let's set up a paint cycle:
```
  tcv.on("frame", function(buffer){
    // ^ you could also use .onFrame

    // Random scribblings of a mad man.
    .........


    /* After creating our work of art we clear the canvas, and then we draw on
      it whatever's on our back buffer. */
    tcv.clear();
    tcv.draw();
  });
```
Notice that your second argument is a function with one argument, the back-buffer,
so that you can easily draw on it.
The back buffer is a completely normal canvas, it's just not appended to the DOM,
so you can draw on it just as you would draw on a normal canvas.

The .on method appends events to tinyCanvas, it takes an event name (case insensitive),
and a handler.

of course, "frame" is not a real event, but an "eventoid" in the sense that we treat
it exactly like a real event, even though its not.

the arguments taken by a Frame handler differ from those taken by real event
handlers, which would look something like:

```
tcv.on("click", function(event, buffer, cursor) {
  // Start some pretty sweet animation.
});
```
because you're going to want to find out the mouse position way often if your
content is interactive, that work is already handled for you by default, cursor
is an object of the type
{"x": cursorX, "y": cursorY} usable within your handler.

Now something at runtime determines that you no longer want sweet animations upon
clicking, let's see how you remove the event:
```
tcv.no("click");
```
you could even kill the paint cycle in the same manner:
```
tcv.no("frame"); // alias: .clearFrame
```
okay, there must be a catch, right? well... kind of. You can only use 1 handler
per event, so you must think them through.

Enough about events, let's talk about the rest of methods

```
tcv.clearBuffer();
```
like .clear, but it clears the backbuffer not the actual canvas.

```
tcv.line(x1,y1,x2,y1,strokeStyle[optional]);
```
Draws a line from x1,y1 to x2,y2 (on back buffer)

```
tcv.pathImg(pathToFile, x, y);
```
Draws a non-preloaded image UPON LOAD. Not recommended if you've set up a paint cycle.

```
tcv.img(image,x,y);
```
Draws a preloaded Image element (no need to append it to the DOM.)
```
var img = tinyCanvas.preload(path,loadCallback[optional]);
```
static method, preloads the image for you and does the event handling as well,
since you're likely to need this often.

```
tcv.sprite(spr: tinySprite, x: number, y: number, row: number, column: number){
```
draws an instance of tinySprite on x,y, the offsets and everything is already
calculated  for you

```
 var tsp = new tinySprite(path , frameW, frameH, loadCallback[optional]);
```
instantiation of a tinySprite

## Stay in touch

This code is a bit old, I must admit. I created it for a video game project that I have since discontinued.

So, please, if you like the spirit of this library and where this was headed, then reach me! Let me know I should continue developing this!

## Show some love!

If you appreciate this library, please consider donating, it would be much appreciated!

<a href='https://pledgie.com/campaigns/33503'><img alt='Click here to lend your support to: TinyCanvas and make a donation at pledgie.com !' src='https://pledgie.com/campaigns/33503.png?skin_name=chrome' border='0' ></a>
