function main() {

  const grid = document.querySelector('#grid')
  const cells = []
  const gridSize = 18
  let blinky = 22
  let pinky = 169
  let pacman = 192
  const wall = [
    26, 27, 38, 39, 40, 41, 42, 44, 45, 47, 48, 49, 50, 51, 56, 57, 58, 59, 60, 62, 63, 65, 66, 67, 68, 69, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 114, 119, 127, 128, 129, 130, 132, 134, 135, 137, 139, 140, 141, 142, 152, 153, 163, 164, 165, 166, 168, 173, 175, 176, 177, 178, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 196, 206, 207, 218, 219, 220, 222, 224, 225, 227, 229, 230, 231, 236, 237, 238, 240, 245, 247, 248, 249, 258, 259, 260, 261, 262, 263, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285
  ]

  function createBoard(gridSize, blinky, pacmanPosition, wall) {
    for (let i = 0; i < gridSize ** 2; i++) {

      const cell = document.createElement('div')
  
      if (i === blinky) {
        cell.classList.add('blinky')
      }
      if (i === pacmanPosition) {
        cell.classList.add('pacman')
      }
      if (wall.includes(i)) {
        cell.classList.add('wall')
      }
      if (i <= gridSize - 1 || i % gridSize === 0 || i %  gridSize - gridSize + 1 === 0 || i >= gridSize ** 2 - gridSize) {
        cell.classList.add('wall')
      }
      cell.innerHTML = i
      cells.push(cell)
      grid.append(cell)
  
    }

  }

  createBoard(18, blinky, pacman, wall)

  const interval1 = setInterval(() => {
    if (blinky === pacman) {
      clearInterval(interval1)
      cells[pacman].classList.remove('pacman')
      cells[blinky].classList.add('blinky')
    } else {
      const blinkyMap = cellsToVectors(cells, gridSize)
      const blinkyRoute = BFS(blinkyMap, gridSize)
      cells[blinky].classList.remove('blinky')
      blinky += blinkyRoute[0]
      cells[blinky].classList.add('blinky')
    }
  }, 500)

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 65) {
      cells[pacman].classList.remove('pacman')
      pacman--
      cells[pacman].classList.add('pacman')
    } else if (e.keyCode === 87) {
      cells[pacman].classList.remove('pacman')
      pacman -= gridSize
      cells[pacman].classList.add('pacman')
    } else if (e.keyCode === 68) {
      cells[pacman].classList.remove('pacman')
      pacman++
      cells[pacman].classList.add('pacman')
    } else if (e.keyCode === 83) {
      cells[pacman].classList.remove('pacman')
      pacman += gridSize
      cells[pacman].classList.add('pacman')
    }

  })

}

window.addEventListener('DOMContentLoaded', main)

// ! BFS Functions below

// Vectors are essentially nodes
class Vector {
  constructor(y, x, value) {
    this.y = y
    this.x = x
    this.discovered = false
    this.parent = null
    this.value = value
  }
}

// Converts current game state (stored in cells) from an array into an array of arrays. Once split, it then recreates the board with vectors putting the new vector grid, ghost and pacman into an object which is fed into BFS algorithm
function cellsToVectors(gameGridState, gridSize) {

  // split gameState into array or array (cells)
  const updatedState = []
  for (let i = 0; i < gameGridState.length; i += gridSize) {
    updatedState.push(gameGridState.slice(i, i + gridSize))
  }    

  const grid = []
  let ghost
  let pacman
  for (let y = 0; y < gridSize; y++) {
    const temp = []
    for (let x = 0; x < gridSize; x++) {
      const v = new Vector(y, x, updatedState[y][x].className)
      if (v.value === 'blinky' || v.value === 'pinky' || v.value === 'inky' || v.value === 'clyde') {
        ghost = v
      } else if (v.value === 'pacman') {
        pacman = v
      }
      temp.push(v)      
    }
    grid.push(temp)
  }
  
  // object to hold the updated vector graph, ghost and pacman
  return {
    grid: grid,
    ghost: ghost,
    pacman: pacman
  }

}

// Finds neighbouring cells (will ony ever be 1 square away), then removes all of the coordinates from the result array containing -1 or a value higher than the width or height of the grid minus 1. Will eventually add checks for borders so that it only returns result with valid coords.
function neighbourCells(grid, position) {
  const result = []
  result.push(
    { y: position.y, x: position.x + 1, value: position.value }, 
    { y: position.y, x: position.x - 1 , value: position.value }, 
    { y: position.y - 1, x: position.x, value: position.value }, 
    { y: position.y + 1, x: position.x, value: position.value }
  )

  return result.filter(coord => {
    return (coord.x  >= 0 && coord.x < grid.length) && 
      (coord.y >= 0 && coord.y < grid.length) && 
      coord.value !== 'wall'
  })

}

// Created from pseudocode provided on wikipedia. Cycles through vectors until the current vectors x and y coordinates are the same as the goal coords. Once they are, the routeMap function is called which generates the array of objects containing x and y coordinates for the ghost to follow. Currently, the idea is for the ghosts to follow the route until they reach an intersection and then re-evaluate their route in relation to pacman
function BFS(gridStartGoalObject, gridSize) {

  const grid = gridStartGoalObject.grid
  const start = gridStartGoalObject.ghost
  const goal = gridStartGoalObject.pacman

  const q = []
  start.discovered = true
  q.unshift(start)

  while (q.length > 0) {
    const v = q.pop()

    if (v.x === goal.x && v.y === goal.y) {
      return routeMap(v, gridSize)
    }

    const adjacentCells = neighbourCells(grid, v)

    adjacentCells.forEach(coord => {
      if (grid[coord.y][coord.x].discovered === false) {
        grid[coord.y][coord.x].discovered = true
        grid[coord.y][coord.x].parent = v
        q.unshift(grid[coord.y][coord.x])
      }
    })

  }

}

function routeMap(vector, gridSize) {
  let path = vector
  const coords = []

  while (path.parent !== null) {
    coords.unshift({ y: path.y, x: path.x })
    path = path.parent
  }

  const startV = path
  const route = []

  route.push(coordsConverter(
    startV.x, 
    startV.y, 
    coords[0].x, 
    coords[0].y,
    gridSize
  ))

  for (let i = 0; i < coords.length; i++) {
    if (i === coords.length - 1) {
      return route
    } else {
      route.push(
        coordsConverter(
          coords[i].x, 
          coords[i].y, 
          coords[i + 1].x, 
          coords[i + 1].y,
          gridSize
        )
      )
    }
  }
}

function coordsConverter(startX, startY, endX, endY, gridSize) {
  if (startX < endX) {
    return 1
  } else if (startX > endX) {
    return -1
  } else if (startY < endY) {
    return gridSize
  } else if (startY > endY) {
    return gridSize - gridSize * 2
  }
}

// module.exports = { neighbourCells, BFS, routeMap }