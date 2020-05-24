function main() {

  const grid = document.querySelector('#grid')
  const cells = []
  const gridSize = 18
  let pacmanInterval
  let blinkyInterval
  let pinkyInterval
  let clydeInterval
  const blinky = 115
  const pinky = 169
  const clyde = 172
  let pacman = 296
  const wall = [
    26, 27, 38, 39, 40, 41, 42, 44, 45, 47, 48, 49, 50, 51, 56, 57, 58, 59, 60, 62, 63, 65, 66, 67, 68, 69, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 114, 119, 127, 128, 129, 130, 132, 134, 135, 137, 139, 140, 141, 142, 152, 153, 163, 164, 165, 166, 168, 173, 175, 176, 177, 178, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 196, 206, 207, 218, 219, 220, 222, 224, 225, 227, 229, 230, 231, 236, 237, 238, 240, 245, 247, 248, 249, 258, 259, 260, 261, 262, 263, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285
  ]

  function createBoard(gridSize, wall) {
    for (let i = 0; i < gridSize ** 2; i++) {

      const cell = document.createElement('div')
  
      if (i === blinky) {
        cell.classList.add('blinky')
      }
      if (i === pinky) {
        cell.classList.add('pinky')
      }
      if (i === clyde) {
        cell.classList.add('clyde')
      }
      if (i === pacman) {
        cell.classList.add('pacman')
      }
      if (wall.includes(i)) {
        cell.classList.add('wall')
      }
      if (i <= gridSize - 1 || i % gridSize === 0 || i %  gridSize - gridSize + 1 === 0 || i >= gridSize ** 2 - gridSize) {
        cell.classList.add('wall')
      }
      cells.push(cell)
      grid.append(cell)
  
    }

  }

  function ghostMovement(ghost, ghostAsString, speed) {
    if (ghostAsString === 'blinky') {
      blinkyInterval = setInterval(() => {
        if (ghost === pacman) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
          cells[pacman].classList.remove('pacman')
          cells[ghost].classList.add(ghostAsString)
        } else {
          const ghostMap = cellsToVectors(cells, gridSize, ghostAsString)
          const ghostRoute = BFS(ghostMap, gridSize)
          cells[ghost].classList.remove(ghostAsString)
          ghost += ghostRoute[0]
          cells[ghost].classList.add(ghostAsString)
        }
      }, speed)
    } else if (ghostAsString === 'pinky') {
      pinkyInterval = setInterval(() => {
        if (ghost === pacman) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
          cells[pacman].classList.remove('pacman')
          cells[ghost].classList.add(ghostAsString)
        } else {
          const ghostMap = cellsToVectors(cells, gridSize, ghostAsString)
          const ghostRoute = BFS(ghostMap, gridSize)
          cells[ghost].classList.remove(ghostAsString)
          ghost += ghostRoute[0]
          cells[ghost].classList.add(ghostAsString)
        }
      }, speed)
    } else if (ghostAsString === 'clyde') {
      clydeInterval = setInterval(() => {
        if (ghost === pacman) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
          cells[pacman].classList.remove('pacman')
          cells[ghost].classList.add(ghostAsString)
        } else {
          const ghostMap = cellsToVectors(cells, gridSize, ghostAsString)
          const ghostRoute = BFS(ghostMap, gridSize)
          cells[ghost].classList.remove(ghostAsString)
          ghost += ghostRoute[0]
          cells[ghost].classList.add(ghostAsString)
        }
      }, speed)
    }
  }

  function pacmanMovement(speed) {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 65) {
        if ([blinky, pinky, clyde].includes(pacman)) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
        } else {
          clearInterval(pacmanInterval)
          pacmanInterval = setInterval(() => {
            if (cells[pacman - 1].classList.contains('wall')) {
              return
            } else {
              cells[pacman].classList.remove('pacman')
              pacman--
              cells[pacman].classList.add('pacman')
            }
          }, speed)
        }
      } 
      if (e.keyCode === 87) {
        if ([blinky, pinky, clyde].includes(pacman)) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
        } else {
          clearInterval(pacmanInterval)
          pacmanInterval = setInterval(() => {
            if (cells[pacman - gridSize].classList.contains('wall')) {
              return
            } else {
              cells[pacman].classList.remove('pacman')
              pacman -= gridSize
              cells[pacman].classList.add('pacman')
            }
          }, speed)
        }
      } 
      if (e.keyCode === 68) {
        if ([blinky, pinky, clyde].includes(pacman)) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
        } else {
          clearInterval(pacmanInterval)
          pacmanInterval = setInterval(() => {
            if (cells[pacman + 1].classList.contains('wall')) {
              return
            } else {
              cells[pacman].classList.remove('pacman')
              pacman++
              cells[pacman].classList.add('pacman')
            }
          }, speed)
        }
      } 
      if (e.keyCode === 83) {
        if ([blinky, pinky, clyde].includes(pacman)) {
          clearInterval(blinkyInterval)
          clearInterval(pinkyInterval)
          clearInterval(clydeInterval)
        } else {
          clearInterval(pacmanInterval)
          pacmanInterval = setInterval(() => {
            if (cells[pacman + gridSize].classList.contains('wall')) {
              return
            } else {
              cells[pacman].classList.remove('pacman')
              pacman += gridSize
              cells[pacman].classList.add('pacman')
            }
          }, speed)
        }
      }
    })
  }

  createBoard(18, wall)
  ghostMovement(blinky, 'blinky', 400)
  ghostMovement(pinky, 'pinky', 600)
  ghostMovement(clyde, 'clyde', 800)
  pacmanMovement(200)
}

window.addEventListener('DOMContentLoaded', main)