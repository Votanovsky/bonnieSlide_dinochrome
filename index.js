import {
    updateSand, 
    setupSand
} from './sand.js'

import {
    updateBonnie, 
    setupBonnie, 
    getBonnieRect, 
    setBonnieLose,
    getBonnie
} from './bonnie.js'

import {updatePalm, 
    setupPalm, 
    getPalmRects,
    getPalms
} from './palm.js'
import { getCustomProperty } from './updateCustomProperty.js'


const world_width = 100
const world_height = 100
const speedScale_inc = .00005

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

// setPixelToWorldScale()
// window.addEventListener('resize', setPixelToWorldScale)
const startScreenButton = document.querySelector(".start_btn")
const startScreen = document.querySelector(".start")
startScreenButton.addEventListener("click", () => {
    startScreen.classList.add("hide")
    document.querySelector(".world").classList.remove("hide")
    setTimeout(() => {
        document.addEventListener("click", handleStart, {once: true})
    }, 500)
}, {once: true})


let lastTime
let speedScale
let score

function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime
    
    updateSand(delta, speedScale)
    updateBonnie(delta, speedScale)
    updatePalm(delta, speedScale)

    checkPalmBorderFadeOnDelete()

    updatespeedScale(delta)
    updateScore()

    if(checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() {
    const bonnieRect = getBonnieRect()
    return getPalmRects().some(rect => isCollision(rect, bonnieRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right
        &&
        rect1.right > rect2.left
        &&
        rect1.top < rect2.bottom
    )
}

function checkPalmBorderFadeOnDelete() {
    getPalms().forEach(palm => {
        if(palm.getBoundingClientRect().right < 0)
        {
            palm.remove()
            score++
        }
    })
}


function updateScore() {
    scoreElem.textContent = score
}

function updatespeedScale(delta) {
    speedScale += delta * speedScale_inc
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    
    setupSand()
    setupBonnie()
    setupPalm()

    startScreenElem.classList.add('hide')
    window.requestAnimationFrame(update)
}

function handleSubmit(e) {
    e.preventDefault()

    if(document.querySelector('input:invalid'))
    {
        const span = document.querySelector('.overlay_form-title > span')
        span.innerHTML = "Данные введены неверно<br>Проверь правильность телефона и почты"
        span.style.color = "#dd3277"
    }
    else
        fetch("/sheets.php").then(res => res.text()).then(res => console.log(res) )
}

function handleLose() {
    setBonnieLose()
    if(score === 0)
    {
        startScreenElem.textContent = "побробуй еще раз"
        
        setTimeout(() => {
        document.addEventListener("click", handleStart, { once: true })
        startScreenElem.classList.remove("hide")
        }, 100)
    }
    else {
        document.querySelector(".world").classList.add("hide")
        document.querySelector(".overlay_form").classList.remove("hide")

        document.querySelector("form").addEventListener("submit", handleSubmit)
    }
}

function setPixelToWorldScale() {
    let worldToPixelScale 
    if (window.innerWidth / window.innerHeight < world_width / world_height) {
        worldToPixelScale = window.innerWidth / world_width
    } else {
        worldToPixelScale = window.innerHeight / world_height
    }

    worldElem.style.width = `${world_width * worldToPixelScale}px`
    worldElem.style.height = `${world_height * worldToPixelScale}px`
}

window.addEventListener("contextmenu", e => e.preventDefault())