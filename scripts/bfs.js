/* eslint-disable */

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
function cellsToVectors(gameGridState, gridSize, ghostAsString, flee) {

  // split gameState into array of array (cells)
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
      if (!flee) {
        if (v.value.includes(ghostAsString)) {
          v.value = ghostAsString
          ghost = v
        } 
        if (ghostAsString === 'blinky' && y === 1 && x === gridSize - 3) {
          pacman = v
        } else if (ghostAsString === 'pinky' && y === 1 && x === 2) {
          pacman = v
        } else if (ghostAsString === 'wrinkly' && y === gridSize - 2 && x === gridSize - 3) {
          pacman = v
        } else if (ghostAsString === 'clyde' && y === gridSize - 2 && x === 2) {
          pacman = v
        }
      } else {
        if (v.value.includes(ghostAsString)) {
          v.value = ghostAsString
          ghost = v
        } else if (v.value.includes('pacman')) {
          v.value = 'pacman'
          pacman = v
        }
      }
      temp.push(v)      
    }
    grid.push(temp)

  }

  // object to hold the updated vector graph, ghost and pacman
  return {
    grid: grid,
    start: ghost,
    goal: pacman
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
  const start = gridStartGoalObject.start
  const goal = gridStartGoalObject.goal

  if (start.x === goal.x && start.y === goal.y) {
    return [0]
  }

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

module.exports = { Vector, cellsToVectors, neighbourCells, BFS, routeMap, coordsConverter }