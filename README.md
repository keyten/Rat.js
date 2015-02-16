# Rat.js
Small canvas object-oriented library

### Init
```js
var ctx = element.getContext('2d');
var rat = new Rat(ctx);
```

### Paths
```js
var path = rat.path([
  ['moveTo', 10, 10],
  ['lineTo', 100, 100],
  ['lineTo', 10, 100],
  ['closePath']
], {
 fillStyle: 'red',
 strokeStyle: 'green',
 lineWidth: 4
});
```

### Image
```js
var img = new Image;
img.src = "image.jpg";
img.onload = function(){
  rat.image(img, {
    rotate: 45 * Math.PI / 180,
    origin: [100, 100]
    // crop, width, height parameters for images
  });
}
```

### Text
```js
var text = rat.text("Hello, world!", {
  fillStyle: 'blue',
  translate: [0, 100]
  // maxWidth parameter for text
});
```

### Animation
```js
function draw(){
  path.style.rotate += Math.PI / 180;
  rat.clear();
  rat.draw([path, image, text]);
  requestAnimationFrame(draw);
}
draw();
```

### Transformations
With origin:
 - `rotate` (angle in radians)
 - `scale` (array, [x,y])

Without origin:
 - `translate` (array, [x,y])
 - `transform` (array, [m11,m21,m12,m22,dx,dy])
