/* global cellsToVectors, BFS, cells, gridSize, pacman, blinky, pinky, inky, clyde, biscuits, wall */
/* eslint-disable no-unused-vars */

function main() {

  const grid = document.querySelector('#grid')
  const scoreContainer = document.querySelector('#score-container')
  const score = document.querySelector('#score')
  const lives = document.querySelector('#lives')
  const homeScreen = document.querySelector('#home-screen')
  const startGame = document.querySelector('#start-game')
  score.innerHTML = `Score: ${pacman.score}`
  lives.innerHTML = `Lives: ${pacman.lives}`
  let pacmanInterval, blinkyInterval, pinkyInterval, inkyInterval, clydeInterval

  startGame.addEventListener('click', () => {

    homeScreen.style.display = 'none'
    grid.style.display = 'flex'
    scoreContainer.style.display = 'flex'
    createBoard(18, wall)

    setTimeout(() => {
      pacmanMovement()
      gameConditions()
      blinkyMovement()
      pinkyMovement()
      inkyMovement()
      clydeMovement()
    }, 3000)

  })

  // ! FUNCTIONS //

  // Creates game board
  function createBoard(gridSize, wall) {
    for (let i = 0; i < gridSize ** 2; i++) {

      const cell = document.createElement('div')

      if (i === blinky.position) {
        cell.classList.add('blinky')
      } else if (i === pinky.position) {
        cell.classList.add('pinky')
      } else if (i === clyde.position) {
        cell.classList.add('clyde')
      } else if (i === inky.position) {
        cell.classList.add('wrinkly')
      } else if (i === pacman.position) {
        cell.classList.add('pacman')
      } else if (wall.includes(i)) {
        cell.classList.add('wall')
      } else if (i <= gridSize - 1 || i % gridSize === 0 || i % gridSize - gridSize + 1 === 0 || i >= gridSize ** 2 - gridSize) {
        cell.classList.add('wall')
      } else if (biscuits.includes(i)) {
        cell.classList.add('biscuit')
      } else {
        cell.classList.add('seed')
      }
      // cell.innerHTML = i
      cells.push(cell)
      grid.append(cell)
    }

  }

  // Checks game conditions (collisions when pacman is fleeing and when ghosts are)
  function gameConditions() {
    const checkGameInterval = setInterval(() => {
      if ([blinky.position, pinky.position, clyde.position, inky.position].includes(pacman.position) && pacman.flee) {
        pacman.lives--
        removeLife()
        // clear all intervals 
        clearInterval(pacmanInterval)
        // reset ghost positions
        resetGhost(pinky, 169, 'pinky', pinkyInterval), resetGhost(blinky, 115, 'blinky', blinkyInterval), resetGhost(inky, 118, 'wrinkly', inkyInterval), resetGhost(clyde, 172, 'clyde', clydeInterval)
      } else if ([blinky.position, pinky.position, clyde.position, inky.position].includes(pacman.position) && !pacman.flee) {
        pacman.score += 10
        addScore()
        blinky.position === pacman.position ? resetGhost(blinky, 115, 'blinky', blinkyInterval) :
          pinky.position === pacman.position ? resetGhost(pinky, 169, 'pinky', pinkyInterval) :
            inky.position === pacman.position ? resetGhost(inky, 118, 'wrinkly', inkyInterval) :
              clyde.position === pacman.position ? resetGhost(clyde, 172, 'clyde', clydeInterval) : null
      }

    }, 10)
  }

  // Sets pacman flee variable to false for 5 seconds
  function pacmanChasing() {
    cells[pacman.position].classList.remove('biscuit')
    cells[blinky.position].classList.add('flee')
    cells[pinky.position].classList.add('flee')
    cells[inky.position].classList.add('flee')
    cells[clyde.position].classList.add('flee')
    pacman.flee = false
    setTimeout(() => {
      pacman.flee = true
      cells[blinky.position].classList.remove('flee')
      cells[pinky.position].classList.remove('flee')
      cells[inky.position].classList.remove('flee')
      cells[clyde.position].classList.remove('flee')
    }, 7000)
  }

  // Checks pacman classes nearby based on direction
  function pacmanClassLogic(direction) {
    let move
    direction === 'left' ? move = -1 :
      direction === 'up' ? move = -gridSize :
        direction === 'right' ? move = 1 :
          direction === 'down' ? move = gridSize : null

    if (cells[pacman.position + move].classList.contains('wall')) {
      return
    } else {
      if (cells[pacman.position + move].classList.contains('seed')) {
        cells[pacman.position + move].classList.remove('seed')
        pacman.score++
        addScore()
      }
      cells[pacman.position].classList.remove('pacman')
      pacman.position += move
      cells[pacman.position].classList.add('pacman')
      if (cells[pacman.position].classList.contains('biscuit')) {
        pacmanChasing()
      }
    }

  }

  // Pacman setIntervals
  function pacmanMovement() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 65 && pacman.ableToMove) {
        clearInterval(pacmanInterval)
        pacmanInterval = setInterval(() => {
          pacmanClassLogic('left')
        }, pacman.speed)
      }
      if (e.keyCode === 87 && pacman.ableToMove) {
        clearInterval(pacmanInterval)
        pacmanInterval = setInterval(() => {
          pacmanClassLogic('up')
        }, pacman.speed)
      }
      if (e.keyCode === 68 && pacman.ableToMove) {
        clearInterval(pacmanInterval)
        pacmanInterval = setInterval(() => {
          pacmanClassLogic('right')
        }, pacman.speed)
      }
      if (e.keyCode === 83 && pacman.ableToMove) {
        clearInterval(pacmanInterval)
        pacmanInterval = setInterval(() => {
          pacmanClassLogic('down')
        }, pacman.speed)
      }
    })
  }

  function resetGhost(ghost, position, ghostAsString, ghostInterval) {

    clearInterval(ghostInterval)
    cells[ghost.position].classList.remove(ghostAsString)
    cells[ghost.position].classList.remove('flee')
    ghost.position = position
    cells[ghost.position].classList.remove('seed')
    cells[ghost.position].classList.add(ghostAsString)
    setTimeout(() => {
      ghostAsString === 'blinky' ? blinkyMovement() :
        ghostAsString === 'pinky' ? pinkyMovement() :
          ghostAsString === 'wrinkly' ? inkyMovement() :
            ghostAsString === 'clyde' ? clydeMovement() :
              null
    }, 3000)

  }

  // Handles ghost class changes and movement over seeds
  function ghostMovement(ghost, ghostAsString, route) {
    if (!pacman.flee) {
      cells[ghost.position].classList.remove(ghostAsString)
      cells[ghost.position].classList.remove('flee')
      ghost.position += route[0]
      cells[ghost.position].classList.add(ghostAsString)
      cells[ghost.position].classList.add('flee')
    } else {
      cells[ghost.position].classList.remove(ghostAsString)
      cells[ghost.position].classList.remove('flee')
      ghost.position += route[0]
      cells[ghost.position].classList.add(ghostAsString)
    }
  }

  // Individual function containing the setIntervals for each ghost. This was done so that movement could be reset
  function blinkyMovement() {
    blinkyInterval = setInterval(() => {

      const ghostMap = cellsToVectors(cells, gridSize, 'blinky', pacman.flee)
      const ghostRoute = BFS(ghostMap, gridSize)
      ghostMovement(blinky, 'blinky', ghostRoute)

    }, blinky.speed)
  }

  function pinkyMovement() {
    pinkyInterval = setInterval(() => {

      const ghostMap = cellsToVectors(cells, gridSize, 'pinky', pacman.flee)
      const ghostRoute = BFS(ghostMap, gridSize)
      ghostMovement(pinky, 'pinky', ghostRoute)

    }, pinky.speed)
  }

  function inkyMovement() {
    inkyInterval = setInterval(() => {

      const ghostMap = cellsToVectors(cells, gridSize, 'wrinkly', pacman.flee)
      const ghostRoute = BFS(ghostMap, gridSize)
      ghostMovement(inky, 'wrinkly', ghostRoute)

    }, inky.speed)
  }

  function clydeMovement() {
    clydeInterval = setInterval(() => {

      const ghostMap = cellsToVectors(cells, gridSize, 'clyde', pacman.flee)
      const ghostRoute = BFS(ghostMap, gridSize)
      ghostMovement(clyde, 'clyde', ghostRoute)

    }, clyde.speed)
  }

  function addScore() {
    score.innerHTML = `Score: ${pacman.score}`
  }

  function removeLife() {
    lives.innerHTML = `Lives: ${pacman.lives}`
  }

}

window.addEventListener('DOMContentLoaded', main)