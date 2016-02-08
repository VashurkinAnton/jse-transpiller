# JSE Transpiller

JSE like JSX but has statments in tags. Ligth, fast and very simple.
## Usage

### Server side (build)

include transpiller for you build manager before other js transpillers. But they can drop on JSE nodes.

### Client side

Include "jse-pipe-elm.js" for you project before JSE code and be happy ^_^.

#### Native type (HTML)
```
<script src="path-to-jse-transpiller/src/jse-pipe-elm.js">

```

#### RequireJS
```
define(['path-to-jse-transpiller/src/jse-pipe-elm.js'], function(JSE){
    //some code
});

```

#### ES6 to ES5 transpillers

```
import JSE from 'path-to-jse-transpiller/src/jse-pipe-elm.js';

//some code
```

### Transpiller
```
jseTranspiller.setPipeElmName('newNameForPipeElm');// Set custome name for pipe-elm lib.

var jsCode = jseTranspiller(codeWithJSX);
```
## Syntax

Simple usage, same result in variable
```
var id = 10;
var myDiv = <div class="div-class" data-id={id}>
    for(var i = 0; i < 10; i++){
        <span id={'span-in-div-number-' + i}>
            <hr>
            <text>${i} + 1 = ${i + 1};</text>
            <hr>
        </span>
    }
</div>;

console.log(myDiv);

document.body.appendChild(div);
//or if you like use jQuery
$('body').append(myDiv)
```
## Like components

```
function myComponent(index){
    return <span class={'component-number-' + index}>${index}</span>
}

var myDiv = <div class="div-class" data-id={id}>
    for(var i = 0; i < 10; i++){
        <span id={'span-in-div-number-' + i}>
            <hr>
            ${myComponent(i)}
            <text>${i} + 1 = ${i + 1};</text>
            <hr>
        </span>
    }
</div>;

console.log(myDiv);
```
## Special 

JSE designed to break JSX borders, but it has a syntax features, wich we will talk.
### Text tag
You may use custome code with statements in tags, but if you need write awesome text in this place what to do in such a situation? The answer is simple: useing resurved tag with name "text".
```
var name = 'Alex';
var textNode = <text>In this text node you may write awesome text with all symbols that you like =). And you may use interpolation like this: "My name is ${name}".</text>;

document.appendChild(textNode);
```
### Expression
You probably used to using the insert statements in the react like this: {expression}. The JSE is not much more difficult:
```
<div class={expression /* expression synax for node attributes */}>
    ${expression /* expression syntax in all tags */}
</div>
```

Is's all. The rest is only limited by your imagination. Have a nace projects with JSE.

## LICENSE

See license in LICENSE file.

Anton Vashurkin <cronosfera2@gmail.com> 2016.