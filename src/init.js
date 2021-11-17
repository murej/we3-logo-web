import paper from 'paper/dist/paper-full'
import we3LogoSvg from './we3_logo.svg';
import { getRandomNumber, mapValue, easeOutElastic, getSignMultiplier } from './helpers';

let initialLogoItemPositions = [];
// let cumulativeItemRotations = []
let onLogoGroupMouseEnterTimeout = null;

function onFrame(event) {
    console.log("on frame")

    const circlePaths = paper.project.layers[1].children;
    // // const backgroundItem = paper.project.layers[0].children;

    const isOverThreshold = event.count % 1 === 0

    // isOverThreshold && circlePaths.forEach((path, i) => {
    //     // path.selected = true;
    //     path.segments.forEach((segment, j) => {
    //         segment.point.x += 1 * Math.sin(1/4 * event.count / (i+j+1)) * Math.random()// * Math.random() * (j+1) / path.segments.length;
    //         segment.point.y += 1 * Math.cos(1/4 * event.count / (i+j+1)) * Math.random()// * Math.random() * (j+1) / path.segments.length;
    //     })
    //     // path.rotation += 1 * (i+1) / 8;
    //     path.smooth({ type: 'continuous' });
    // })

    // circlePaths.forEach((path, i) => {
    //     path.rotation += 1 * (i + 1) / 256;
    // });
}

function createPaths() {
    const { width, height } = paper.view.size;

    var values = {
        paths: getRandomNumber(4,16),
        minPoints: getRandomNumber(3,8),
        maxPoints: getRandomNumber(8, 32),
        minRadius: (width > height ? width : height) / 3,
        maxRadius: (width < height ? width : height) / 1.5,
        baseHue: Math.random() * 360,
        strokeWidth: 32
    };

    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    for (var i = 0; i < values.paths; i++) {
        var radius = values.minRadius + Math.random() * radiusDelta; //width/values.paths * (i+1)
        var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
        var path = createBlob({ x: Math.random() * width, y: Math.random() * height }, radius, points);
        var lightness = (Math.random() - 0.5) * 0.4 + 0.4;
        var hue = values.baseHue + (i * 360 / values.paths) % 360;
        path.fillColor = { hue: hue, saturation: 1, lightness: lightness };
        // path.strokeWidth = 4;
        // path.strokeColor = 'white'
        // path.strokeColor = { hue: hue, saturation: 1, lightness: lightness };
        path.sendToBack();
        // path.strokeWidth = values.strokeWidth;
        path.blendMode = 'multiply'
    };
}

function createBlob(center, maxRadius, points) {
    var path = new paper.Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new paper.Point({
            length: (maxRadius * 0.66) + (Math.random() * maxRadius * 0.34),
            angle: (360 / points) * i
        });
        path.add({ x: center.x + delta.x, y: center.y + delta.y });
    }
    (Math.random() <= 0.5 ? true : false) && path.smooth({ type: 'continuous' });
    // (Math.random() <= 0.5 ? true : false) && path.simplify();
    return path;
}

function createBackground() {
    var topLeft = [0, 0];
    var bottomRight = [paper.view.size.width, paper.view.size.height];

    var backgroundRect = new paper.Path.Rectangle({
        point: [0, 0],
        size: [paper.view.size.width, paper.view.size.height],
    });
    backgroundRect.fillColor = new paper.Color(1,1,1);
    // backgroundRect.fillColor = {
    //     gradient: {
    //         stops: ['yellow', 'magenta', 'cyan']
    //     },
    //     origin: topLeft,
    //     destination: bottomRight
    // };

    new paper.Layer(backgroundRect).sendToBack();
}

function onSVGLoad(loadedSvgItem) {

    let logoGroup = loadedSvgItem;
    logoGroup.children[0].remove();
    // logoGroup.clipped = false:

    logoGroup.fillColor = null;
    // logoGroup.fillColor = new paper.Color(1,1,1)//{ hue: 15, saturation: 1, lightness: 1 };
    // logoGroup.fillColor = new paper.Color(1,1,1);
    // logoGroup.opacity = 0;
    logoGroup.strokeColor = 'white';
    logoGroup.strokeWidth = 4;
    logoGroup.position = paper.view.center;

    // logoGroup.children[0].smooth({ type: 'continuous' });
    // logoGroup.children[1].smooth({ type: 'continuous' });
    // logoGroup.children[2].smooth({ type: 'continuous' });
    // logoGroup.children[0].simplify();
    // logoGroup.children[1].simplify();
    // logoGroup.children[2].simplify();

    const staticLayer = new paper.Layer(logoGroup);
    // staticLayer.blendMode = 'multiply'

    generateInitialLogoGroups(logoGroup, getRandomNumber(16, 96));
}

