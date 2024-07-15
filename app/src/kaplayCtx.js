import kaboom from "kaplay";

export const k = kaboom({
    global: false,
    touchToMouse: true,
    canvas: document.getElementById("game"),
    debug: true
});