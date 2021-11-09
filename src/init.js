import paper from 'paper/dist/paper-full'
import we3LogoSvg from './we3_logo.svg';
import { getRandomNumber, mapValue, easeOutElastic } from './helpers';

let initialLogoItemPositions = [];
// let cumulativeItemRotations = []
let onLogoGroupMouseEnterTimeout = null;

function onFrame(event) {
    // const backgroundItem = paper.project.layers[0].children;
    console.log("on frame")
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

    logoGroup.fillColor = new paper.Color(0.025,0.025,0.025);
    logoGroup.strokeColor = null;
    logoGroup.strokeWidth = 2;
    logoGroup.position = paper.view.center;

    generateInitialLogoGroups(logoGroup, 15);
}

function generateInitialLogoGroups(logoGroup, count) {
    const gap = 4;
    const interactiveLayer = new paper.Layer();

    for (let i = 0; i < count; i++) {
        let logoGroupInstance = logoGroup.copyTo(interactiveLayer);

        const isLastGroup = i == count-1;

        const fillVal = {
            r: mapValue(i, 0, count-1, 0.2*(i+1)/8, 1),
            g: mapValue(i, 0, count-1, 0.4*(i+1)/8, 1),
            b: mapValue(i, 0, count-1, 0.4*(i+1)/8, 1)
        }
        console.log(i, fillVal)

        logoGroupInstance.fillColor = new paper.Color(fillVal.r, fillVal.g, fillVal.b);
        logoGroupInstance.strokeColor = new paper.Color(0, 0, 0.2);
    
        isLastGroup && logoGroupInstance.children.forEach((logoItem) => {
            logoItem.onMouseEnter = handleOnLogoGroupMouseEnter;
            logoItem.onMouseLeave = handleOnLogoGroupMouseLeave;    
            logoItem.onMouseDrag = handleOnLogoGroupMouseDrag;
            logoItem.onMouseUp = handleOnLogoGroupMouseUp;        
        })

        logoGroupInstance.position.x += -i * gap / 2;
        logoGroupInstance.position.y += -i * gap;

        initialLogoItemPositions.push({
            x: logoGroupInstance.position.x,
            y: logoGroupInstance.position.y
        })
    }
}

function moveLogoGroup(delta) {
    const logoGroups = paper.project.layers[2].children;
    logoGroups.forEach((logoGroup, i) => {
        const factor = 1 / initialLogoItemPositions.length;
        logoGroup.position.x += delta.x * (i+1) * factor;
        logoGroup.position.y += delta.y * (i+1) * factor;

        const rotationAngle = (delta.x + delta.y) * (i+1) * factor / 8;
        logoGroup.rotate(rotationAngle);
        // cumulativeItemRotations[i] += rotationAngle;
    });
}

function resetLogoGroup() {
    const logoGroups = paper.project.layers[2].children;
    logoGroups.forEach((logoGroup, i) => {
        logoGroup.tween(
            { 'position.x': initialLogoItemPositions[i].x, 'position.y': initialLogoItemPositions[i].y },//, 'rotation': -cumulativeItemRotations[i] },
            {
                easing: easeOutElastic,
                duration: 700
            }
        );

        // cumulativeItemRotations[i] = 0;
    });
}

function handleOnLogoGroupMouseEnter(event) {
    document.getElementById('canvas').style.cursor = "pointer";
}

function handleOnLogoGroupMouseLeave(event) {
    document.getElementById('canvas').style.cursor = "default";
}

function handleOnLogoGroupMouseDrag(event) {
    document.getElementById('canvas').style.cursor = "grab";
    moveLogoGroup(event.delta)
}

function handleOnLogoGroupMouseUp(event) {
    document.getElementById('canvas').style.cursor = "default";
    resetLogoGroup();
}

export function init() {
    const canvas = document.getElementById('canvas')
    paper.setup(canvas);
    paper.project.importSVG(we3LogoSvg, onSVGLoad);
    createBackground();
    paper.view.draw();
}