function generateInitialLogoGroups(logoGroup, count) {
    const gap = 2;
    const interactiveLayer = new paper.Layer();
    // interactiveLayer.blendMode = 'multiply'

    const signMultiplier1 = getSignMultiplier();
    const signMultiplier2 = getSignMultiplier();

    for (let i = 0; i < count; i++) {
        let logoGroupInstance = logoGroup.copyTo(interactiveLayer);

        const isLastGroup = i == count - 1;

        const fillVal = {
            r: mapValue(i, 0, count - 1, 0.4 * (i + 1) / 8, 1),
            g: mapValue(i, 0, count - 1, 0.4 * (i + 1) / 8, 1),
            b: mapValue(i, 0, count - 1, 0.2 * (i + 1) / 8, 1)
        }

        // const fillVal = {
        //     r: mapValue(i, 0, count-1, 0, 1),
        //     g: mapValue(i, 0, count-1, 0, 1),
        //     b: mapValue(i, 0, count-1, 0, 1)
        // }

        // logoGroupInstance.fillColor = new paper.Color(fillVal.r, fillVal.g, fillVal.b);
        logoGroupInstance.fillColor = new paper.Color(1, 1, 1, ((i + 1) / count));
        // logoGroupInstance.fillColor = new paper.Color(((i + 1) / count), ((i + 1) / count), ((i + 1) / count))

        if (!isLastGroup) {
            logoGroupInstance.strokeColor = null;
            // logoGroupInstance.strokeColor = new paper.Color(((i + 1) / count), ((i + 1) / count), ((i + 1) / count))

        }
        // logoGroupInstance.strokeColor = new paper.Color(1,1,1);
        // logoGroupInstance.opacity = i / (count - 1);

        isLastGroup && logoGroupInstance.children.forEach((logoItem) => {
            logoGroupInstance.fillColor = 'black';
            logoItem.onMouseEnter = handleOnLogoGroupMouseEnter;
            logoItem.onMouseMove = handleOnLogoGroupMouseMove;
            logoItem.onMouseLeave = handleOnLogoGroupMouseLeave;
            logoItem.onMouseDrag = handleOnLogoGroupMouseDrag;
            logoItem.onMouseDown = handleOnLogoGroupMouseDown;
            logoItem.onMouseUp = handleOnLogoGroupMouseUp;
        })

        logoGroupInstance.position.x += -i * gap * signMultiplier1 / gap;
        logoGroupInstance.position.y += -i * gap * signMultiplier2;

        initialLogoItemPositions.push({
            x: logoGroupInstance.position.x,
            y: logoGroupInstance.position.y
        })
    }
}

function moveLogoGroup(delta) {
    const logoGroups = paper.project.layers[3].children;
    logoGroups.forEach((logoGroup, i) => {
        const factor = 1 / initialLogoItemPositions.length;
        logoGroup.position.x += delta.x * (i + 1) * factor;
        logoGroup.position.y += delta.y * (i + 1) * factor;

        const rotationAngle = (delta.x + delta.y) * (i + 1) * factor / 8;
        logoGroup.rotate(rotationAngle);
        // cumulativeItemRotations[i] += rotationAngle;
    });
}

function resetLogoGroup() {
    const logoGroups = paper.project.layers[3].children;
    logoGroups.forEach((logoGroup, i) => {
        logoGroup.tween(
            { 'position.x': initialLogoItemPositions[i].x, 'position.y': initialLogoItemPositions[i].y },//, 'rotation': -cumulativeItemRotations[i] },
            {
                easing: easeOutElastic,
                duration: 500
            }
        );

        // cumulativeItemRotations[i] = 0;
    });
}

let hasFlicked = false;

function handleOnLogoGroupMouseEnter(event) {
    event.target.fillColor = 'white';
    document.getElementById('canvas').style.cursor = "pointer";
}
function handleOnLogoGroupMouseMove(event) {
    if (!hasFlicked && event.delta !== null) {
        moveLogoGroup({ x: event.delta.x, y: event.delta.y });
        setTimeout(resetLogoGroup, 0);
        hasFlicked = true;
    }
    // moveLogoGroup(event.delta)
}

function handleOnLogoGroupMouseLeave(event) {
    event.target.fillColor = 'black';
    document.getElementById('canvas').style.cursor = "default";
}

function handleOnLogoGroupMouseDrag(event) {
    document.getElementById('canvas').style.cursor = "grab";
    moveLogoGroup(event.delta)
    event.target.fillColor = 'white';

    const circlePaths = paper.project.layers[1].children;
    circlePaths.forEach((path, i) => {
        // path.selected = true;
        path.segments.forEach((segment, j) => {
            segment.point.x -= Math.random() * event.delta.x * (i + 1) / 2;
            segment.point.y -= Math.random() * event.delta.y * (i + 1) / 2;
        });
        path.rotation += 1 * (i + 1) / 8 * (i * event.delta.x / 16);
        // path.smooth({ type: 'continuous' });
        // path.simplify();
    });
}

function handleOnLogoGroupMouseDown(event) {
    event.target.parent.fillColor = 'white';
}

function handleOnLogoGroupMouseUp(event) {
    document.getElementById('canvas').style.cursor = "default";
    resetLogoGroup();
    event.target.parent.fillColor = 'black';
}

export function init() {
    const canvas = document.getElementById('canvas')
    paper.setup(canvas);
    paper.project.importSVG(we3LogoSvg, onSVGLoad);
    createPaths();
    createBackground();
    // paper.view.draw();

    paper.view.onFrame = onFrame;
    // paper.view.onResize = function(event) {
    //     paper.clear();
    //     init();
    // }
    // paper.view.onMouseMove = function(event) {
    //     const hasDelta = event.delta !== null;
    //     hasDelta && paper.project.layers[1].children.forEach((path, i) => {
    //         path.segments.forEach((segment, j) => {
    //             segment.point.x += Math.sin(event.delta.x);
    //             segment.point.y += Math.cos(event.delta.x);
    //         })
    //         path.smooth({ type: 'continuous' });
    //     })    
    // }

}